import { CharacterDisplay } from "@/components/CharacterDisplay";
import { StatCard } from "@/components/StatCard";
import { getCharacterStageMeta } from "@/lib/character";
import { getTodayRecordSummary } from "@/lib/stats";
import type { AppStats, DrinkMode } from "@/lib/types";
import type { OutfitId } from "@/lib/wardrobe";

type HomeViewProps = {
  stats: AppStats;
  showCharacter: boolean;
  outfitId: OutfitId;
  onStartRecord: (mode: DrinkMode) => void;
};

export function HomeView({ stats, showCharacter, outfitId, onStartRecord }: HomeViewProps) {
  const todaySummary = getTodayRecordSummary(stats.records);
  const stage = getCharacterStageMeta(stats.bodyScore);
  const lightness = 100 - stats.bodyScore;
  const todayTone = todaySummary.netMoney >= 0 ? "from-[#DDF8F5] to-[#F3E8FF]" : "from-[#FFF0F7] to-[#FFF4DD]";

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-[#8A74AA]">和奶茶说拜拜的第 {Math.max(stats.streakDays, 1)} 天</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1 className="text-4xl font-black tracking-normal text-[#4C3575]">今天不喝</h1>
          {showCharacter ? (
            <span className="mb-1 shrink-0 rounded-full bg-white/75 px-3 py-1 text-xs font-black text-[#6D5A8C] shadow-[0_8px_20px_rgba(76,53,117,0.08)]">
              轻盈度 {lightness}%
            </span>
          ) : null}
        </div>
      </header>

      {showCharacter ? <CharacterDisplay bodyScore={stats.bodyScore} outfitId={outfitId} withBubble /> : null}

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="累计省钱" value={`¥${stats.totalSavedMoney}`} hint={`净钱包 ¥${stats.netMoney}`} tone="mint" />
        <StatCard label="累计减少热量" value={`${stats.totalReducedCalories}`} hint="kcal" tone="purple" />
        <StatCard label="累计减少糖分" value={`${stats.totalReducedSugar}g`} hint="少一点也很棒" tone="pink" />
        {showCharacter ? <StatCard label="Body Score" value={`${stats.bodyScore}`} hint={stage.label} tone="amber" /> : null}
      </div>

      <div className="glass-card rounded-[30px] p-4">
        <div className={`mb-3 rounded-[24px] bg-gradient-to-r ${todayTone} px-4 py-3`} aria-live="polite">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-black text-[#4C3575]">
                {todaySummary.total ? `今日已记录 ${todaySummary.total} 次` : "今日还没记录"}
              </p>
              <p className="mt-1 text-xs font-semibold leading-snug text-[#7D679D]">
                {todaySummary.total
                  ? `戒了 ${todaySummary.saved} 次 · 喝了 ${todaySummary.consumed} 次`
                  : "选一个按钮开始，记录会保存在本地。"}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#6D5A8C]">
              {todaySummary.total ? `${todaySummary.netMoney >= 0 ? "+" : ""}¥${todaySummary.netMoney}` : "待打卡"}
            </span>
          </div>
        </div>
        <div className="mb-4 rounded-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#DDF8F5] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-black text-[#4C3575]">连续 {stats.streakDays} 天记录</p>
              <p className="mt-1 text-xs font-semibold text-[#7D679D]">每次选择都有被认真看见。</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#6D5A8C]">
              {showCharacter ? stage.label : "本地"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onStartRecord("saved")}
            className="soft-focus rounded-[26px] bg-gradient-to-br from-[#8EDDD3] to-[#A7F1E6] px-4 py-4 text-left text-[#226962] shadow-[0_14px_30px_rgba(142,221,211,0.28)] transition duration-200 hover:-translate-y-1 active:scale-95"
          >
            <span className="block text-xs font-bold opacity-80">虚拟下单</span>
            <span className="mt-1 block text-xl font-black">今天戒了</span>
          </button>
          <button
            type="button"
            onClick={() => onStartRecord("consumed")}
            className="soft-focus rounded-[26px] bg-gradient-to-br from-[#F8BBD9] to-[#FFD4B8] px-4 py-4 text-left text-[#7F3B67] shadow-[0_14px_30px_rgba(248,187,217,0.26)] transition duration-200 hover:-translate-y-1 active:scale-95"
          >
            <span className="block text-xs font-bold opacity-80">温柔记录</span>
            <span className="mt-1 block text-xl font-black">今天喝了</span>
          </button>
        </div>
      </div>
    </div>
  );
}
