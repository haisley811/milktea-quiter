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
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-[#8A74AA]">个人账号与同步</p>
        <h1 className="mt-1 text-3xl font-black text-[#4C3575]">我的</h1>
      </header>

      <section className="glass-card rounded-[32px] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#F3E8FF] to-[#DDF8F5] text-2xl font-black text-[#7C5BD6]">
            今
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-[#4C3575]">本地体验账号</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#8A74AA]">
              第一版暂不登录，数据保存在当前浏览器。后续可迁移到微信小程序云存储或 iOS 本地账号。
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
