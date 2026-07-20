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
      className={`group min-h-[102px] rounded-[22px] border border-[#E7D8FF] bg-gradient-to-br ${toneClass[tone]} p-3.5 shadow-[0_10px_24px_rgba(76,53,117,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(76,53,117,0.1)]`}
    >
      <span className={`mb-2.5 block h-1 w-8 rounded-full bg-gradient-to-r ${accentClass[tone]} transition duration-200 group-hover:w-12`} aria-hidden="true" />
      <p className="text-xs font-semibold leading-snug text-[#6F5B8F]">{label}</p>
      <p className="mt-1 break-words text-[22px] font-black leading-tight tracking-normal text-[#4C3575]">{value}</p>
      {hint ? <p className="mt-1 break-words text-xs leading-snug text-[#806A9F]">{hint}</p> : null}
    </div>
  );
}
