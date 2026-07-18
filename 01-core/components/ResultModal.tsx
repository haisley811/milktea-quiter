import type { DrinkRecord } from "@/lib/types";
import type { OutfitId } from "@/lib/wardrobe";

type ResultModalProps = {
  record: DrinkRecord;
  showCharacter: boolean;
  outfitId: OutfitId;
  onHome: () => void;
  onData: () => void;
};

export function ResultModal({ record, showCharacter, outfitId: _outfitId, onHome, onData }: ResultModalProps) {
  const saved = record.mode === "saved";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#4C3575]/25 px-4 pb-5 backdrop-blur-sm">
      <section className="modal-enter w-full max-w-[402px] rounded-[34px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(76,53,117,0.22)]">
        <div className={`rounded-[28px] bg-gradient-to-br ${saved ? "from-[#DDF8F5] to-[#F3E8FF]" : "from-[#FFF0F7] to-[#FFF4DD]"} p-5`}>
          <p className="text-sm font-bold text-[#8670A7]">{saved ? "轻盈反馈" : "温柔记录"}</p>
          <h2 className="mt-1 text-3xl font-black text-[#4C3575]">{saved ? "下单成功" : "已记录"}</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-[#6D5A8C]">
            {saved ? "今天你把一杯饮品变成了正向反馈。" : "记录不是惩罚，是更了解自己的开始。"}
          </p>
          {saved ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#F2CB62] bg-[#FFF6CF] px-4 py-2 text-sm font-black text-[#9A6512] shadow-[0_8px_18px_rgba(242,203,98,0.24)]">
              <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F4C54F] text-xs text-white">+</span>
              下单成功，加 10 金币
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ResultItem label={saved ? "今天省下" : "今天花掉"} value={`¥${record.price}`} />
          <ResultItem label="钱包" value={`${saved ? "+" : "-"}¥${record.price}`} />
          <ResultItem label={saved ? "少摄入" : "增加"} value={`${record.calories} kcal`} />
          <ResultItem label={saved ? "少摄入糖分" : "增加糖分"} value={`${record.sugarGram}g`} />
        </div>

        {showCharacter ? (
          <div className="mt-4 rounded-[22px] border border-[#E7D8FF] bg-[#FAF7FF] px-4 py-3 text-sm font-bold text-[#6D5A8C]">
            Body Score {saved ? "-2" : "+2"} · 数据为估算值，仅供参考。
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onHome}
            className="soft-focus rounded-[22px] border border-[#E7D8FF] bg-white px-4 py-3 text-sm font-black text-[#4C3575] transition hover:-translate-y-0.5 active:scale-95"
          >
            返回首页
          </button>
          <button
            type="button"
            onClick={onData}
            className="soft-focus rounded-[22px] bg-gradient-to-r from-[#A78BFA] to-[#F8BBD9] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(167,139,250,0.25)] transition hover:-translate-y-0.5 active:scale-95"
          >
            查看数据
          </button>
        </div>
      </section>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#E7D8FF] bg-white/80 p-4">
      <p className="text-xs font-bold text-[#9886B5]">{label}</p>
      <p className="mt-1 break-words text-xl font-black text-[#4C3575]">{value}</p>
    </div>
  );
}
