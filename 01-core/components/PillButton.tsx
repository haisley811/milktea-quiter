type PillButtonProps<T extends string> = {
  label: T;
  selected: boolean;
  onClick: (value: T) => void;
  tone?: "purple" | "mint" | "pink" | "amber";
};

export function PillButton<T extends string>({
  label,
  selected,
  onClick,
  tone = "purple"
}: PillButtonProps<T>) {
  const selectedClass = {
    purple: "border-[#A78BFA] bg-[#F3E8FF] text-[#4C3575] shadow-[0_8px_22px_rgba(167,139,250,0.22)]",
    mint: "border-[#8EDDD3] bg-[#DDF8F5] text-[#226962] shadow-[0_8px_22px_rgba(142,221,211,0.25)]",
    pink: "border-[#F8BBD9] bg-[#FFF0F7] text-[#7F3B67] shadow-[0_8px_22px_rgba(248,187,217,0.24)]",
    amber: "border-[#FFD69A] bg-[#FFF4DD] text-[#8A5A12] shadow-[0_8px_22px_rgba(255,190,92,0.22)]"
  };

  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      aria-pressed={selected}
      className={`soft-focus inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
        selected
          ? `${selectedClass[tone]} selected-pop`
          : "border-[#E7D8FF] bg-white/70 text-[#6D5A8C] hover:bg-white"
      }`}
    >
      {selected ? <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70 shadow-[0_0_0_4px_rgba(255,255,255,0.58)]" aria-hidden="true" /> : null}
      {label}
    </button>
  );
}
