export const UI_PREFERENCES_STORAGE_KEY = "milkTeaUiPreferences";

export const UI_THEME_OPTIONS = [
  {
    key: "soft",
    label: "软糖奶茶",
    description: "柔和粉紫、薄荷绿和玻璃卡片，保留当前陪伴感。"
  },
  {
    key: "mono",
    label: "黑白极简",
    description: "黑白灰、高留白、细边框，像极简效率工具。"
  },
  {
    key: "liquid",
    label: "液态玻璃",
    description: "通透蓝紫、强模糊和高光层，偏 iOS 玻璃质感。"
  },
  {
    key: "y2k",
    label: "千禧甜心",
    description: "高饱和粉、青、黄，带一点千禧网页和贴纸感。"
  },
  {
    key: "neo",
    label: "新粗野",
    description: "粗黑边、硬阴影、高对比色块，像潮流活动页。"
  },
  {
    key: "cyber",
    label: "霓虹赛博",
    description: "深色底、荧光绿蓝、高亮描边，夜间感更强。"
  }
] as const;

export type UiThemeKey = (typeof UI_THEME_OPTIONS)[number]["key"];

export type UiPreferences = {
  theme: UiThemeKey;
  showCharacter: boolean;
};

export const defaultUiPreferences: UiPreferences = {
  theme: "soft",
  showCharacter: true
};

export function isUiThemeKey(value: unknown): value is UiThemeKey {
  return typeof value === "string" && UI_THEME_OPTIONS.some((option) => option.key === value);
}

export function loadUiPreferences(): UiPreferences {
  if (typeof window === "undefined") return defaultUiPreferences;

  try {
    const raw = window.localStorage.getItem(UI_PREFERENCES_STORAGE_KEY);
    if (!raw) return defaultUiPreferences;

    const parsed = JSON.parse(raw) as Partial<UiPreferences>;
    return {
      theme: isUiThemeKey(parsed.theme) ? parsed.theme : defaultUiPreferences.theme,
      showCharacter: typeof parsed.showCharacter === "boolean" ? parsed.showCharacter : defaultUiPreferences.showCharacter
    };
  } catch {
    return defaultUiPreferences;
  }
}

export function saveUiPreferences(preferences: UiPreferences) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Visual preferences are non-critical; failing silently keeps recording usable.
  }
}
