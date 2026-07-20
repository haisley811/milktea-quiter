import { BodyScoreMeter } from "@/components/BodyScoreMeter";
import { CharacterDisplay } from "@/components/CharacterDisplay";
import { HistoryList } from "@/components/HistoryList";
import { StageProgress } from "@/components/StageProgress";
import { StatCard } from "@/components/StatCard";
import { getCharacterStageMeta } from "@/lib/character";
import { recentSevenDays } from "@/lib/stats";
import type { AppStats } from "@/lib/types";
import type { OutfitId } from "@/lib/wardrobe";

type DataViewProps = {
  stats: AppStats;
  showCharacter: boolean;
  outfitId: OutfitId;
  onDeleteRecord: (recordId: string) => void;
  onReset: () => void;
};

export function DataView({ stats, showCharacter, outfitId, onDeleteRecord, onReset }: DataViewProps) {
  const sevenDays = recentSevenDays(stats.records);
  const sevenDaySaved = sevenDays.reduce((sum, day) => sum + day.saved, 0);
  const sevenDayConsumed = sevenDays.reduce((sum, day) => sum + day.consumed, 0);
  const hasRecentRecords = sevenDaySaved + sevenDayConsumed > 0;
  const stage = getCharacterStageMeta(stats.bodyScore);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[13px] font-bold text-[#6F5B8F]">每一天的选择，都在让你更好</p>
        <h1 className="mt-1 text-[30px] font-black leading-none text-[#4C3575]">我的数据</h1>
      </header>

      <section className="glass-card flex items-end justify-between gap-4 rounded-[24px] border-l-4 border-l-[#70D5C8] p-5">
        <div>
          <p className="text-[13px] font-bold text-[#6F5B8F]">连续打卡</p>
          <p className="mt-1 text-[42px] font-black leading-none text-[#4C3575]">{stats.streakDays} 天</p>
        </div>
        <span className="rounded-full bg-[#DDF8F5] px-3 py-1 text-xs font-black text-[#226962]">{stage.label}</span>
      </section>

      {showCharacter ? <CharacterDisplay bodyScore={stats.bodyScore} outfitId={outfitId} compact /> : null}

      <section className="glass-card rounded-[30px] p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-[#4C3575]">最近 7 天趋势</h2>
            <p className="mt-1 text-xs font-semibold text-[#9886B5]">薄荷代表戒了，粉色代表喝了。</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-[#8A74AA]">
            {sevenDaySaved}/{sevenDayConsumed}
          </span>
        </div>
        <div className="grid grid-cols-7 items-end gap-2" aria-label="最近 7 天戒奶茶和喝奶茶趋势">
          {sevenDays.map((day) => {
            const savedHeight = Math.max(14, 16 + day.saved * 18);
            const consumedHeight = Math.max(14, 16 + day.consumed * 18);
            return (
              <div key={day.key} className="group flex flex-col items-center gap-2 rounded-[18px] px-1 py-2 transition duration-200 hover:bg-white/55">
                <div className="flex h-24 items-end gap-1">
                  <div className="w-3 rounded-full bg-gradient-to-t from-[#8EDDD3] to-[#DDF8F5] transition duration-200 group-hover:-translate-y-0.5" style={{ height: savedHeight }} />
                  <div className="w-3 rounded-full bg-gradient-to-t from-[#F8BBD9] to-[#FFF0F7] transition duration-200 group-hover:-translate-y-0.5" style={{ height: consumedHeight }} />
                </div>
                <span className="text-[10px] font-bold text-[#9886B5]">{day.label}</span>
              </div>
            );
          })}
        </div>
        {!hasRecentRecords ? (
          <p className="mt-3 rounded-[18px] bg-white/60 px-3 py-2 text-center text-xs font-semibold text-[#8A74AA]">
            最近 7 天还没有记录，提交后这里会出现趋势。
          </p>
        ) : null}
      </section>

      <div className="ui-stagger grid grid-cols-2 gap-3">
        {showCharacter ? <StatCard label="当前状态" value={stage.label} tone="mint" /> : null}
        {showCharacter ? <StatCard label="Body Score" value={`${stats.bodyScore}`} tone="purple" /> : null}
        <StatCard label="已记录天数" value={`${stats.streakDays}`} tone="pink" />
        <StatCard label="累计记录" value={`${stats.records.length}`} tone="amber" />
        <StatCard label="累计省钱" value={`¥${stats.totalSavedMoney}`} tone="mint" />
        <StatCard label="累计减少热量" value={`${stats.totalReducedCalories}`} hint="kcal" />
      </div>

      {showCharacter ? <BodyScoreMeter bodyScore={stats.bodyScore} /> : null}
      {showCharacter ? <StageProgress bodyScore={stats.bodyScore} /> : null}

      <section className="space-y-3">
        <h2 className="px-1 text-lg font-black">历史记录</h2>
        <HistoryList records={stats.records} onDeleteRecord={onDeleteRecord} />
      </section>

      <button
        type="button"
        onClick={onReset}
        className="soft-focus w-full rounded-[24px] border border-[#FFD1DD] bg-[#FFF0F7] px-5 py-4 text-sm font-black text-[#8D4970] transition hover:-translate-y-0.5 active:scale-95"
      >
        清空所有记录
      </button>
    </div>
  );
}
