import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mojibakePattern = /[\uFFFD\u951F\u93c1\u93b4\u6d60\u7481\u68e3\u6924\u923e\u9231\u923c\u9411\u9420]|\u00C2|\u00C3|\uFFFD{2,}|\u03F2|\u03A2|\u697C|\u951B/;

function file(path) {
  const fullPath = join(root, path);
  assert.equal(existsSync(fullPath), true, `${path} should exist`);
  return readFileSync(fullPath, "utf8");
}

function image(path) {
  const fullPath = join(root, path);
  assert.equal(existsSync(fullPath), true, `${path} should exist`);
  assert.ok(statSync(fullPath).size > 100_000, `${path} should be a real image asset`);
}

function assertCleanText(path) {
  assert.doesNotMatch(file(path), mojibakePattern, `${path} contains likely mojibake`);
}

const requiredThemeLabels = ["软糖奶茶", "黑白极简", "液态玻璃", "千禧甜心", "新粗野", "霓虹赛博"];

const packageJson = JSON.parse(file("package.json"));
assert.equal(packageJson.dependencies.next, "15.5.20");
assert.equal(packageJson.dependencies.react, "19.0.0");
assert.equal(packageJson.scripts["check:github-ready"], "node scripts/check-github-ready.mjs");
assert.equal(packageJson.scripts["check:goal-status"], "node scripts/check-goal-status.mjs");
assert.equal(packageJson.scripts["check:launch-handoff"], "node scripts/check-launch-handoff.mjs");
assert.equal(packageJson.scripts["check:qwen-env"], "node scripts/check-qwen-env.mjs");
assert.equal(packageJson.scripts["github:connect"], "node scripts/connect-github-remote.mjs");
assert.equal(packageJson.scripts["launch:mark-public-api"], "node scripts/mark-public-api-verified.mjs");
assert.equal(packageJson.scripts["launch:mark-wechat-domain"], "node scripts/mark-wechat-domain-verified.mjs");
assert.equal(packageJson.scripts["wechat:set-appid"], "node scripts/set-wechat-appid.mjs");
assert.equal(packageJson.scripts["wechat:set-api-url"], "node scripts/set-wechat-api-base-url.mjs");
assert.equal(packageJson.scripts.preview, "node scripts/serve-preview.mjs");
assert.equal(packageJson.scripts["smoke:preview"], "node scripts/smoke-preview.mjs");
assert.equal(packageJson.scripts["verify:api-live"], "node scripts/verify-preview-ai.mjs");
assert.equal(packageJson.scripts["verify:public-api"], "node scripts/verify-public-api.mjs");
assert.equal(packageJson.scripts["verify:qwen-direct"], "node scripts/verify-qwen-direct.mjs");
assert.equal(packageJson.scripts["verify:launch-url"], "node scripts/verify-public-api.mjs");
assert.equal(packageJson.scripts["verify:preview-ui"], "node scripts/verify-preview-ui.mjs");
assert.equal(packageJson.scripts["verify:ui-preferences"], "node scripts/verify-ui-preferences.mjs");
assert.equal(packageJson.scripts["verify:wechat-template"], "node scripts/verify-wechat-template.mjs");
assert.equal(packageJson.scripts["smoke:wechat-template"], "node scripts/smoke-wechat-template.mjs");
assert.equal(packageJson.scripts["verify:responsive"], "node scripts/verify-responsive.mjs");
assert.equal(packageJson.scripts["verify:deploy"], "node scripts/verify-deploy.mjs");
assert.match(packageJson.scripts.verify, /smoke:wechat-template/);
assert.equal(packageJson.engines.node, "22.x");

const gitattributes = file(".gitattributes");
assert.match(gitattributes, /^\.npmrc text eol=lf/m);

[
  "app/page.tsx",
  "app/layout.tsx",
  "app/globals.css",
  "components/views/HomeView.tsx",
  "components/views/RecordView.tsx",
  "components/views/DataView.tsx",
  "components/views/ProfileView.tsx",
  "components/BodyScoreMeter.tsx",
  "components/CharacterDisplay.tsx",
  "components/BottomNav.tsx",
  "components/HistoryList.tsx",
  "components/LoadingView.tsx",
  "components/ModeCard.tsx",
  "components/PillButton.tsx",
  "components/ResultModal.tsx",
  "components/ResetConfirmModal.tsx",
  "components/StageProgress.tsx",
  "components/ThemeControls.tsx",
  "components/Toast.tsx",
  "components/FormRow.tsx",
  "lib/appActions.ts",
  "lib/character.ts",
  "lib/defaultForm.ts",
  "lib/designTokens.ts",
  "lib/drinkRules.ts",
  "lib/haptics.ts",
  "lib/aiEstimate.ts",
  "lib/qwenEstimateRuntime.mjs",
  "lib/qwenEstimateRuntime.d.mts",
  "lib/stats.ts",
  "lib/storage.ts",
  "lib/types.ts",
  "lib/uiPreferences.ts",
  "next.config.ts",
  "public/preview.html",
  "public/wardrobe-fit-check.html",
  "scripts/check-github-ready.mjs",
  "scripts/check-goal-status.mjs",
  "scripts/check-launch-handoff.mjs",
  "scripts/check-qwen-env.mjs",
  "scripts/connect-github-remote.mjs",
  "scripts/mark-public-api-verified.mjs",
  "scripts/mark-wechat-domain-verified.mjs",
  "scripts/set-wechat-appid.mjs",
  "scripts/set-wechat-api-base-url.mjs",
  "scripts/serve-preview.mjs",
  "scripts/smoke-preview.mjs",
  "scripts/smoke-wechat-template.mjs",
  "scripts/verify-core.mjs",
  "scripts/verify-deploy.mjs",
  "scripts/verify-preview-ai.mjs",
  "scripts/verify-preview-ui.mjs",
  "scripts/verify-ui-preferences.mjs",
  "scripts/verify-public-api.mjs",
  "scripts/verify-qwen-direct.mjs",
  "scripts/verify-responsive.mjs",
  "scripts/verify-wechat-template.mjs",
  "netlify.toml",
  ".npmrc",
  ".gitattributes",
  ".nvmrc",
  ".github/workflows/verify.yml",
  "after-netlify.cmd",
  "check-npm-network.cmd",
  "start-here.cmd",
  "check-status.cmd",
  "check-wechat-template.cmd",
  "connect-github.cmd",
  "generate-package-lock.cmd",
  "install-local-deps.cmd",
  "launch-control.cmd",
  "mark-wechat-verified.cmd",
  "what-you-need-to-do.cmd",
  "verify-public-api.cmd",
  "set-wechat-api-url.cmd",
  "set-wechat-appid.cmd",
  "preview.cmd",
  "preview.ps1",
  "启动预览.cmd",
  "README.md",
  "docs/design-system.md",
  "docs/dependency-install-fallback.md",
  "docs/github-upload-manual.md",
  "docs/netlify-deploy-manual.md",
  "docs/deployment-prep-report.md",
  "docs/deployment-runbook.md",
  "docs/deployment-troubleshooting.md",
  "docs/start-here-after-sleep.md",
  "docs/user-action-items-after-sleep.md",
  "docs/api-integration-status.md",
  "docs/netlify-env-copy-paste.md",
  "docs/wechat-mini-program-launch-manual.md",
  "docs/wechat-verification-recording.md",
  "docs/zero-code-launch-manual.md",
  "docs/project-introduction.md",
  "docs/launch-acceptance-checklist.md",
  "docs/migration-notes.md",
  "docs/platform-adapters.md",
  "docs/wechat-api-service-template.md",
  "docs/wechat-ios-readiness.md",
  "docs/qwen-api.md",
  "templates/wechat-miniprogram/README.md",
  "templates/wechat-miniprogram/app.js",
  "templates/wechat-miniprogram/app.json",
  "templates/wechat-miniprogram/app.wxss",
  "templates/wechat-miniprogram/project.config.json",
  "templates/wechat-miniprogram/sitemap.json",
  "templates/wechat-miniprogram/config/api.js",
  "templates/wechat-miniprogram/services/aiEstimate.js",
  "templates/wechat-miniprogram/services/drinkRules.js",
  "templates/wechat-miniprogram/pages/record/record.js",
  "templates/wechat-miniprogram/pages/record/record.wxml",
  "templates/wechat-miniprogram/pages/record/record.wxss",
  "templates/wechat-miniprogram/pages/record/record.json",
  ".env.example",
  "lib/platformAdapters.ts"
].forEach(assertCleanText);

