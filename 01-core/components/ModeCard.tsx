type ModeCardProps = {
  title: string;
  text: string;
  active: boolean;
  onClick: () => void;
  tone: "mint" | "pink";
};

export function ModeCard({ title, text, active, onClick, tone }: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`soft-focus rounded-[26px] border p-4 text-left transition duration-200 hover:-translate-y-0.5 active:scale-95 ${
        active
          ? tone === "mint"
            ? "selected-pop border-[#8EDDD3] bg-[#DDF8F5] shadow-[0_14px_28px_rgba(142,221,211,0.2)]"
            : "selected-pop border-[#F8BBD9] bg-[#FFF0F7] shadow-[0_14px_28px_rgba(248,187,217,0.2)]"
          : "border-[#E7D8FF] bg-white/70"
      }`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-base font-black text-[#4C3575]">{title}</span>
        {active ? <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black text-[#6D5A8C]">已选</span> : null}
      </span>
      <p className="mt-1 text-xs font-semibold text-[#8A74AA]">{text}</p>
    </button>
  );
}
