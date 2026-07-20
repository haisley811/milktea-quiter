import type { ViewKey } from "@/lib/viewTypes";

type BottomNavProps = {
  activeView: ViewKey;
  isSwitching?: boolean;
  onChange: (view: ViewKey) => void;
};

const navItems: { key: ViewKey; label: string; icon: string }[] = [
  { key: "home", label: "首页", icon: "今" },
  { key: "record", label: "记录", icon: "记" },
  { key: "data", label: "数据", icon: "数" },
  { key: "profile", label: "我的", icon: "我" }
];

export function BottomNav({ activeView, isSwitching = false, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-28px)] max-w-[402px] -translate-x-1/2 rounded-[28px] border border-white/80 bg-white/90 px-2 py-2 shadow-[0_16px_40px_rgba(76,53,117,0.16)] backdrop-blur-xl"
      aria-busy={isSwitching}
      aria-label="底部导航"
    >
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const selected = activeView === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              disabled={isSwitching && !selected}
              aria-current={selected ? "page" : undefined}
              className={`soft-focus relative flex min-h-14 flex-col items-center justify-center rounded-[22px] text-xs font-bold transition duration-200 active:scale-95 disabled:opacity-60 ${
                selected ? "selected-pop bg-[#F3E8FF] text-[#4C3575] shadow-inner" : "text-[#9A86B8] hover:bg-[#FAF7FF]"
              }`}
            >
              {selected ? <span className="absolute top-1.5 h-1 w-5 rounded-full bg-[#A78BFA]/70" aria-hidden="true" /> : null}
              <span
                className={`mb-0.5 grid h-6 w-6 place-items-center rounded-full text-[11px] leading-none transition duration-200 ${
                  selected ? "bg-white/85 text-[#7C5BD6]" : "bg-white/55 text-[#9A86B8]"
                }`}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
