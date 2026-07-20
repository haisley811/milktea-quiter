import { UI_THEME_OPTIONS, type UiThemeKey } from "@/lib/uiPreferences";

type ThemeControlsProps = {
  activeTheme: UiThemeKey;
  showCharacter: boolean;
  onThemeChange: (theme: UiThemeKey) => void;
  onShowCharacterChange: (showCharacter: boolean) => void;
};

export function ThemeControls({
  activeTheme,
  showCharacter,
  onThemeChange,
  onShowCharacterChange
}: ThemeControlsProps) {
  return (
    <section className="glass-card theme-control-card rounded-[26px] p-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#8A74AA]">界面风格</p>
          <h2 className="text-lg font-black text-[#4C3575]">换一套视觉皮肤</h2>
        </div>
        <span className="shrink-0 rounded-full bg-white/75 px-3 py-1 text-xs font-black text-[#6D5A8C]">
          {UI_THEME_OPTIONS.length} 套
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {UI_THEME_OPTIONS.map((option) => {
          const selected = option.key === activeTheme;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onThemeChange(option.key)}
              aria-pressed={selected}
              className={`soft-focus theme-option min-h-[92px] rounded-[18px] border p-3 text-left transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                selected
                  ? "selected-pop border-[#A78BFA] bg-[#F3E8FF] shadow-[0_12px_26px_rgba(167,139,250,0.2)]"
                  : "border-[#E7D8FF] bg-white/70"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-black text-[#4C3575]">{option.label}</span>
                <span className={`theme-swatch theme-swatch-${option.key}`} aria-hidden="true" />
              </span>
              <span className="mt-1 block text-[11px] font-semibold leading-snug text-[#8A74AA]">{option.description}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-[24px] border border-[#E7D8FF] bg-white/65 p-3">
        <button
          type="button"
          onClick={() => onShowCharacterChange(!showCharacter)}
          aria-pressed={showCharacter}
          className="soft-focus flex min-h-14 w-full items-center justify-between gap-3 rounded-[18px] bg-white/70 px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span className="min-w-0">
            <span className="block text-sm font-black text-[#4C3575]">显示人物</span>
            <span className="mt-0.5 block text-xs font-semibold leading-snug text-[#8A74AA]">
              {showCharacter ? "首页、记录页和数据页会展示小人、Body Score 与阶段进度。" : "已隐藏小人、Body Score、阶段进度和人物相关状态。"}
            </span>
          </span>
          <span
            className={`theme-toggle-track relative h-8 w-14 shrink-0 rounded-full border transition duration-200 ${
              showCharacter ? "border-[#8EDDD3] bg-[#DDF8F5]" : "border-[#D2C6E5] bg-[#F5F0FA]"
            }`}
            aria-hidden="true"
          >
            <span
              className={`theme-toggle-knob absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_4px_12px_rgba(76,53,117,0.18)] transition duration-200 ${
                showCharacter ? "left-7" : "left-1"
              }`}
            />
          </span>
        </button>
      </div>
    </section>
  );
}
