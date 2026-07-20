import type { ViewKey } from "@/lib/viewTypes";

type BottomNavProps = {
  activeView: ViewKey;
  isSwitching?: boolean;
  onChange: (view: ViewKey) => void;
};

const navItems: { key: ViewKey; label: string }[] = [
  { key: "home", label: "首页" },
  { key: "record", label: "记录" },
  { key: "data", label: "数据" },
  { key: "profile", label: "我的" }
];

export function BottomNav({ activeView, isSwitching = false, onChange }: BottomNavProps) {
  return (
    <nav
      className="bottom-nav fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-28px)] max-w-[402px] -translate-x-1/2 rounded-[24px] border border-[#E7D8FF]/80 bg-white/92 px-2 py-1.5 shadow-[0_12px_32px_rgba(76,53,117,0.12)] backdrop-blur-xl"
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
              className={`soft-focus relative flex min-h-14 flex-col items-center justify-center rounded-[18px] text-[11px] font-bold transition duration-200 active:scale-[0.98] disabled:opacity-60 ${
                selected ? "selected-pop bg-[#F3E8FF] text-[#4C3575]" : "text-[#806A9F] hover:bg-[#FAF7FF]"
              }`}
            >
              <span
                className={`mb-0.5 grid h-6 w-6 place-items-center transition duration-200 ${
                  selected ? "text-[#6D4FC2]" : "text-[#806A9F]"
                }`}
                aria-hidden="true"
              >
                <NavIcon view={item.key} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({ view }: { view: ViewKey }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  if (view === "home") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" {...common}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>;
  }
  if (view === "record") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" {...common}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>;
  }
  if (view === "data") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" {...common}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>;
  }
  return <svg viewBox="0 0 24 24" className="h-5 w-5" {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
}
