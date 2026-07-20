"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { LoadingView } from "@/components/LoadingView";
import { ResetConfirmModal } from "@/components/ResetConfirmModal";
import { ResultModal } from "@/components/ResultModal";
import { Toast, type ToastTone } from "@/components/Toast";
import { DataView } from "@/components/views/DataView";
import { HomeView } from "@/components/views/HomeView";
import { ProfileView } from "@/components/views/ProfileView";
import { RecordView } from "@/components/views/RecordView";
import { resetAppData, submitDrinkForm } from "@/lib/appActions";
import { createRemoteAIEstimateProvider, estimateDrinkSmart } from "@/lib/aiEstimate";
import { defaultForm } from "@/lib/defaultForm";
import { estimateDrink } from "@/lib/drinkRules";
import { webHaptics } from "@/lib/haptics";
import { initialStats, rebuildStats } from "@/lib/stats";
import { clearAppStats, loadAppStats, saveAppStats } from "@/lib/storage";
import { loadWardrobe, saveWardrobe } from "@/lib/wardrobeStorage";
import { availableCoins, equipOutfit, findOutfit, purchaseOutfit, defaultWardrobeState, type OutfitId, type WardrobeState } from "@/lib/wardrobe";
import {
  defaultUiPreferences,
  loadUiPreferences,
  saveUiPreferences,
  type UiThemeKey,
  type UiPreferences
} from "@/lib/uiPreferences";
import type { AppStats, DrinkEstimate, DrinkForm, DrinkMode, DrinkRecord } from "@/lib/types";
import type { ViewKey } from "@/lib/viewTypes";

const aiEstimateProvider = createRemoteAIEstimateProvider();

