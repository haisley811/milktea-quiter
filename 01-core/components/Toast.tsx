export type ToastTone = "info" | "success" | "warning";

type ToastProps = {
  message: string;
  tone?: ToastTone;
};

const toneClass: Record<ToastTone, string> = {
  info: "border-[#E7D8FF]/90 bg-white/92 text-[#4C3575]",
  success: "border-[#8EDDD3]/70 bg-[#F4FFFD]/94 text-[#226962]",
  warning: "border-[#FFBF8A]/80 bg-[#FFF8EE]/94 text-[#87541C]"
};

const dotClass: Record<ToastTone, string> = {
  info: "bg-[#A78BFA] shadow-[0_0_0_5px_rgba(167,139,250,0.16)]",
  success: "bg-[#8EDDD3] shadow-[0_0_0_5px_rgba(142,221,211,0.2)]",
  warning: "bg-[#FFBF8A] shadow-[0_0_0_5px_rgba(255,191,138,0.2)]"
};

const progressClass: Record<ToastTone, string> = {
  info: "bg-[#A78BFA]/55",
  success: "bg-[#65CFC2]/65",
  warning: "bg-[#FFAA61]/70"
};

export function Toast({ message, tone = "info" }: ToastProps) {
  return (
    <div className="fixed bottom-[calc(6.25rem+env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-40px)] max-w-[360px] -translate-x-1/2">
      <div
        className={`toast-enter relative flex items-center gap-3 overflow-hidden rounded-[24px] border px-4 py-3 text-sm font-black shadow-[0_18px_48px_rgba(76,53,117,0.18)] backdrop-blur-xl ${toneClass[tone]}`}
        role="status"
        aria-live="polite"
      >
        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotClass[tone]}`} aria-hidden="true" />
        <span className="min-w-0 flex-1 text-left leading-snug">{message}</span>
        <span
          className={`toast-progress absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${progressClass[tone]}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
