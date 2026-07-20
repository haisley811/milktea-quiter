import type { ReactNode } from "react";

type FormRowProps = {
  label: string;
  icon: string;
  hint?: string;
  children: ReactNode;
};

export function FormRow({ label, hint, children }: FormRowProps) {
  return (
    <div className="rounded-[22px] border border-transparent px-1 py-1 transition duration-200 hover:border-white/70 hover:bg-white/45">
      <div className="mb-2 space-y-1">
        <p className="flex items-center gap-2 text-sm font-black text-[#4C3575]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#7C5BD6] shadow-[0_0_0_4px_rgba(124,91,214,0.12)]" aria-hidden="true" />
          {label}
        </p>
        {hint ? <p className="text-xs font-semibold leading-snug text-[#9886B5]">{hint}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
