import { ThemeControls } from "@/components/ThemeControls";
import { WardrobeShop } from "@/components/WardrobeShop";
import type { AppStats } from "@/lib/types";
import type { UiThemeKey } from "@/lib/uiPreferences";
import type { OutfitId, WardrobeState } from "@/lib/wardrobe";

type ProfileViewProps = {
  stats: AppStats;
  activeTheme: UiThemeKey;
  showCharacter: boolean;
  onThemeChange: (theme: UiThemeKey) => void;
  onShowCharacterChange: (showCharacter: boolean) => void;
  wardrobe: WardrobeState;
  onPurchaseOutfit: (id: OutfitId) => void;
  onEquipOutfit: (id: OutfitId) => void;
};

export function ProfileView({
  stats,
  activeTheme,
  showCharacter,
  onThemeChange,
  onShowCharacterChange,
  wardrobe,
  onPurchaseOutfit,
  onEquipOutfit
}: ProfileViewProps) {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-[13px] font-bold text-[#6F5B8F]">账户与个性化</p>
        <h1 className="mt-1 text-[30px] font-black leading-none text-[#4C3575]">我的</h1>
      </header>

      <section className="glass-card rounded-[26px] p-5" aria-label="当前账户状态">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#F3E8FF] to-[#DDF8F5] text-xl font-black text-[#6D4FC2]">
            今
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-black text-[#4C3575]">本地模式</p>
              <span className="rounded-full bg-[#DDF8F5] px-2.5 py-1 text-[11px] font-black text-[#226962]">无需登录</span>
            </div>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#6F5B8F]">
              记录、衣橱和界面设置仅保存在此设备。当前已有 {stats.records.length} 条记录。
            </p>
          </div>
        </div>
      </section>

      <ThemeControls
        activeTheme={activeTheme}
        showCharacter={showCharacter}
        onThemeChange={onThemeChange}
        onShowCharacterChange={onShowCharacterChange}
      />

      <WardrobeShop stats={stats} wardrobe={wardrobe} onPurchase={onPurchaseOutfit} onEquip={onEquipOutfit} />

    </div>
  );
}
