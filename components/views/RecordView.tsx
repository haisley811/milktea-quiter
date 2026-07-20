import { CharacterDisplay } from "@/components/CharacterDisplay";
import { FormRow } from "@/components/FormRow";
import { ModeCard } from "@/components/ModeCard";
import { PillButton } from "@/components/PillButton";
import {
  drinkSizeOptions,
  drinkTypeOptions,
  iceOptions,
  sugarOptions,
  toppingOptions
} from "@/lib/drinkRules";
import type { AppStats, DrinkEstimate, DrinkForm, Topping } from "@/lib/types";
import type { OutfitId } from "@/lib/wardrobe";

type RecordViewProps = {
  stats: AppStats;
  form: DrinkForm;
  estimate: DrinkEstimate;
  showCharacter: boolean;
  outfitId: OutfitId;
  isEstimateLoading: boolean;
  isSubmitting: boolean;
  updateForm: (next: Partial<DrinkForm>) => void;
  submitRecord: () => void;
};

export function RecordView({ stats, form, estimate, showCharacter, outfitId, isEstimateLoading, isSubmitting, updateForm, submitRecord }: RecordViewProps) {
  const savedMode = form.mode === "saved";
  const displayEstimate = applyManualEstimateForDisplay(estimate, form);
  const estimateKey = `${form.mode}-${estimate.price}-${estimate.calories}-${estimate.sugarGram}-${estimate.source}-${estimate.confidence}-${isEstimateLoading}`;
  const estimateStatus = getEstimateStatus(estimate.source, isEstimateLoading);

  function toggleTopping(topping: Topping) {
    const exists = form.toppings.includes(topping);
    updateForm({
      toppings: exists ? form.toppings.filter((item) => item !== topping) : [...form.toppings, topping]
    });
  }

  function updateManualEstimate(field: keyof Pick<DrinkEstimate, "price" | "calories" | "sugarGram">, value: string) {
    const parsed = normalizeEstimateInput(field, value);
    const nextManual = { ...(form.manualEstimate ?? {}) };

    if (parsed === undefined) {
      delete nextManual[field];
    } else {
      nextManual[field] = parsed;
    }

    updateForm({ manualEstimate: Object.keys(nextManual).length ? nextManual : undefined });
  }

  const hasManualEstimate = Boolean(
    form.manualEstimate?.price !== undefined ||
      form.manualEstimate?.calories !== undefined ||
      form.manualEstimate?.sugarGram !== undefined
  );

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#6F5B8F]">每一次选择，都离目标更近一点</p>
          <h1 className="mt-1 text-[30px] font-black leading-none text-[#4C3575]">记录一杯</h1>
        </div>
        {showCharacter ? (
          <div className="w-24 shrink-0">
            <CharacterDisplay bodyScore={stats.bodyScore} outfitId={outfitId} compact />
          </div>
        ) : null}
      </header>

      <div className="grid grid-cols-2 gap-3">
        <ModeCard title="今天戒了" text="虚拟下单，不真的喝" active={savedMode} onClick={() => updateForm({ mode: "saved" })} tone="mint" />
        <ModeCard title="今天喝了" text="真实记录，温柔看见" active={form.mode === "consumed"} onClick={() => updateForm({ mode: "consumed" })} tone="pink" />
      </div>

      <section className="glass-card space-y-5 rounded-[26px] p-5">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-[#806A9F]">记录信息</p>
              <h2 className="text-lg font-black text-[#4C3575]">饮品信息</h2>
            </div>
            <span className="rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-black text-[#6D5A8C]">
              {savedMode ? "未下单" : "已喝"}
            </span>
          </div>

          <div className="space-y-5">
            <FormRow label="饮品类型" icon="杯" hint="会影响默认价格、热量和糖分">
              {drinkTypeOptions.map((item) => (
                <PillButton key={item} label={item} selected={form.drinkType === item} onClick={(value) => updateForm({ drinkType: value })} />
              ))}
            </FormRow>

            <TextInput
              label="饮品名称"
              icon="名"
              hint="命中本地预设时估算更准确；留空会使用饮品类型默认值。"
              value={form.drinkName}
              placeholder="例如：喜茶多肉葡萄"
              onChange={(value) => updateForm({ drinkName: value })}
            />

            <FormRow label="杯型" icon="量" hint="杯型会调整热量估算">
              {drinkSizeOptions.map((item) => (
                <PillButton key={item} label={item} selected={form.size === item} onClick={(value) => updateForm({ size: value })} tone="mint" />
              ))}
            </FormRow>

            <FormRow label="冰量" icon="冰" hint="第一版只记录，不参与计算">
              {iceOptions.map((item) => (
                <PillButton key={item} label={item} selected={form.ice === item} onClick={(value) => updateForm({ ice: value })} />
              ))}
            </FormRow>

            <FormRow label="糖量" icon="糖" hint="糖量会影响热量和糖分">
              {sugarOptions.map((item) => (
                <PillButton key={item} label={item} selected={form.sugar === item} onClick={(value) => updateForm({ sugar: value })} tone="pink" />
              ))}
            </FormRow>

            <FormRow label="小料" icon="料" hint="可多选，会增加价格和摄入">
              {toppingOptions.map((item) => (
                <PillButton key={item} label={item} selected={form.toppings.includes(item)} onClick={toggleTopping} tone="amber" />
              ))}
            </FormRow>

            <TextInput
              label="自定义小料"
              icon="加"
              hint="留空不计算；填写后会按轻量加料估算。"
              value={form.customTopping}
              placeholder="例如：奶盖、布丁、麻薯"
              onChange={(value) => updateForm({ customTopping: value })}
            />
          </div>
        </div>

        <div key={estimateKey} className="estimate-pop rounded-[22px] border border-[#E7D8FF] bg-[#FAF7FF]/82 p-4 text-sm font-bold text-[#5F4A7E]" aria-live="polite">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-[#806A9F]">智能分析</p>
              <p className="text-sm font-black text-[#4C3575]">实时估算</p>
            </div>
            <span className="flex flex-wrap items-center justify-end gap-2">
              <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-[#8A74AA]">
                {isEstimateLoading ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="loading-spinner purple-spinner" aria-hidden="true" />
                    AI智能分析中
                  </span>
                ) : (
                  <>{estimate.source} · 可信度{estimate.confidence}</>
                )}
              </span>
              {hasManualEstimate ? (
                <button
                  type="button"
                  onClick={() => updateForm({ manualEstimate: undefined })}
                  className="soft-focus rounded-full border border-[#E7D8FF] bg-white px-3 py-1 text-xs font-black text-[#4C3575] shadow-[0_8px_20px_rgba(76,53,117,0.08)] transition hover:-translate-y-0.5 active:scale-95"
                >
                  恢复建议值
                </button>
              ) : null}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
            <EstimateInput
              label="价格"
              prefix="¥"
              value={displayEstimate.price}
              step="0.1"
              edited={form.manualEstimate?.price !== undefined}
              onChange={(value) => updateManualEstimate("price", value)}
            />
            <EstimateInput
              label="热量"
              suffix="kcal"
              value={displayEstimate.calories}
              step="1"
              edited={form.manualEstimate?.calories !== undefined}
              onChange={(value) => updateManualEstimate("calories", value)}
            />
            <EstimateInput
              label="糖分"
              suffix="g"
              value={displayEstimate.sugarGram}
              step="1"
              edited={form.manualEstimate?.sugarGram !== undefined}
              onChange={(value) => updateManualEstimate("sugarGram", value)}
            />
          </div>
          <div className="mt-3 rounded-[18px] bg-white/70 px-3 py-2 text-xs font-black leading-relaxed text-[#6D5A8C]">
            提交后：钱包 {savedMode ? "+" : "-"}¥{displayEstimate.price} · {savedMode ? "少摄入" : "增加"} {displayEstimate.calories} kcal ·{" "}
            {displayEstimate.sugarGram}g 糖 · Body Score {savedMode ? "-2" : "+2"}
          </div>
          <div className={`mt-3 flex items-center justify-center gap-2 rounded-[18px] px-3 py-2 text-xs font-black ${estimateStatus.className}`}>
            <span className={`h-2 w-2 rounded-full ${estimateStatus.dotClassName}`} aria-hidden="true" />
            {estimateStatus.text}
          </div>
          {hasManualEstimate ? (
            <div className="mt-3 rounded-[18px] border border-[#A78BFA]/30 bg-[#F3E8FF]/70 px-3 py-2 text-center text-xs font-black text-[#4C3575]">
              已应用手动值，提交会按你编辑的数字保存。
            </div>
          ) : null}
          <p className="mt-2 text-center text-xs text-[#9886B5]">数据为估算值，仅供参考；可直接修改上方数字。</p>
        </div>

        <button
          type="button"
          onClick={submitRecord}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`soft-focus ${isSubmitting ? "submit-busy" : ""} min-h-[54px] w-full rounded-[22px] px-5 py-4 text-base font-black text-white shadow-[0_14px_30px_rgba(124,91,214,0.22)] transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:hover:translate-y-0 disabled:active:scale-100 ${
            savedMode ? "bg-gradient-to-r from-[#8EDDD3] to-[#A78BFA]" : "bg-gradient-to-r from-[#F8BBD9] to-[#FFBF8A]"
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isSubmitting ? <span className="loading-spinner" aria-hidden="true" /> : null}
            {isSubmitting ? "记录中..." : savedMode ? "确认不下单" : "确认记录"}
          </span>
        </button>
      </section>
    </div>
  );
}

function TextInput({
  label,
  hint,
  value,
  placeholder,
  onChange
}: {
  label: string;
  icon: string;
  hint: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[22px] border border-transparent px-1 py-1 transition duration-200 hover:border-white/70 hover:bg-white/45 focus-within:border-[#A78BFA]/40 focus-within:bg-white/60">
      <span className="mb-2 block space-y-1">
        <span className="flex items-center gap-2 text-sm font-black text-[#4C3575]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#7C5BD6] shadow-[0_0_0_4px_rgba(124,91,214,0.12)]" aria-hidden="true" />
          {label}
        </span>
        <span className="block text-xs font-semibold leading-snug text-[#9886B5]">{hint}</span>
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="soft-focus min-h-12 w-full rounded-[18px] border border-[#E7D8FF] bg-white/84 px-4 py-3 text-base font-semibold text-[#4C3575] placeholder:text-[#9D8CB4] transition duration-200 focus:border-[#7C5BD6] focus:bg-white"
      />
    </label>
  );
}

function getEstimateStatus(source: DrinkEstimate["source"], isLoading: boolean) {
  if (isLoading) {
    return {
      text: "正在连接本机 AI 后端",
      className: "bg-white/70 text-[#8A74AA]",
      dotClassName: "status-pulse bg-[#C4B5FD] shadow-[0_0_0_4px_rgba(196,181,253,0.18)]"
    };
  }

  if (source === "AI智能估算") {
    return {
      text: "AI已连接，已使用模型估算",
      className: "bg-white/70 text-[#3F8F86]",
      dotClassName: "bg-[#8EDDD3] shadow-[0_0_0_4px_rgba(142,221,211,0.22)]"
    };
  }

  return {
    text: "本地临时值，启动预览服务后会自动尝试 AI",
    className: "bg-white/70 text-[#A6753F]",
    dotClassName: "bg-[#FFBF8A] shadow-[0_0_0_4px_rgba(255,191,138,0.24)]"
  };
}

function EstimateInput({
  label,
  prefix,
  suffix,
  value,
  step,
  edited,
  onChange
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
  step: string;
  edited?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`grid min-w-0 gap-1 rounded-[18px] border px-2 py-2 transition focus-within:border-[#7C5BD6] focus-within:bg-white ${
        edited ? "border-[#A78BFA]/50 bg-gradient-to-br from-[#F3E8FF] to-white shadow-[0_10px_24px_rgba(167,139,250,0.16)]" : "border-transparent bg-white/70"
      }`}
    >
      <span className="flex items-center justify-between gap-2 text-[11px] font-black text-[#9886B5]">
        {label}
        {edited ? <span className="rounded-full bg-[#A78BFA]/15 px-2 py-0.5 text-[10px] text-[#7C5BD6]">已改</span> : null}
      </span>
      <span className="flex min-w-0 items-center gap-1 text-xs font-black text-[#4C3575]">
        {prefix ? <span>{prefix}</span> : null}
        <input
          type="number"
          min="0"
          step={step}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label}，可手动修改`}
          className="soft-focus min-h-11 min-w-0 flex-1 rounded-[14px] border border-[#E7D8FF] bg-white/85 px-2 py-2 text-center text-base font-black text-[#4C3575] transition duration-200 focus:border-[#7C5BD6] focus:bg-white"
        />
        {suffix ? <span>{suffix}</span> : null}
      </span>
    </label>
  );
}

function applyManualEstimateForDisplay(estimate: DrinkEstimate, form: DrinkForm) {
  const manual = form.manualEstimate ?? {};

  return {
    ...estimate,
    price: manual.price ?? estimate.price,
    calories: manual.calories ?? estimate.calories,
    sugarGram: manual.sugarGram ?? estimate.sugarGram
  };
}

function normalizeEstimateInput(field: keyof Pick<DrinkEstimate, "price" | "calories" | "sugarGram">, value: string) {
  if (value === "") {
    return undefined;
  }

  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return undefined;
  }

  return field === "price" ? Math.round(number * 10) / 10 : Math.round(number);
}
