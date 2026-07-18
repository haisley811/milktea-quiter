type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: "purple" | "mint" | "pink" | "amber";
};

export function StatCard({ label, value, hint, tone = "purple" }: StatCardProps) {
  const toneClass = {
    purple: "from-[#F3E8FF] to-white",
    mint: "from-[#DDF8F5] to-white",
    pink: "from-[#FFF0F7] to-white",
    amber: "from-[#FFF4DD] to-white"
  };
  const accentClass = {
    purple: "from-[#A78BFA] to-[#F8BBD9]",
    mint: "from-[#8EDDD3] to-[#A7F1E6]",
    pink: "from-[#F8BBD9] to-[#FFD4B8]",
    amber: "from-[#FFBF8A] to-[#FFE0A6]"
  };

  return (
    <div
      className={`group min-h-[112px] rounded-[26px] border border-[#E7D8FF] bg-gradient-to-br ${toneClass[tone]} p-4 shadow-[0_12px_28px_rgba(76,53,117,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(76,53,117,0.12)]`}
    >
      <span className={`mb-3 block h-1.5 w-10 rounded-full bg-gradient-to-r ${accentClass[tone]} transition duration-200 group-hover:w-14`} aria-hidden="true" />
      <p className="text-xs font-semibold leading-snug text-[#8670A7]">{label}</p>
      <p className="mt-1 break-words text-2xl font-black tracking-normal text-[#4C3575]">{value}</p>
      {hint ? <p className="mt-1 break-words text-xs leading-snug text-[#9886B5]">{hint}</p> : null}
    </div>
  );
}