const npmrc = file(".npmrc");
assert.match(npmrc, /^fetch-timeout=600000$/m);
assert.match(npmrc, /^fetch-retries=5$/m);
assert.match(npmrc, /^fetch-retry-mintimeout=20000$/m);
assert.match(npmrc, /^fetch-retry-maxtimeout=120000$/m);
assert.match(npmrc, /^audit=false$/m);
assert.match(npmrc, /^fund=false$/m);

[
  "public/images/girl-normal.png",
  "public/images/girl-normal-transparent.png",
  "public/images/girl-stage-1.png",
  "public/images/girl-stage-1-transparent.png",
  "public/images/girl-stage-1-blink.png",
  "public/images/girl-stage-1-wave.png",
  "public/images/girl-stage-2.png",
  "public/images/girl-stage-2-transparent.png",
  "public/images/girl-stage-2-blink.png",
  "public/images/girl-stage-2-wave.png",
  "public/images/girl-stage-3.png",
  "public/images/girl-stage-3-transparent.png",
  "public/images/girl-stage-3-blink.png",
  "public/images/girl-stage-3-wave.png",
  "public/images/girl-stage-4.png",
  "public/images/girl-stage-4-transparent.png",
  "public/images/girl-stage-4-blink.png",
  "public/images/girl-stage-4-wave.png",
  "public/images/girl-stage-5.png",
  "public/images/girl-stage-5-transparent.png",
  "public/images/girl-stage-5-blink.png",
  "public/images/girl-stage-5-wave.png"
].forEach(image);

const appPage = file("app/page.tsx");
assert.match(appPage, /deleteRecord/);
assert.match(appPage, /rebuildStats/);
assert.match(appPage, /loadUiPreferences/);
assert.match(appPage, /saveUiPreferences/);
assert.match(appPage, /changeUiTheme/);
assert.match(appPage, /changeCharacterVisibility/);
assert.match(appPage, /data-ui-theme=\{uiPreferences\.theme\}/);
assert.match(appPage, /data-character-visibility/);
assert.match(appPage, /showCharacter=\{uiPreferences\.showCharacter\}/);
assert.match(appPage, /activeTheme=\{uiPreferences\.theme\}/);
assert.match(appPage, /estimateDrinkSmart/);
assert.match(appPage, /createRemoteAIEstimateProvider/);
assert.match(appPage, /isEstimateLoading/);
assert.match(appPage, /webHaptics/);
assert.match(appPage, /pointerdown/);
assert.match(appPage, /tap-burst/);
assert.match(appPage, /--tap-x/);
assert.match(appPage, /ToastTone/);
assert.match(appPage, /setToast/);
assert.match(appPage, /showToast\("本地保存暂时失败，请检查浏览器存储权限", "warning"\)/);
assert.match(appPage, /showToast\("已删除这条记录，数据已重新计算", "success"\)/);
assert.match(appPage, /今天不喝/);
assert.match(appPage, /页面切换中/);

const types = file("lib/types.ts");
assert.match(types, /"奶茶" \| "果茶" \| "咖啡"/);
assert.match(types, /"本地预设" \| "默认估算" \| "AI智能估算"/);
assert.match(types, /"高" \| "中" \| "低"/);

const drinkRules = file("lib/drinkRules.ts");
assert.match(drinkRules, /霸王茶姬伯牙绝弦/);
assert.match(drinkRules, /喜茶多肉葡萄/);
assert.match(drinkRules, /命中本地预设/);

const character = file("lib/character.ts");
assert.match(character, /轻盈清爽/);
assert.match(character, /健康活力/);
assert.match(character, /负担有点大/);

const dataView = file("components/views/DataView.tsx");
assert.match(dataView, /onDeleteRecord/);
assert.match(dataView, /onReset/);
assert.match(dataView, /showCharacter/);
assert.match(dataView, /当前状态/);
assert.match(dataView, /清空所有记录/);
assert.match(dataView, /StageProgress/);
assert.match(dataView, /BodyScoreMeter/);

const profileView = file("components/views/ProfileView.tsx");
assert.match(profileView, /个人账号与同步/);
assert.match(profileView, /本地体验账号/);
assert.match(profileView, /ThemeControls/);
assert.match(profileView, /activeTheme/);
assert.match(profileView, /onShowCharacterChange/);
assert.doesNotMatch(profileView, /清空所有记录/);
assert.doesNotMatch(profileView, /登录状态|同步方式|本机记录|存储 Key/);
assert.doesNotMatch(profileView, /后续账号数据|可接入 openid|可接入 UserDefaults/);

const historyList = file("components/HistoryList.tsx");
assert.match(historyList, /onDeleteRecord/);
assert.match(historyList, /删除/);

