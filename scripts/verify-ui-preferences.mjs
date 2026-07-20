import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function file(path) {
  return readFileSync(join(root, path), "utf8");
}

function assertIncludesAll(path, values) {
  const text = file(path);
  for (const value of values) {
    assert.match(text, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${path} should contain ${value}`);
  }
  return text;
}

const requiredThemes = ["soft", "mono", "liquid", "y2k", "neo", "cyber"];
const requiredThemeLabels = ["软糖奶茶", "黑白极简", "液态玻璃", "千禧甜心", "新粗野", "霓虹赛博"];

const uiPreferences = file("lib/uiPreferences.ts");
const themeKeys = [...uiPreferences.matchAll(/key:\s*"([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(themeKeys, requiredThemes, "UI theme options should expose the expected 6 themes in a stable order");
for (const label of requiredThemeLabels) {
  assert.match(uiPreferences, new RegExp(label), `lib/uiPreferences.ts should label theme ${label}`);
}
assert.match(uiPreferences, /UI_PREFERENCES_STORAGE_KEY = "milkTeaUiPreferences"/);
assert.match(uiPreferences, /showCharacter:\s*true/);
assert.match(uiPreferences, /isUiThemeKey/);
assert.match(uiPreferences, /loadUiPreferences/);
assert.match(uiPreferences, /saveUiPreferences/);

const themeControls = file("components/ThemeControls.tsx");
assert.match(themeControls, /UI_THEME_OPTIONS\.map/);
assert.match(themeControls, /onThemeChange\(option\.key\)/);
assert.match(themeControls, /aria-pressed=\{selected\}/);
assert.match(themeControls, /onShowCharacterChange\(!showCharacter\)/);
assert.match(themeControls, /aria-pressed=\{showCharacter\}/);
for (const theme of requiredThemes) {
  assert.match(themeControls, new RegExp(`theme-swatch-\\$\\{option\\.key\\}`));
  assert.match(file("app/globals.css"), new RegExp(`theme-swatch-${theme}`), `globals.css should style swatch ${theme}`);
}

const globals = file("app/globals.css");
for (const theme of requiredThemes.filter((theme) => theme !== "soft")) {
  assert.match(globals, new RegExp(`data-ui-theme="${theme}"`), `globals.css should define ${theme} theme`);
}
[
  "--theme-bg",
  "--theme-frame",
  "--theme-card",
  "--theme-card-strong",
  "--theme-text",
  "--theme-muted",
  "--theme-border",
  "--theme-action",
  "--theme-action-text",
  "--theme-selected",
  "--theme-selected-text",
  "--theme-radius-frame",
  "--theme-radius-card",
  "--theme-radius-action",
  "--theme-shadow",
  "--theme-card-shadow",
  "[data-ui-theme] .app-frame",
  "[data-ui-theme] :where(button)",
  "[data-ui-theme] :where(.glass-card",
  ".theme-control-card",
  "nav",
  ".modal-enter",
  ".toast-enter",
  "input",
  "[data-ui-theme] :where(button[aria-pressed=\"true\"], button[aria-current=\"page\"])",
  ".theme-toggle-track",
  ".theme-toggle-knob",
  "[data-ui-theme] button *",
  ".text-\\[\\#7D679D\\]",
  ".text-\\[\\#8D4970\\]",
  ".text-\\[\\#3F8F86\\]",
  ".text-\\[\\#87541C\\]",
  ".text-\\[\\#A6753F\\]",
  "[data-ui-theme] :where([class*=\"from-[#\"], [class*=\"to-[#\"], [class*=\"via-[#\"])",
  "[data-ui-theme] :where([class*=\"rounded-\"])"
].forEach((pattern) => assert.match(globals, new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));

const themedSurfaceFiles = {
  "components/BodyScoreMeter.tsx": ["glass-card", "bg-gradient-to-r", "Body Score"],
  "components/BottomNav.tsx": ["<nav", "aria-current", "selected-pop"],
  "components/CharacterDisplay.tsx": ["bg-white/90", "backdrop-blur-xl", "stageMeta"],
  "components/PillButton.tsx": ["aria-pressed={selected}", "selected-pop"],
  "components/ModeCard.tsx": ["aria-pressed={active}", "selected-pop"],
  "components/FormRow.tsx": ["hover:border-white", "hover:bg-white"],
  "components/HistoryList.tsx": ["bg-white/75", "border-[#E7D8FF]", "onDeleteRecord"],
  "components/LoadingView.tsx": ["glass-card", "skeleton-shimmer", "bg-gradient-to-br"],
  "components/ResetConfirmModal.tsx": ["modal-enter", "bg-gradient-to-br", "确认清空"],
  "components/ResultModal.tsx": ["modal-enter", "showCharacter"],
  "components/StageProgress.tsx": ["glass-card", "selected-pop", "aria-current"],
  "components/StatCard.tsx": ["bg-gradient-to-br", "toneClass", "accentClass"],
  "components/Toast.tsx": ["toast-enter", "toast-progress"],
  "components/ThemeControls.tsx": ["theme-control-card", "theme-option", "theme-swatch", "theme-toggle-track", "theme-toggle-knob"]
};

for (const [path, patterns] of Object.entries(themedSurfaceFiles)) {
  const text = file(path);
  for (const pattern of patterns) {
    assert.match(text, new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${path} should expose themed surface marker ${pattern}`);
  }
}

