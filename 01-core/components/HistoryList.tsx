import type { DrinkRecord } from "@/lib/types";

type HistoryListProps = {
  records: DrinkRecord[];
  onDeleteRecord?: (recordId: string) => void;
};

export function HistoryList({ records, onDeleteRecord }: HistoryListProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-[#E7D8FF] bg-white/60 p-6 text-center text-sm font-semibold text-[#8A74AA] transition duration-200 hover:bg-white/75">
        <p className="text-base font-black text-[#4C3575]">还没有记录</p>
        <p className="mt-2 text-xs leading-relaxed">第一条选择会出现在这里，趋势和角色状态也会一起更新。</p>
      </div>
    );
  }

  const groups = groupRecordsByDate(records.slice(0, 24));

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section key={group.date} className="space-y-2">
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="text-sm font-black text-[#4C3575]">{formatDateLabel(group.date)}</p>
              <p className="text-xs font-semibold text-[#9886B5]">{group.records.length} 条记录</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-[#8A74AA]">
              净钱包 {group.netMoney >= 0 ? "+" : ""}¥{Math.round(group.netMoney * 10) / 10}
            </span>
          </div>
          <div className="space-y-3">
            {group.records.map((record) => (
              <HistoryItem key={record.id} record={record} onDeleteRecord={onDeleteRecord} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function HistoryItem({
  record,
  onDeleteRecord
}: {
  record: DrinkRecord;
  onDeleteRecord?: (recordId: string) => void;
}) {
  const saved = record.mode === "saved";

  return (
    <article
      className="rounded-[24px] border border-[#E7D8FF] bg-white/75 p-4 shadow-[0_10px_24px_rgba(76,53,117,0.08)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 active:scale-[0.99]"
      aria-label={`${record.drinkName || "未命名饮品"}，${saved ? "今天戒了" : "今天喝了"}，${saved ? "省下" : "花掉"} ${record.price} 元`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[#4C3575]">{record.drinkName || "未命名饮品"}</p>
          <p className="mt-1 text-xs font-semibold text-[#9886B5]">
            {saved ? "今天戒了" : "今天喝了"} · {record.source} · {record.confidence}可信度
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${saved ? "bg-[#DDF8F5] text-[#226962]" : "bg-[#FFF0F7] text-[#8D4970]"}`}>
            {saved ? "+" : "-"}¥{record.price}
          </span>
          {onDeleteRecord ? (
            <button
              type="button"
              onClick={() => onDeleteRecord(record.id)}
              data-haptic="warning"
              className="soft-focus rounded-full border border-[#FFD1DD] bg-white/80 px-2.5 py-1 text-xs font-black text-[#8D4970] transition hover:-translate-y-0.5 active:scale-95"
              aria-label={`删除 ${record.drinkName || "这条记录"}`}
            >
              删除
            </button>
          ) : null}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-[#7D679D]">
        <span className="rounded-[16px] bg-[#FAF7FF] px-3 py-2">{saved ? "少摄入" : "增加"} {record.calories} kcal</span>
        <span className="rounded-[16px] bg-[#FAF7FF] px-3 py-2">{saved ? "少摄入" : "增加"} {record.sugarGram}g 糖</span>
      </div>
    </article>
  );
}

function groupRecordsByDate(records: DrinkRecord[]) {
  return records.reduce<Array<{ date: string; records: DrinkRecord[]; netMoney: number }>>((groups, record) => {
    const date = record.date.slice(0, 10);
    const existing = groups.find((group) => group.date === date);
    const moneyDelta = record.mode === "saved" ? record.price : -record.price;

    if (existing) {
      existing.records.push(record);
      existing.netMoney += moneyDelta;
      return groups;
    }

    return [...groups, { date, records: [record], netMoney: moneyDelta }];
  }, []);
}

function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}
