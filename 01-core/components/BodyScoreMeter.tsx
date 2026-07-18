import { getCharacterStageMeta } from "@/lib/character";

type BodyScoreMeterProps = {
  bodyScore: number;
};

export function BodyScoreMeter({ bodyScore }: BodyScoreMeterProps) {
  const stageMeta = getCharacterStageMeta(bodyScore);
  const lightness = 100 - bodyScore;

  return (
    <section className="glass-card rounded-[30px] p-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#8A74AA]">Body Score</p>
          <h2 className="mt-1 text-3xl font-black text-[#4C3575]">{bodyScore}</h2>
        </div>
        <span className="max-w-[150px] shrink-0 truncate rounded-full bg-white/75 px-3 py-1 text-xs font-black text-[#6D5A8C]">
          {stageMeta.label}
        </span>
      </div>

      <div className="mt-4">
        <div
          className="h-4 overflow-hidden rounded-full border border-white/80 bg-white/70 shadow-inner"
          aria-label={`Body Score ${bodyScore}，${stageMeta.label}，分数越低代表状态越轻盈`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8EDDD3] via-[#A78BFA] to-[#FFBF8A] transition-[width] duration-300 ease-out"
            style={{ width: `${bodyScore}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-[#9886B5]">
          <span>轻盈</span>
          <span>轻盈度 {lightness}%</span>
          <span>负担</span>
        </div>
      </div>
    </section>
  );
}