const appPage = file("app/page.tsx");
[
  "loadUiPreferences",
  "saveUiPreferences",
  "changeUiTheme",
  "changeCharacterVisibility",
  "data-ui-theme={uiPreferences.theme}",
  "data-character-visibility",
  "showCharacter={uiPreferences.showCharacter}",
  "activeTheme={uiPreferences.theme}",
  "onShowCharacterChange={changeCharacterVisibility}"
].forEach((pattern) => assert.match(appPage, new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));

const homeView = assertIncludesAll("components/views/HomeView.tsx", [
  "showCharacter: boolean",
  "showCharacter ? <CharacterDisplay",
  "showCharacter ? <StatCard label=\"Body Score\"",
  "showCharacter ? stage.label"
]);

const recordView = assertIncludesAll("components/views/RecordView.tsx", [
  "showCharacter: boolean",
  "showCharacter ? (",
  "<CharacterDisplay bodyScore={stats.bodyScore} outfitId={outfitId} compact />"
]);

const dataView = assertIncludesAll("components/views/DataView.tsx", [
  "showCharacter: boolean",
  "showCharacter ? <CharacterDisplay",
  "showCharacter ? <StatCard label=",
  "showCharacter ? <StatCard label=\"Body Score\"",
  "showCharacter ? <BodyScoreMeter",
  "showCharacter ? <StageProgress"
]);

const profileView = assertIncludesAll("components/views/ProfileView.tsx", [
  "ThemeControls",
  "showCharacter={showCharacter}",
  "onShowCharacterChange={onShowCharacterChange}"
]);

const resultModal = assertIncludesAll("components/ResultModal.tsx", [
  "showCharacter: boolean",
  "showCharacter ? (",
  "Body Score"
]);

for (const [name, text] of Object.entries({ homeView, recordView, dataView, profileView, resultModal })) {
  assert.doesNotMatch(text, /showCharacter\s*=\s*true/, `${name} should not hard-code character visibility`);
}

assertIncludesAll("docs/design-system.md", [
  "可切换 UI 风格",
  ...requiredThemeLabels,
  "页面背景、手机外框、卡片、按钮、底部导航、输入框、弹窗、Toast、选中态、状态色和风格色块",
  "人物显示偏好",
  "显示人物",
  "首页角色图",
  "记录页紧凑小角色",
  "数据页角色图、Body Score 面板、Body Score 仪表和阶段进度",
  "提交结果弹窗里的 Body Score 反馈",
  "不删除历史记录"
]);

assertIncludesAll("docs/project-introduction.md", [
  ...requiredThemeLabels,
  "切换后页面背景、手机外框、卡片、按钮、底部导航、输入框、弹窗、Toast、选中态和状态色都会跟随变化",
  "显示或隐藏人物",
  "首页角色图、记录页小角色、数据页角色图、Body Score 面板、阶段进度和提交结果里的 Body Score 反馈"
]);

const preview = file("public/preview.html");
for (const theme of requiredThemes) {
  assert.match(preview, new RegExp(`key:"${theme}"|data-ui-theme="${theme}"`), `preview should include ${theme}`);
}
[
  "milkTeaUiPreferences",
  "data-theme-choice",
  "data-show-character",
  "applyUiPreferencesToPreview",
  "document.documentElement.dataset.characterVisibility",
  "uiPrefs.showCharacter",
  "Body Score",
  "stage-progress",
  "syncResultModalCharacterText"
].forEach((pattern) => assert.match(preview, new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));

console.log("UI preferences verified.");
