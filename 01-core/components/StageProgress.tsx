import { characterStages, getCharacterStageMeta } from "@/lib/character";

type StageProgressProps = {
  bodyScore: number;
};

export function StageProgress({ bodyScore }: StageProgressProps) {
  const activeStage = getCharacterStageMeta(bodyScore).stage;

  return (
    <section className="glass-card rounded-[30px] p-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#8A74AA]">角色进化进度</p>
          <h2 className="text-lg font-black text-[#4C3575]">当前阶段 S{activeStage}</h2>
        </div>
        <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-[#8A74AA]">
          Body Score {bodyScore}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {characterStages.map((item) => {
          const active = item.stage === activeStage;
          return (
            <div
              key={item.stage}
              className={`min-h-[86px] rounded-[18px] border p-2 text-center transition duration-200 ${
                active ? "selected-pop border-[#A78BFA] bg-[#F3E8FF] text-[#4C3575] shadow-[0_10px_22px_rgba(167,139,250,0.2)]" : "border-[#E7D8FF] bg-white/60 text-[#B09FC7]"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <p className="text-xs font-black">S{item.stage}</p>
              <p className="mt-1 text-[10px] font-bold leading-tight">{item.label}</p>
              <p className="mt-1 text-[10px] font-semibold opacity-75">{item.min}-{item.max}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
