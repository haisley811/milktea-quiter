import type { ReactNode } from "react";

type FormRowProps = {
  label: string;
  icon: string;
  hint?: string;
  children: ReactNode;
};

export function FormRow({ label, icon, hint, children }: FormRowProps) {
  return (
    <div className="rounded-[22px] border border-transparent px-1 py-1 transition duration-200 hover:border-white/70 hover:bg-white/45">
      <div className="mb-2 space-y-1">
        <p className="flex items-center gap-2 text-sm font-black text-[#4C3575]">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#F3E8FF] px-1 text-[11px] font-black text-[#7C5BD6] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
            {icon}
          </span>
          {label}
        </p>
        {hint ? <p className="text-xs font-semibold leading-snug text-[#9886B5]">{hint}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
