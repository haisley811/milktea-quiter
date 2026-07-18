import { StatCard } from "@/components/StatCard";
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

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="登录状态" value="未登录" tone="purple" />
        <StatCard label="同步方式" value="本地" tone="mint" />
        <StatCard label="本机记录" value={`${stats.records.length}`} tone="pink" />
        <StatCard label="存储 Key" value="milkTeaAppData" tone="amber" />
      </div>

      <ThemeControls
        activeTheme={activeTheme}
        showCharacter={showCharacter}
        onThemeChange={onThemeChange}
        onShowCharacterChange={onShowCharacterChange}
      />

      <WardrobeShop stats={stats} wardrobe={wardrobe} onPurchase={onPurchaseOutfit} onEquip={onEquipOutfit} />

      <section className="glass-card rounded-[30px] p-5">
        <h2 className="text-lg font-black text-[#4C3575]">后续账号数据</h2>
        <div className="mt-4 space-y-3 text-sm font-semibold text-[#6D5A8C]">
          <div className="rounded-[22px] bg-white/65 p-4">
            <p className="font-black text-[#4C3575]">微信小程序</p>
            <p className="mt-1 text-xs leading-relaxed text-[#8A74AA]">可接入 openid、云数据库、跨设备同步和订阅提醒。</p>
          </div>
          <div className="rounded-[22px] bg-white/65 p-4">
            <p className="font-black text-[#4C3575]">iOS 应用</p>
            <p className="mt-1 text-xs leading-relaxed text-[#8A74AA]">可接入 UserDefaults、iCloud、健康提醒和桌面小组件。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