export default function AppPage() {
  const [stats, setStats] = useState<AppStats>(initialStats);
  const [activeView, setActiveView] = useState<ViewKey>("home");
  const [form, setForm] = useState<DrinkForm>(defaultForm);
  const [resultRecord, setResultRecord] = useState<DrinkRecord | null>(null);
  const [resetRequested, setResetRequested] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEstimateLoading, setIsEstimateLoading] = useState(false);
  const [smartEstimate, setSmartEstimate] = useState<DrinkEstimate>(() => estimateDrink(defaultForm));
  const [isViewSwitching, setIsViewSwitching] = useState(false);
  const [uiPreferences, setUiPreferences] = useState<UiPreferences>(defaultUiPreferences);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeState>(defaultWardrobeState);
  const switchTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setStats(loadAppStats());
    setUiPreferences(loadUiPreferences());
    setWardrobe(loadWardrobe());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      const result = saveAppStats(stats);
      if (!result.ok) {
        showToast("本地保存暂时失败，请检查浏览器存储权限", "warning");
      }
    }
  }, [isReady, stats]);

  useEffect(() => {
    if (isReady) {
      saveUiPreferences(uiPreferences);
    }
  }, [isReady, uiPreferences]);

  useEffect(() => {
    if (isReady && !saveWardrobe(wardrobe)) {
      showToast("衣橱暂时没有保存成功，请检查浏览器存储权限", "warning");
    }
  }, [isReady, wardrobe]);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) window.clearTimeout(switchTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (!button || button.disabled || button.getAttribute("aria-busy") === "true") return;

      const rect = button.getBoundingClientRect();
      button.style.setProperty("--tap-x", `${event.clientX - rect.left}px`);
      button.style.setProperty("--tap-y", `${event.clientY - rect.top}px`);
      button.classList.remove("tap-burst");
      void button.offsetWidth;
      button.classList.add("tap-burst");
      webHaptics.feedback(button.dataset.haptic === "warning" ? "warning" : "light");
    }

    function handleAnimationEnd(event: AnimationEvent) {
      const target = event.target as HTMLElement | null;
      if (event.animationName === "tap-burst") {
        target?.classList.remove("tap-burst");
      }
    }

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("animationend", handleAnimationEnd);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

  const estimate = useMemo(() => estimateDrink(form), [form]);

  useEffect(() => {
    let cancelled = false;

    setSmartEstimate(estimate);
    setIsEstimateLoading(true);

    estimateDrinkSmart(form, aiEstimateProvider)
      .then((nextEstimate) => {
        if (!cancelled) {
          setSmartEstimate(nextEstimate);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsEstimateLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [estimate, form]);

  function updateForm(next: Partial<DrinkForm>) {
    const shouldResetManualEstimate = Object.keys(next).some((key) => key !== "mode" && key !== "manualEstimate");

    setForm((current) => ({
      ...current,
      ...next,
      manualEstimate:
        "manualEstimate" in next
          ? next.manualEstimate
          : shouldResetManualEstimate
            ? undefined
            : current.manualEstimate
    }));
  }

  function startRecord(mode: DrinkMode) {
    setForm((current) => ({ ...current, mode }));
    changeView("record");
  }

  function changeView(nextView: ViewKey) {
    if (nextView === activeView) return;
    if (switchTimerRef.current) window.clearTimeout(switchTimerRef.current);

    setIsViewSwitching(true);
    setActiveView(nextView);

    switchTimerRef.current = window.setTimeout(() => {
      setIsViewSwitching(false);
      switchTimerRef.current = null;
    }, 220);
  }

  function submitRecord() {
    if (isSubmitting) return;

    const statsSnapshot = stats;
    const formSnapshot = form;
    const estimateSnapshot = smartEstimate;

    setIsSubmitting(true);

    window.setTimeout(() => {
      const result = submitDrinkForm(statsSnapshot, formSnapshot, estimateSnapshot);
      webHaptics.feedback(result.record.mode === "saved" ? "success" : "medium");
      setStats(result.stats);
      if (result.record.mode === "saved") {
        showToast("下单成功，加 10 金币", "success");
      }
      setResultRecord(result.record);
      setForm(defaultForm);
      setIsSubmitting(false);
    }, 260);
  }

  function deleteRecord(recordId: string) {
    webHaptics.feedback("warning");
    setStats((current) => rebuildStats(current.records.filter((record) => record.id !== recordId), 50));
    showToast("已删除这条记录，数据已重新计算", "success");
  }

  function resetAllData() {
    webHaptics.feedback("warning");
    const result = clearAppStats();
    setStats(resetAppData());
    setWardrobe(defaultWardrobeState);
    setResetRequested(false);
    showToast(result.ok ? "已清空记录，Body Score 已恢复到 50" : "页面已重置，但本地存储清理失败", result.ok ? "success" : "warning");
  }

  function purchaseWardrobeOutfit(outfitId: OutfitId) {
    const next = purchaseOutfit(stats.records, wardrobe, outfitId);
    if (!next) {
      const needed = Math.max(0, findOutfit(outfitId).price - availableCoins(stats.records, wardrobe));
      showToast(`金币还差 ${needed}，再成功戒几杯就可以啦`, "warning");
      return;
    }
    setWardrobe(next);
    showToast(`已兑换 ${findOutfit(outfitId).name}，快给小人换上吧`, "success");
  }

  function equipWardrobeOutfit(outfitId: OutfitId) {
    setWardrobe((current) => equipOutfit(current, outfitId));
    showToast(`已换上 ${findOutfit(outfitId).name}`, "success");
  }

  function changeUiTheme(theme: UiThemeKey) {
    setUiPreferences((current) => ({ ...current, theme }));
    showToast("界面风格已切换", "success");
  }

  function changeCharacterVisibility(showCharacter: boolean) {
    setUiPreferences((current) => ({ ...current, showCharacter }));
    showToast(showCharacter ? "人物展示已开启" : "人物展示已隐藏", "info");
  }

  function showToast(message: string, tone: ToastTone = "info") {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ message, tone });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 1800);
  }

  const view = {
    home: <HomeView stats={stats} showCharacter={uiPreferences.showCharacter} outfitId={wardrobe.equippedOutfitId} onStartRecord={startRecord} />,
    record: (
      <RecordView
        stats={stats}
        form={form}
        estimate={smartEstimate}
        showCharacter={uiPreferences.showCharacter}
        outfitId={wardrobe.equippedOutfitId}
        isEstimateLoading={isEstimateLoading}
        isSubmitting={isSubmitting}
        updateForm={updateForm}
        submitRecord={submitRecord}
      />
    ),
    data: (
      <DataView
        stats={stats}
        showCharacter={uiPreferences.showCharacter}
        outfitId={wardrobe.equippedOutfitId}
        onDeleteRecord={deleteRecord}
        onReset={() => setResetRequested(true)}
      />
    ),
    profile: (
      <ProfileView
        stats={stats}
        activeTheme={uiPreferences.theme}
        showCharacter={uiPreferences.showCharacter}
        onThemeChange={changeUiTheme}
        onShowCharacterChange={changeCharacterVisibility}
        wardrobe={wardrobe}
        onPurchaseOutfit={purchaseWardrobeOutfit}
        onEquipOutfit={equipWardrobeOutfit}
      />
    )
  }[activeView];

  return (
    <main
      className="app-root min-h-[100svh] px-3 py-4 text-[#4C3575]"
      data-ui-theme={uiPreferences.theme}
      data-character-visibility={uiPreferences.showCharacter ? "shown" : "hidden"}
    >
      <a className="skip-link" href="#app-content">跳到主要内容</a>
      <section className="app-frame mx-auto min-h-[calc(100svh-32px)] max-w-[430px] overflow-hidden rounded-[38px] border border-white/80 bg-[#F8F4FF]/70 shadow-[0_24px_80px_rgba(76,53,117,0.16)] backdrop-blur-xl">
        <div className="app-status flex items-center justify-between px-6 pt-4 text-xs font-bold text-[#6F5B8F]">
          <span>9:41</span>
          <span>今天不喝</span>
          <span>100%</span>
        </div>
        {isViewSwitching ? (
          <div className="mx-5 mt-3 h-1.5 overflow-hidden rounded-full bg-white/65" role="status" aria-label="页面切换中">
            <span className="view-switch-bar block h-full rounded-full" />
          </div>
        ) : null}
        <div id="app-content" key={isReady ? activeView : "loading"} className="app-content screen-enter px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">
          {isReady ? view : <LoadingView />}
        </div>
      </section>

      <BottomNav activeView={activeView} isSwitching={isViewSwitching} onChange={changeView} />

      {resultRecord ? (
        <ResultModal
          record={resultRecord}
          showCharacter={uiPreferences.showCharacter}
          outfitId={wardrobe.equippedOutfitId}
          onHome={() => {
            setResultRecord(null);
            changeView("home");
          }}
          onData={() => {
            setResultRecord(null);
            changeView("data");
          }}
        />
      ) : null}

      {resetRequested ? <ResetConfirmModal onCancel={() => setResetRequested(false)} onConfirm={resetAllData} /> : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </main>
  );
}