const recordView = file("components/views/RecordView.tsx");
assert.match(recordView, /EstimateInput/);
assert.match(recordView, /TextInput/);
assert.match(recordView, /manualEstimate/);
assert.match(recordView, /showCharacter/);
assert.match(recordView, /AI智能分析中/);
assert.match(recordView, /isEstimateLoading/);
assert.match(recordView, /getEstimateStatus/);
assert.match(recordView, /status-pulse/);
assert.match(recordView, /submit-busy/);
assert.match(recordView, /AI已连接/);
assert.match(recordView, /本地临时值/);
assert.match(recordView, /可手动修改/);
assert.match(recordView, /恢复建议值/);
assert.match(recordView, /已应用手动值/);
assert.match(recordView, /Drink details/);
assert.match(recordView, /Live estimate/);
assert.match(recordView, /focus-within:border-\[#A78BFA\]/);
assert.match(recordView, /已改/);
assert.match(recordView, /min-\[400px\]:grid-cols-3/);

const pillButton = file("components/PillButton.tsx");
assert.match(pillButton, /selected-pop/);
assert.match(pillButton, /min-h-10/);

const formRow = file("components/FormRow.tsx");
assert.match(formRow, /hover:bg-white\/45/);
assert.match(formRow, /inline-flex h-6 min-w-6/);

const modeCard = file("components/ModeCard.tsx");
assert.match(modeCard, /selected-pop/);
assert.match(modeCard, /已选/);

const preview = file("public/preview.html");
const netlifyConfig = file("netlify.toml");
assert.match(preview, /<div id="profile-stats" hidden><\/div>/);
assert.doesNotMatch(preview, /<h2 style="font-size:20px">后续账号数据<\/h2>/);
assert.match(netlifyConfig, /from\s*=\s*["']\/["']/);
assert.match(netlifyConfig, /to\s*=\s*["']\/preview\.html["']/);
assert.match(netlifyConfig, /status\s*=\s*200/);
assert.match(netlifyConfig, /force\s*=\s*true/);
assert.match(preview, /\.view \{ display: none/);
assert.match(preview, /\.view\.active \{ display: grid/);
assert.match(preview, /\.stack \{ gap: 18px/);
assert.match(preview, /\.glass\.stack \{ display: grid/);
assert.match(preview, /images\/girl-stage-\$\{currentStage\}-transparent\.png/);
assert.match(preview, /class="motion-frame motion-base"/);
assert.match(preview, /class="motion-frame motion-blink"/);
assert.match(preview, /class="motion-frame motion-wave"/);
assert.match(preview, /\.character\.is-blinking \.motion-blink/);
assert.match(preview, /useWave\?520:170/);
assert.match(preview, /previewMotion===\"blink\"\?\"is-blinking\":\"is-waving\"/);
assert.doesNotMatch(preview, /image\.src=Math\.random/);
assert.match(preview, /images\/girl-normal-transparent\.png/);
assert.match(preview, /fallbackCharacterImage/);
assert.doesNotMatch(preview, /blink-eye/);
assert.doesNotMatch(preview, /wave-hand/);
assert.match(preview, /estimateSmart/);
assert.match(preview, /AI_ENDPOINTS/);
assert.match(preview, /AI_ENDPOINTS\s*=\s*\[["']\/api\/estimate-drink["']\]/);
assert.doesNotMatch(preview, /127\.0\.0\.1:4173\/api\/estimate-drink/);
assert.match(preview, /estimate-status/);
assert.match(preview, /status-dot/);
assert.match(preview, /status-pulse/);
assert.match(preview, /submit-busy/);
assert.match(preview, /toast-dot/);
assert.match(preview, /toast-progress/);
assert.match(preview, /showToast\(message,tone="info"\)/);
assert.match(preview, /showToast\("本地保存暂时失败，请检查浏览器存储权限","warning"\)/);
assert.match(preview, /AI已连接/);
assert.match(preview, /暂时使用本地估算/);
assert.match(preview, /data-estimate-field="\$\{key\}"/);
assert.match(preview, /field\("price","价格"/);
assert.match(preview, /field\("calories","热量"/);
assert.match(preview, /field\("sugarGram","糖分 g"/);
assert.match(preview, /\.estimate-grid > span/);
assert.match(preview, /\.field:focus-within/);
assert.match(preview, /edited-tag/);
assert.match(preview, /estimate-reset/);
assert.match(preview, /data-reset-estimate/);
assert.match(preview, /manual-status/);
assert.match(preview, /已应用手动值/);
assert.match(preview, /已恢复智能建议值/);
assert.match(preview, /max-width: 430px/);
assert.match(preview, /\.estimate-grid\.estimate-fields \{ grid-template-columns:1fr/);
assert.match(preview, /applyManualEstimate/);
assert.match(preview, /手动修正价格、热量或糖分/);
assert.doesNotMatch(preview, /AI 接口暂不可用/);
assert.match(preview, /data-delete/);
assert.match(preview, /已删除这条记录/);
assert.match(preview, /个人账号与同步/);
assert.match(preview, /清空所有记录/);
assert.match(preview, /milkTeaAppData/);
assert.match(preview, /milkTeaUiPreferences/);
assert.match(preview, /UI_THEMES/);
assert.match(preview, /data-theme-choice/);
assert.match(preview, /data-show-character/);
assert.match(preview, /applyUiPreferencesToPreview/);
assert.match(preview, /renderWithUiPreferences/);
assert.match(preview, /MutationObserver/);
assert.match(preview, /data-ui-theme="mono"/);
assert.match(preview, /data-ui-theme="liquid"/);
assert.match(preview, /data-ui-theme="y2k"/);
assert.match(preview, /data-ui-theme="neo"/);
assert.match(preview, /data-ui-theme="cyber"/);
assert.match(preview, /theme-controls/);
assert.match(preview, /backdrop-filter/);
assert.match(preview, /hover/);
assert.match(preview, /active/);
assert.match(preview, /aria-pressed/);
assert.match(preview, /button:disabled/);
assert.match(preview, /button\[aria-busy="true"\]/);
assert.match(preview, /skeleton-shimmer/);
assert.match(preview, /prefers-reduced-motion/);
assert.match(preview, /safe-area-inset-bottom/);
assert.match(preview, /tapFeedback/);
assert.match(preview, /navigator\.vibrate/);
assert.match(preview, /pointerdown/);
assert.match(preview, /tap-burst/);
assert.match(preview, /--tap-x/);
assert.match(preview, /selected-pop/);

const haptics = file("lib/haptics.ts");
assert.match(haptics, /webHaptics/);
assert.match(haptics, /navigator\.vibrate/);
assert.match(haptics, /prefersReducedMotion/);
assert.match(haptics, /HapticsAdapter/);

const globals = file("app/globals.css");
assert.match(globals, /tap-burst/);
assert.match(globals, /--tap-x/);
assert.match(globals, /selected-pop/);
assert.match(globals, /submit-busy/);
assert.match(globals, /status-pulse/);
assert.match(globals, /toast-progress/);
assert.match(globals, /data-ui-theme="mono"/);
assert.match(globals, /data-ui-theme="liquid"/);
assert.match(globals, /data-ui-theme="y2k"/);
assert.match(globals, /data-ui-theme="neo"/);
assert.match(globals, /data-ui-theme="cyber"/);
assert.match(globals, /theme-swatch-y2k/);
assert.match(globals, /--theme-action/);
assert.match(globals, /\.theme-toggle-track/);
assert.match(globals, /\.theme-toggle-knob/);
assert.match(globals, /\.text-\\\[\\#7D679D\\\]/);
assert.match(globals, /\.text-\\\[\\#8D4970\\\]/);
assert.match(globals, /\.text-\\\[\\#3F8F86\\\]/);
assert.match(globals, /\.text-\\\[\\#87541C\\\]/);
assert.match(globals, /\.text-\\\[\\#A6753F\\\]/);

const themeControls = file("components/ThemeControls.tsx");
assert.match(themeControls, /UI_THEME_OPTIONS/);
assert.match(themeControls, /onThemeChange/);
assert.match(themeControls, /onShowCharacterChange/);
assert.match(themeControls, /aria-pressed/);
assert.match(themeControls, /theme-option/);
assert.match(themeControls, /theme-toggle-track/);
assert.match(themeControls, /theme-toggle-knob/);

const resultModal = file("components/ResultModal.tsx");
assert.match(resultModal, /showCharacter/);
assert.match(resultModal, /Body Score/);

const toast = file("components/Toast.tsx");
assert.match(toast, /ToastTone/);
assert.match(toast, /toneClass/);
assert.match(toast, /toast-progress/);
assert.match(toast, /role="status"/);

assert.match(file("preview.cmd"), /preview\.ps1/);
assert.match(file("preview.ps1"), /Set-Location \$projectRoot/);
assert.match(file("preview.ps1"), /serve-preview\.mjs/);
assert.match(file("启动预览.cmd"), /call preview\.cmd/);

const startHereCmd = file("start-here.cmd");
assert.match(startHereCmd, /docs\\start-here-after-sleep\.md/);
assert.match(startHereCmd, /notepad/);

const userActionsCmd = file("what-you-need-to-do.cmd");
assert.match(userActionsCmd, /docs\\user-action-items-after-sleep\.md/);
assert.match(userActionsCmd, /notepad/);

const checkStatusCmd = file("check-status.cmd");
assert.match(checkStatusCmd, /npm run check:goal-status/);
assert.match(checkStatusCmd, /pause/);

const checkNpmNetworkCmd = file("check-npm-network.cmd");
assert.match(checkNpmNetworkCmd, /npm config get registry/);
assert.match(checkNpmNetworkCmd, /npm ping/);
assert.match(checkNpmNetworkCmd, /registry\.npmjs\.org/);

const verifyPublicApiCmd = file("verify-public-api.cmd");
assert.match(verifyPublicApiCmd, /npm run verify:public-api/);
assert.match(verifyPublicApiCmd, /launch:mark-public-api/);
assert.match(verifyPublicApiCmd, /\.launch-state\.json/);
assert.match(verifyPublicApiCmd, /if errorlevel 1/);
assert.match(verifyPublicApiCmd, /set \/p PUBLIC_URL/);
assert.match(verifyPublicApiCmd, /api\/estimate-drink/);

const aiEstimate = file("lib/aiEstimate.ts");
assert.match(aiEstimate, /AIEstimateProvider/);
assert.match(aiEstimate, /createRemoteAIEstimateProvider/);
assert.match(aiEstimate, /estimateDrinkSmart/);
assert.doesNotMatch(aiEstimate, /AI 接口暂不可用/);

const appActions = file("lib/appActions.ts");
assert.match(appActions, /applyManualEstimate/);
assert.match(appActions, /手动修正价格、热量或糖分/);

const storage = file("lib/storage.ts");
assert.match(storage, /StorageAdapter/);
assert.match(storage, /StorageResult/);
assert.match(storage, /createMemoryStorageAdapter/);
assert.match(storage, /write-failed/);
assert.match(storage, /remove-failed/);

const uiPreferences = file("lib/uiPreferences.ts");
assert.match(uiPreferences, /milkTeaUiPreferences/);
assert.match(uiPreferences, /UI_THEME_OPTIONS/);
assert.match(uiPreferences, /soft/);
assert.match(uiPreferences, /mono/);
assert.match(uiPreferences, /liquid/);
assert.match(uiPreferences, /y2k/);
assert.match(uiPreferences, /neo/);
assert.match(uiPreferences, /cyber/);
assert.match(uiPreferences, /showCharacter/);
for (const label of requiredThemeLabels) {
  assert.match(uiPreferences, new RegExp(label), `lib/uiPreferences.ts should expose ${label}`);
}

const designSystem = file("docs/design-system.md");
assert.match(designSystem, /可切换 UI 风格/);
for (const label of requiredThemeLabels) {
  assert.match(designSystem, new RegExp(label), `docs/design-system.md should document ${label}`);
}
assert.match(designSystem, /页面背景、手机外框、卡片、按钮、底部导航、输入框、弹窗、Toast、选中态、状态色和风格色块/);
assert.match(designSystem, /人物显示偏好/);
assert.match(designSystem, /显示人物/);
assert.match(designSystem, /首页角色图/);
assert.match(designSystem, /记录页紧凑小角色/);
assert.match(designSystem, /数据页角色图、Body Score 面板、Body Score 仪表和阶段进度/);
assert.match(designSystem, /提交结果弹窗里的 Body Score 反馈/);
assert.match(designSystem, /不删除历史记录/);

const platformAdapters = file("lib/platformAdapters.ts");
assert.match(platformAdapters, /AppPlatformAdapter/);
assert.match(platformAdapters, /wechat-miniprogram/);
assert.match(platformAdapters, /iosCapabilities/);
assert.match(platformAdapters, /platformReplacementMap/);

const apiRoute = file("app/api/estimate-drink/route.ts");
assert.match(apiRoute, /dynamic = "force-dynamic"/);
assert.match(apiRoute, /runtime = "nodejs"/);
assert.match(apiRoute, /estimateWithQwen/);
assert.match(apiRoute, /getQwenRuntimeStatus/);
assert.match(apiRoute, /OPTIONS/);
assert.match(apiRoute, /MAX_BODY_BYTES/);
assert.match(apiRoute, /payload-too-large/);
assert.match(apiRoute, /Access-Control-Allow-Origin/);
assert.match(apiRoute, /MILKTEA_ALLOWED_ORIGINS/);
assert.match(apiRoute, /fallback/);

const qwenRuntime = file("lib/qwenEstimateRuntime.mjs");
assert.match(qwenRuntime, /resolveQwenConfig/);
assert.match(qwenRuntime, /cleanList/);
assert.match(qwenRuntime, /MILKTEA_AI_ENABLED/);
assert.match(qwenRuntime, /QWEN_API_KEY/);
assert.match(qwenRuntime, /xopqwen36v35b/);
assert.match(qwenRuntime, /chat\/completions/);
assert.match(qwenRuntime, /Bearer/);
assert.match(qwenRuntime, /AI 估算已在后端关闭/);

const previewServer = file("scripts/serve-preview.mjs");
assert.match(previewServer, /loadDotEnvLocal/);
assert.match(previewServer, /\/api\/estimate-drink/);
assert.match(previewServer, /estimateWithQwen/);

const envExample = file(".env.example");
assert.match(envExample, /MILKTEA_AI_ENABLED=false/);
assert.match(envExample, /QWEN_API_BASE_URL=https:\/\/maas-api\.cn-huabei-1\.xf-yun\.com\/v2/);
assert.match(envExample, /QWEN_MODEL=xopqwen36v35b/);
assert.match(envExample, /MILKTEA_ALLOWED_ORIGINS=\*/);
assert.doesNotMatch(envExample, /5905235/);

const qwenDoc = file("docs/qwen-api.md");
assert.match(qwenDoc, /MILKTEA_AI_ENABLED=true/);
assert.match(qwenDoc, /MILKTEA_AI_ENABLED=false/);
assert.match(qwenDoc, /\/api\/estimate-drink/);
assert.match(qwenDoc, /127\.0\.0\.1:4173/);
assert.match(qwenDoc, /Netlify/);
assert.match(qwenDoc, /MILKTEA_ALLOWED_ORIGINS/);
assert.doesNotMatch(qwenDoc, /127\.0\.0\.1:4180/);

const apiIntegrationStatus = file("docs/api-integration-status.md");
assert.match(apiIntegrationStatus, /API 接入状态说明/);
assert.match(apiIntegrationStatus, /\/api\/estimate-drink/);
assert.match(apiIntegrationStatus, /GET/);
assert.match(apiIntegrationStatus, /POST/);
assert.match(apiIntegrationStatus, /OPTIONS/);
assert.match(apiIntegrationStatus, /apiKeyConfigured: true/);
assert.match(apiIntegrationStatus, /verify:public-api/);
assert.match(apiIntegrationStatus, /request 合法域名/);
assert.match(apiIntegrationStatus, /templates\/wechat-miniprogram/);
assert.doesNotMatch(apiIntegrationStatus, /5905235/);

const netlifyEnvCopyPaste = file("docs/netlify-env-copy-paste.md");
assert.match(netlifyEnvCopyPaste, /Netlify 环境变量复制模板/);
assert.match(netlifyEnvCopyPaste, /MILKTEA_AI_ENABLED/);
assert.match(netlifyEnvCopyPaste, /QWEN_API_BASE_URL/);
assert.match(netlifyEnvCopyPaste, /QWEN_MODEL/);
assert.match(netlifyEnvCopyPaste, /QWEN_API_KEY/);
assert.match(netlifyEnvCopyPaste, /QWEN_API_TIMEOUT_MS/);
assert.match(netlifyEnvCopyPaste, /MILKTEA_ALLOWED_ORIGINS/);
assert.match(netlifyEnvCopyPaste, /verify:public-api/);
assert.match(netlifyEnvCopyPaste, /不要把真实 Key 写进 GitHub/);
assert.doesNotMatch(netlifyEnvCopyPaste, /5905235/);

const wechatMiniProgramLaunchManual = file("docs/wechat-mini-program-launch-manual.md");
assert.match(wechatMiniProgramLaunchManual, /微信小程序上线专项手册/);
assert.match(wechatMiniProgramLaunchManual, /request 合法域名/);
assert.match(wechatMiniProgramLaunchManual, /\/api\/estimate-drink/);
assert.match(wechatMiniProgramLaunchManual, /API_BASE_URL/);
assert.match(wechatMiniProgramLaunchManual, /QWEN_API_KEY/);
assert.match(wechatMiniProgramLaunchManual, /maas-api\.cn-huabei-1\.xf-yun\.com/);
assert.match(wechatMiniProgramLaunchManual, /不校验合法域名/);
assert.match(wechatMiniProgramLaunchManual, /真机预览/);
assert.match(wechatMiniProgramLaunchManual, /提交审核/);
assert.match(wechatMiniProgramLaunchManual, /after-netlify\.cmd/);
assert.match(wechatMiniProgramLaunchManual, /verify:public-api/);
assert.match(wechatMiniProgramLaunchManual, /touristappid/);
assert.match(wechatMiniProgramLaunchManual, /正式小程序 AppID/);
assert.match(wechatMiniProgramLaunchManual, /详情`/);
assert.match(wechatMiniProgramLaunchManual, /基本信息/);
assert.match(wechatMiniProgramLaunchManual, /如果微信后台不接受 Netlify 默认域名/);
assert.match(wechatMiniProgramLaunchManual, /微信后台可接受的 HTTPS 自定义域名/);
assert.match(wechatMiniProgramLaunchManual, /wechat-domain-verified/);
assert.match(wechatMiniProgramLaunchManual, /脚本不能登录微信公众平台/);
assert.match(wechatMiniProgramLaunchManual, /docs\/launch-acceptance-checklist\.md/);
assert.doesNotMatch(wechatMiniProgramLaunchManual, /5905235/);

const mobileDeployDoc = file("docs/mobile-and-public-deploy.md");
assert.match(mobileDeployDoc, /4173/);
assert.match(mobileDeployDoc, /Netlify/);
assert.match(mobileDeployDoc, /\.next/);
assert.doesNotMatch(mobileDeployDoc, /4180/);
assert.doesNotMatch(mobileDeployDoc, /Vercel/);

const readiness = file("docs/wechat-ios-readiness.md");
assert.match(readiness, /微信小程序第一步/);
assert.match(readiness, /iOS 第一步/);
assert.match(readiness, /不要把 API Key 放进前端/);
assert.match(readiness, /request 合法域名/);
assert.match(readiness, /\/api\/estimate-drink/);
assert.match(readiness, /wechat-api-service-template/);
assert.match(readiness, /milkTeaAppData/);

const wechatApiTemplate = file("docs/wechat-api-service-template.md");
assert.match(wechatApiTemplate, /wx\.request/);
assert.match(wechatApiTemplate, /API_BASE_URL/);
assert.match(wechatApiTemplate, /\/api\/estimate-drink/);
assert.match(wechatApiTemplate, /QWEN_API_KEY/);
assert.match(wechatApiTemplate, /request 合法域名/);

const wechatApiUrlSetter = file("scripts/set-wechat-api-base-url.mjs");
assert.match(wechatApiUrlSetter, /API_BASE_URL/);
assert.match(wechatApiUrlSetter, /\/api\/estimate-drink/);
assert.match(wechatApiUrlSetter, /https:/);
assert.match(wechatApiUrlSetter, /--dry-run/);
assert.match(wechatApiUrlSetter, /Paste the Netlify root URL or the full \/api\/estimate-drink URL/);

const publicApiVerifier = file("scripts/verify-public-api.mjs");
assert.match(publicApiVerifier, /verify:public-api/);
assert.match(publicApiVerifier, /PUBLIC_API_BASE_URL/);
assert.match(publicApiVerifier, /\/api\/estimate-drink/);
assert.match(publicApiVerifier, /OPTIONS/);
assert.match(publicApiVerifier, /ready/);
assert.match(publicApiVerifier, /Paste the Netlify root URL or the full \/api\/estimate-drink URL/);
assert.match(publicApiVerifier, /Public API verification failed/);
assert.match(publicApiVerifier, /docs\/netlify-env-copy-paste\.md/);
assert.match(publicApiVerifier, /trigger a new deploy/);

const previewUiVerifier = file("scripts/verify-preview-ui.mjs");
assert.match(previewUiVerifier, /Preview UI preferences verified/);
assert.match(previewUiVerifier, /milkTeaUiPreferences/);
assert.match(previewUiVerifier, /data-theme-choice/);
assert.match(previewUiVerifier, /showCharacter/);

const uiPreferencesVerifier = file("scripts/verify-ui-preferences.mjs");
assert.match(uiPreferencesVerifier, /UI preferences verified/);
assert.match(uiPreferencesVerifier, /requiredThemes/);
assert.match(uiPreferencesVerifier, /ThemeControls/);
assert.match(uiPreferencesVerifier, /data-character-visibility/);
assert.match(uiPreferencesVerifier, /syncResultModalCharacterText/);

const wechatTemplateVerifier = file("scripts/verify-wechat-template.mjs");
assert.match(wechatTemplateVerifier, /WeChat mini program template verified/);
assert.match(wechatTemplateVerifier, /QWEN_API_KEY/);
assert.match(wechatTemplateVerifier, /maas-api/);
assert.match(wechatTemplateVerifier, /touristappid/);
assert.match(wechatTemplateVerifier, /wx\[a-zA-Z0-9\]/);
assert.match(wechatTemplateVerifier, /上传审核前/);

const wechatTemplateApi = file("templates/wechat-miniprogram/services/aiEstimate.js");
assert.match(wechatTemplateApi, /\.\.\/config\/api\.js/);
assert.match(wechatTemplateApi, /\.\/drinkRules\.js/);
assert.match(wechatTemplateApi, /wx\.request/);
assert.match(wechatTemplateApi, /AI_ESTIMATE_PATH/);
assert.match(wechatTemplateApi, /catch\(\(\) => localEstimate\)/);

const wechatTemplateApp = file("templates/wechat-miniprogram/app.json");
assert.match(wechatTemplateApp, /pages\/record\/record/);

const wechatTemplateRecord = file("templates/wechat-miniprogram/pages/record/record.js");
assert.match(wechatTemplateRecord, /\.\.\/\.\.\/services\/aiEstimate\.js/);
assert.match(wechatTemplateRecord, /estimateDrinkSmart/);
assert.match(wechatTemplateRecord, /onDrinkNameInput/);
assert.match(wechatTemplateRecord, /toggleTopping/);

const wechatTemplateRecordWxml = file("templates/wechat-miniprogram/pages/record/record.wxml");
assert.match(wechatTemplateRecordWxml, /bindtap="submitEstimate"/);
assert.match(wechatTemplateRecordWxml, /\/api\/estimate-drink/);

const qwenEnvChecker = file("scripts/check-qwen-env.mjs");
assert.match(qwenEnvChecker, /getQwenRuntimeStatus/);
assert.match(qwenEnvChecker, /\.env\.local/);
assert.match(qwenEnvChecker, /apiKeyConfigured/);

const qwenDirectVerifier = file("scripts/verify-qwen-direct.mjs");
assert.match(qwenDirectVerifier, /estimateWithQwen/);
assert.match(qwenDirectVerifier, /getQwenRuntimeStatus/);
assert.match(qwenDirectVerifier, /AI智能估算/);

const githubReadyChecker = file("scripts/check-github-ready.mjs");
assert.match(githubReadyChecker, /\.gitignore/);
assert.match(githubReadyChecker, /\.launch-state\.json/);
assert.match(githubReadyChecker, /start-here\.cmd/);
assert.match(githubReadyChecker, /\.gitattributes/);
assert.match(githubReadyChecker, /secretHits/);
assert.match(githubReadyChecker, /gitTrackedFiles/);
assert.match(githubReadyChecker, /forbiddenTrackedFiles/);
assert.match(githubReadyChecker, /github-upload-manual/);
assert.match(githubReadyChecker, /netlify-deploy-manual/);
assert.match(githubReadyChecker, /start-here-after-sleep/);
assert.match(githubReadyChecker, /user-action-items-after-sleep/);
assert.match(githubReadyChecker, /api-integration-status/);
assert.match(githubReadyChecker, /netlify-env-copy-paste/);
assert.match(githubReadyChecker, /wechat-mini-program-launch-manual/);
assert.match(githubReadyChecker, /wechat-verification-recording/);
assert.match(githubReadyChecker, /zero-code-launch-manual/);
assert.match(githubReadyChecker, /project-introduction/);

const goalStatusChecker = file("scripts/check-goal-status.mjs");
assert.match(goalStatusChecker, /localImplementationReady/);
assert.match(goalStatusChecker, /externalLaunchVerified/);
assert.match(goalStatusChecker, /launch-control\.cmd/);
assert.match(goalStatusChecker, /\.launch-state\.json/);
assert.match(goalStatusChecker, /six-ui-themes/);
assert.match(goalStatusChecker, /theme-surface-coverage-present/);
assert.match(goalStatusChecker, /theme-toggle-track/);
assert.match(goalStatusChecker, /text colors, and character toggle track/);
assert.match(goalStatusChecker, /character-toggle-present/);
assert.match(goalStatusChecker, /generate-package-lock\.cmd/);
assert.match(goalStatusChecker, /public-api-verified/);
assert.match(goalStatusChecker, /wechat-template-smoke-present/);
assert.match(goalStatusChecker, /after-netlify-verifies-wechat-template/);
assert.match(goalStatusChecker, /wechat-appid-helper-present/);
assert.match(goalStatusChecker, /wechat-domain-marker-present/);
assert.match(goalStatusChecker, /wechat-domain-verified/);
assert.match(goalStatusChecker, /manual confirmation required/);
assert.match(goalStatusChecker, /mark-wechat-verified\.cmd/);
assert.match(goalStatusChecker, /launch-acceptance-checklist/);
assert.match(goalStatusChecker, /Netlify default domain is rejected/);

const launchHandoffChecker = file("scripts/check-launch-handoff.mjs");
assert.match(launchHandoffChecker, /externalActions/);
assert.match(launchHandoffChecker, /launch-control\.cmd/);
assert.match(launchHandoffChecker, /\.launch-state\.json/);
assert.match(launchHandoffChecker, /start-here-after-sleep/);
assert.match(launchHandoffChecker, /user-action-items-after-sleep/);
assert.match(launchHandoffChecker, /dependency-install-fallback/);
assert.match(launchHandoffChecker, /github-upload-manual/);
assert.match(launchHandoffChecker, /netlify-deploy-manual/);
assert.match(launchHandoffChecker, /netlify-env-copy-paste/);
assert.match(launchHandoffChecker, /wechat-mini-program-launch-manual/);
assert.match(launchHandoffChecker, /github-remote/);
assert.match(launchHandoffChecker, /netlify-public-url/);
assert.match(launchHandoffChecker, /after-netlify\.cmd/);
assert.match(launchHandoffChecker, /install-local-deps\.cmd/);
assert.match(launchHandoffChecker, /generate-package-lock\.cmd/);
assert.match(launchHandoffChecker, /WeChat template checks and smoke test/);
assert.match(launchHandoffChecker, /wechat-domain/);
assert.match(launchHandoffChecker, /mark-wechat-verified\.cmd/);
assert.match(launchHandoffChecker, /Netlify default domain cannot be saved/);
assert.match(launchHandoffChecker, /QWEN_API_KEY/);

const afterNetlifyCmd = file("after-netlify.cmd");
assert.match(afterNetlifyCmd, /verify:public-api/);
assert.match(afterNetlifyCmd, /wechat:set-api-url/);
assert.match(afterNetlifyCmd, /verify:wechat-template/);
assert.match(afterNetlifyCmd, /smoke:wechat-template/);
assert.match(afterNetlifyCmd, /launch:mark-public-api/);
assert.match(afterNetlifyCmd, /\.launch-state\.json/);
assert.match(afterNetlifyCmd, /if errorlevel 1/);
assert.match(afterNetlifyCmd, /request legal domain/);

const publicApiStateMarker = file("scripts/mark-public-api-verified.mjs");
assert.match(publicApiStateMarker, /\.launch-state\.json/);
assert.match(publicApiStateMarker, /publicApiVerified/);
assert.match(publicApiStateMarker, /\/api\/estimate-drink/);
assert.match(publicApiStateMarker, /--dry-run/);
assert.match(publicApiStateMarker, /readLaunchState/);

const wechatDomainStateMarker = file("scripts/mark-wechat-domain-verified.mjs");
assert.match(wechatDomainStateMarker, /\.launch-state\.json/);
assert.match(wechatDomainStateMarker, /wechatDomainVerified/);
assert.match(wechatDomainStateMarker, /wechatDomainVerifiedAt/);
assert.match(wechatDomainStateMarker, /wechatApiBaseUrl/);
assert.match(wechatDomainStateMarker, /\/api\/estimate-drink/);
assert.match(wechatDomainStateMarker, /--dry-run/);

const installLocalDepsCmd = file("install-local-deps.cmd");
assert.match(installLocalDepsCmd, /npm install --cache \.npm-cache/);
assert.match(installLocalDepsCmd, /npm run verify/);
assert.match(installLocalDepsCmd, /npm run build/);
assert.match(installLocalDepsCmd, /node_modules must not be committed/);

const generatePackageLockCmd = file("generate-package-lock.cmd");
assert.match(generatePackageLockCmd, /npm install --package-lock-only --ignore-scripts --cache \.npm-cache/);
assert.match(generatePackageLockCmd, /package-lock\.json was created/);
assert.match(generatePackageLockCmd, /Do not commit node_modules/);
assert.match(generatePackageLockCmd, /dependency-install-fallback/);

const launchControlCmd = file("launch-control.cmd");
assert.match(launchControlCmd, /check-status\.cmd/);
assert.match(launchControlCmd, /connect-github\.cmd/);
assert.match(launchControlCmd, /after-netlify\.cmd/);
assert.match(launchControlCmd, /check-wechat-template\.cmd/);
assert.match(launchControlCmd, /generate-package-lock\.cmd/);
assert.match(launchControlCmd, /install-local-deps\.cmd/);
assert.match(launchControlCmd, /what-you-need-to-do\.cmd/);
assert.match(launchControlCmd, /project-introduction\.md/);
assert.match(launchControlCmd, /zero-code-launch-manual\.md/);
assert.match(launchControlCmd, /netlify-env-copy-paste\.md/);
assert.match(launchControlCmd, /api-integration-status\.md/);
assert.match(launchControlCmd, /launch-acceptance-checklist\.md/);
assert.match(launchControlCmd, /set-wechat-appid\.cmd/);
assert.match(launchControlCmd, /mark-wechat-verified\.cmd/);
assert.match(launchControlCmd, /choice \/C 123456789ALEICDWP0/);

const markWechatVerifiedCmd = file("mark-wechat-verified.cmd");
assert.match(markWechatVerifiedCmd, /launch:mark-wechat-domain/);
assert.match(markWechatVerifiedCmd, /check:goal-status/);
assert.match(markWechatVerifiedCmd, /QWEN_API_KEY/);
assert.match(markWechatVerifiedCmd, /WeChat backend root URL/);

const setWechatAppidCmd = file("set-wechat-appid.cmd");
assert.match(setWechatAppidCmd, /wechat:set-appid/);
assert.match(setWechatAppidCmd, /touristappid/);
assert.match(setWechatAppidCmd, /WeChat AppID/);

const setWechatAppidScript = file("scripts/set-wechat-appid.mjs");
assert.match(setWechatAppidScript, /project\.config\.json/);
assert.match(setWechatAppidScript, /touristappid/);
assert.match(setWechatAppidScript, /wx\[a-zA-Z0-9\]/);
assert.match(setWechatAppidScript, /--dry-run/);

const connectGithubCmd = file("connect-github.cmd");
assert.match(connectGithubCmd, /GitHub connection or push failed/);
assert.match(connectGithubCmd, /browser authorization/);
assert.match(connectGithubCmd, /docs\\github-upload-manual\.md/);
assert.match(connectGithubCmd, /Refresh the repository page/);

const checkWechatTemplateCmd = file("check-wechat-template.cmd");
assert.match(checkWechatTemplateCmd, /verify:wechat-template/);
assert.match(checkWechatTemplateCmd, /smoke:wechat-template/);
assert.match(checkWechatTemplateCmd, /QWEN_API_KEY/);
assert.match(checkWechatTemplateCmd, /QWEN API domain/);

const runbook = file("docs/deployment-runbook.md");
assert.match(runbook, /GitHub/);
assert.match(runbook, /Netlify/);
assert.match(runbook, /微信小程序/);
assert.match(runbook, /ill-quit-milktea/);
assert.match(runbook, /QWEN_API_KEY/);
assert.match(runbook, /check:github-ready/);
assert.match(runbook, /check:qwen-env/);
assert.match(runbook, /verify:qwen-direct/);
assert.match(runbook, /verify:api-live/);
assert.match(runbook, /verify:public-api/);
assert.match(runbook, /forbiddenTrackedFiles/);
assert.match(runbook, /after-netlify\.cmd/);
assert.match(runbook, /request 合法域名/);
assert.match(runbook, /deployment-troubleshooting/);

const dependencyInstallFallback = file("docs/dependency-install-fallback.md");
assert.match(dependencyInstallFallback, /npm install 超时兜底手册/);
assert.match(dependencyInstallFallback, /package-lock\.json/);
assert.match(dependencyInstallFallback, /node_modules/);
assert.match(dependencyInstallFallback, /check-npm-network\.cmd/);
assert.match(dependencyInstallFallback, /generate-package-lock\.cmd/);
assert.match(dependencyInstallFallback, /--package-lock-only --ignore-scripts/);
assert.match(dependencyInstallFallback, /\.npmrc/);
assert.match(dependencyInstallFallback, /next is not recognized/);
assert.match(dependencyInstallFallback, /Netlify 云端安装依赖/);
assert.match(dependencyInstallFallback, /Deploy log/);
assert.match(dependencyInstallFallback, /registry\.npmjs\.org/);
assert.match(dependencyInstallFallback, /ECONNRESET/);
assert.match(dependencyInstallFallback, /不要把 `node_modules\/` 手动复制进 GitHub/);
assert.doesNotMatch(dependencyInstallFallback, /5905235/);

const githubUploadManual = file("docs/github-upload-manual.md");
assert.match(githubUploadManual, /GitHub 上传专项手册/);
assert.match(githubUploadManual, /New repository/);
assert.match(githubUploadManual, /Create repository/);
assert.match(githubUploadManual, /git remote add origin/);
assert.match(githubUploadManual, /git remote set-url origin/);
assert.match(githubUploadManual, /git push -u origin main/);
assert.match(githubUploadManual, /npm run check:github-ready/);
assert.match(githubUploadManual, /npm run check:goal-status/);
assert.match(githubUploadManual, /GitHub connection or push failed/);
assert.match(githubUploadManual, /浏览器授权/);
assert.match(githubUploadManual, /docs\/deployment-troubleshooting\.md/);
assert.match(githubUploadManual, /\.env\.local/);
assert.doesNotMatch(githubUploadManual, /5905235/);

const netlifyDeployManual = file("docs/netlify-deploy-manual.md");
assert.match(netlifyDeployManual, /Netlify 部署专项手册/);
assert.match(netlifyDeployManual, /Build command: npm run build/);
assert.match(netlifyDeployManual, /Publish directory: \.next/);
assert.match(netlifyDeployManual, /NODE_VERSION = "22"/);
assert.match(netlifyDeployManual, /docs\/netlify-env-copy-paste\.md/);
assert.match(netlifyDeployManual, /QWEN_API_KEY/);
assert.match(netlifyDeployManual, /Deploy log/);
assert.match(netlifyDeployManual, /Published/);
assert.match(netlifyDeployManual, /after-netlify\.cmd/);
assert.match(netlifyDeployManual, /\.launch-state\.json/);
assert.match(netlifyDeployManual, /verify:public-api/);
assert.match(netlifyDeployManual, /verify-public-api\.cmd/);
assert.match(netlifyDeployManual, /PUBLIC_API_BASE_URL/);
assert.doesNotMatch(netlifyDeployManual, /5905235/);

const prepReport = file("docs/deployment-prep-report.md");
assert.match(prepReport, /npm run verify/);
assert.match(prepReport, /check:github-ready/);
assert.match(prepReport, /\.npmrc/);
assert.match(prepReport, /check:qwen-env/);
assert.match(prepReport, /verify:qwen-direct/);
assert.match(prepReport, /verify:api-live/);
assert.match(prepReport, /QWEN API 请求超时/);
assert.match(prepReport, /verify:public-api/);
assert.match(prepReport, /npm run build/);
assert.match(prepReport, /npm run build/);
assert.match(prepReport, /node_modules/);
assert.match(prepReport, /milkTeaUiPreferences/);
assert.match(prepReport, /npm install --package-lock-only/);
assert.match(prepReport, /launch-acceptance-checklist/);
assert.match(prepReport, /OpenNext adapter/);
assert.match(prepReport, /docs\/deployment-runbook\.md/);
assert.match(prepReport, /deployment-troubleshooting/);

const troubleshooting = file("docs/deployment-troubleshooting.md");
assert.match(troubleshooting, /check:github-ready/);
assert.match(troubleshooting, /connect-github\.cmd/);
assert.match(troubleshooting, /GitHub connection or push failed/);
assert.match(troubleshooting, /Netlify 构建失败/);
assert.match(troubleshooting, /ready: false/);
assert.match(troubleshooting, /QWEN_API_KEY/);
assert.match(troubleshooting, /request 合法域名/);
assert.match(troubleshooting, /verify:public-api/);
assert.match(troubleshooting, /verify:qwen-direct/);
assert.match(troubleshooting, /QWEN 上游/);
assert.match(troubleshooting, /POST 返回 413/);
assert.match(troubleshooting, /微信后台不接受 Netlify 默认域名/);
assert.match(troubleshooting, /不要这样做/);

const zeroCodeLaunchManual = file("docs/zero-code-launch-manual.md");
assert.match(zeroCodeLaunchManual, /0 代码基础上线操作手册/);
assert.match(zeroCodeLaunchManual, /GitHub/);
assert.match(zeroCodeLaunchManual, /Netlify/);
assert.match(zeroCodeLaunchManual, /QWEN_API_KEY/);
assert.match(zeroCodeLaunchManual, /verify:public-api/);
assert.match(zeroCodeLaunchManual, /forbiddenTrackedFiles/);
assert.match(zeroCodeLaunchManual, /request 合法域名/);
assert.match(zeroCodeLaunchManual, /wx\.request/);
assert.match(zeroCodeLaunchManual, /Create repository/);

const startHereAfterSleep = file("docs/start-here-after-sleep.md");
assert.match(startHereAfterSleep, /醒来后先看这里/);
assert.match(startHereAfterSleep, /start-here\.cmd/);
assert.match(startHereAfterSleep, /what-you-need-to-do\.cmd/);
assert.match(startHereAfterSleep, /generate-package-lock\.cmd/);
assert.match(startHereAfterSleep, /docs\/user-action-items-after-sleep\.md/);
assert.match(startHereAfterSleep, /check-status\.cmd/);
assert.match(startHereAfterSleep, /verify-public-api\.cmd/);
assert.match(startHereAfterSleep, /docs\/dependency-install-fallback\.md/);
assert.match(startHereAfterSleep, /docs\/github-upload-manual\.md/);
assert.match(startHereAfterSleep, /docs\/netlify-deploy-manual\.md/);
assert.match(startHereAfterSleep, /docs\/netlify-env-copy-paste\.md/);
assert.match(startHereAfterSleep, /docs\/wechat-mini-program-launch-manual\.md/);
assert.match(startHereAfterSleep, /A 打开 0 代码完整上线手册/);
assert.match(startHereAfterSleep, /L 只生成 package-lock\.json/);
assert.match(startHereAfterSleep, /E 打开 Netlify 环境变量复制模板/);
assert.match(startHereAfterSleep, /I 打开 API 接入状态说明/);
assert.match(startHereAfterSleep, /C 打开上线后验收交接单/);
assert.match(startHereAfterSleep, /D 设置微信小程序正式 AppID/);
assert.match(startHereAfterSleep, /W 记录微信合法域名和真机预览验收/);
assert.match(startHereAfterSleep, /check-npm-network\.cmd/);
assert.match(startHereAfterSleep, /set-wechat-appid\.cmd/);
assert.match(startHereAfterSleep, /GitHub/);
assert.match(startHereAfterSleep, /Netlify/);
assert.match(startHereAfterSleep, /QWEN_API_KEY/);
assert.match(startHereAfterSleep, /\/api\/estimate-drink/);
assert.match(startHereAfterSleep, /verify:public-api/);
assert.match(startHereAfterSleep, /\.launch-state\.json/);
assert.match(startHereAfterSleep, /request 合法域名/);
assert.match(startHereAfterSleep, /templates\/wechat-miniprogram/);
assert.match(startHereAfterSleep, /docs\/zero-code-launch-manual\.md/);
assert.match(startHereAfterSleep, /docs\/project-introduction\.md/);
assert.match(startHereAfterSleep, /docs\/api-integration-status\.md/);
assert.doesNotMatch(startHereAfterSleep, /5905235/);

const userActionItems = file("docs/user-action-items-after-sleep.md");
assert.match(userActionItems, /需要你亲自操作的事项/);
assert.match(userActionItems, /GitHub/);
assert.match(userActionItems, /Netlify/);
assert.match(userActionItems, /QWEN_API_KEY/);
assert.match(userActionItems, /微信公众平台/);
assert.match(userActionItems, /request 合法域名/);
assert.match(userActionItems, /templates\/wechat-miniprogram/);
assert.match(userActionItems, /after-netlify\.cmd/);
assert.match(userActionItems, /check-status\.cmd/);
assert.match(userActionItems, /微信后台保存失败/);
assert.match(userActionItems, /touristappid/);
assert.match(userActionItems, /详情 -> 基本信息/);
assert.match(userActionItems, /docs\/launch-acceptance-checklist\.md/);
assert.match(userActionItems, /verifiedAt/);
assert.match(userActionItems, /不要把真实 `QWEN_API_KEY`/);
assert.doesNotMatch(userActionItems, /5905235/);

const projectIntro = file("docs/project-introduction.md");
assert.match(projectIntro, /项目完整介绍/);
assert.match(projectIntro, /虚拟下单/);
assert.match(projectIntro, /AI 估算价格、热量、糖分/);
assert.match(projectIntro, /Body Score/);
assert.match(projectIntro, /会变化体型的小人/);
assert.match(projectIntro, /tap-burst/);
assert.match(projectIntro, /selected-pop/);
assert.match(projectIntro, /milkTeaAppData/);
assert.match(projectIntro, /milkTeaUiPreferences/);
for (const label of requiredThemeLabels) {
  assert.match(projectIntro, new RegExp(label), `docs/project-introduction.md should document ${label}`);
}
assert.match(projectIntro, /切换后页面背景、手机外框、卡片、按钮、底部导航、输入框、弹窗、Toast、选中态和状态色都会跟随变化/);
assert.match(projectIntro, /显示人物/);
assert.match(projectIntro, /首页角色图、记录页小角色、数据页角色图、Body Score 面板、阶段进度和提交结果里的 Body Score 反馈/);
assert.match(projectIntro, /\/api\/estimate-drink/);
assert.match(projectIntro, /launch-control\.cmd/);
assert.match(projectIntro, /connect-github\.cmd/);
assert.match(projectIntro, /after-netlify\.cmd/);
assert.match(projectIntro, /check-wechat-template\.cmd/);
assert.match(projectIntro, /set-wechat-appid\.cmd/);
assert.match(projectIntro, /mark-wechat-verified\.cmd/);
assert.match(projectIntro, /check-npm-network\.cmd/);
assert.match(projectIntro, /install-local-deps\.cmd/);
assert.match(projectIntro, /金币与换装系统/);
assert.match(projectIntro, /milkTeaWardrobe/);

const wardrobeGuide = file("docs/wardrobe-and-coins.md");
assert.match(wardrobeGuide, /金币与角色衣橱说明/);
assert.match(wardrobeGuide, /奖励 `10` 个金币/);
assert.match(wardrobeGuide, /已提供的 10 件服装/);
assert.match(wardrobeGuide, /0\.87、0\.93、1\.00、1\.07、1\.15/);

const wardrobe = file("lib/wardrobe.ts");
assert.match(wardrobe, /COINS_PER_SAVED_CUP = 10/);
assert.match(wardrobe, /export const OUTFITS/);
assert.match(wardrobe, /purchaseOutfit/);
assert.match(wardrobe, /availableCoins/);
assert.match(file("components/WardrobeShop.tsx"), /用戒奶茶金币换新衣/);
const characterDisplay = file("components/CharacterDisplay.tsx");
assert.match(characterDisplay, /character-outfit/);
assert.match(characterDisplay, /character-canvas-anchor/);
assert.match(characterDisplay, /src=\{outfit\.previewPath\}/);
assert.match(characterDisplay, /motionFrame === "blink" \? "opacity-100" : "opacity-0"/);
assert.match(characterDisplay, /motionFrame === "wave" \? "opacity-100" : "opacity-0"/);
assert.doesNotMatch(characterDisplay, /setSrc\(framePath\)/);
assert.match(globals, /\.character-canvas-anchor/);
assert.match(globals, /\.character-outfit \{/);
assert.doesNotMatch(globals, /\.character-outfit::before/);
for (const stage of [1, 2, 3, 4, 5]) {
  assert.match(globals, new RegExp(`\\[data-character-stage="${stage}"\\] \\.character-outfit`));
}
assert.match(preview, /KEY_WARDROBE/);
assert.match(preview, /WARDROBE_STORAGE_KEY|milkTeaWardrobe/);
assert.match(preview, /character-canvas-anchor/);
assert.match(preview, /equipped\.asset/);
assert.match(preview, /<img class="character-outfit \$\{equipped\.id\}"/);
assert.doesNotMatch(preview, /\.character-outfit::before/);
const wardrobeFitCheck = file("public/wardrobe-fit-check.html");
assert.match(wardrobeFitCheck, /10 套服饰/);
assert.match(wardrobeFitCheck, /\[1,2,3,4,5\]\.map/);
const wardrobeOutfits = [
  "kpop-lilac",
  "hanfu-cloud",
  "denim-street",
  "ballet-pink",
  "coquette-red",
  "techwear-black",
  "summer-sundress",
  "office-chic",
  "idol-silver",
  "winter-coat"
];
wardrobeOutfits.forEach((outfit) => {
  image(`public/images/outfits/${outfit}.png`);
  assert.match(wardrobeFitCheck, new RegExp(outfit));
});

const launchAcceptance = file("docs/launch-acceptance-checklist.md");
assert.match(launchAcceptance, /Netlify 公共链接/);
assert.match(launchAcceptance, /verify:public-api/);
assert.match(launchAcceptance, /\.launch-state\.json/);
assert.match(launchAcceptance, /publicUrl/);
assert.match(launchAcceptance, /apiUrl/);
assert.match(launchAcceptance, /verifiedAt/);
assert.match(launchAcceptance, /不要把真实 `QWEN_API_KEY`/);
for (const label of requiredThemeLabels) {
  assert.match(launchAcceptance, new RegExp(label), `docs/launch-acceptance-checklist.md should include UI acceptance item ${label}`);
}
assert.match(launchAcceptance, /页面背景、手机外框、卡片、按钮、底部导航、输入框、弹窗和 Toast 都跟随变化/);
assert.match(launchAcceptance, /Body Score 面板、Body Score 仪表、阶段进度和提交结果里的 Body Score 反馈不再出现/);
assert.match(launchAcceptance, /ready 是 true/);
assert.match(launchAcceptance, /request 合法域名/);
assert.match(launchAcceptance, /templates\/wechat-miniprogram/);
assert.match(launchAcceptance, /touristappid/);
assert.match(launchAcceptance, /微信 request 合法域名保存时间/);
assert.match(launchAcceptance, /真机预览测试时间/);
assert.match(launchAcceptance, /真机调试或日志里请求的是/);
assert.match(launchAcceptance, /QWEN_API_KEY/);
assert.match(launchAcceptance, /maas-api\.cn-huabei-1\.xf-yun\.com/);
assert.match(launchAcceptance, /微信小程序真机 API 是否可用/);

console.log("Project structure and assets verified.");
