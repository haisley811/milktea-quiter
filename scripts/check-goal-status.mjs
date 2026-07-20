import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredThemes = ["soft", "mono", "liquid", "y2k", "neo", "cyber"];

function file(path) {
  return readFileSync(join(root, path), "utf8");
}

function has(path, pattern) {
  return pattern.test(file(path));
}

function gitRemote() {
  try {
    return execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
}

function httpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function readLaunchState() {
  if (!existsSync(".launch-state.json")) return null;

  try {
    const state = JSON.parse(file(".launch-state.json"));
    if (!state || typeof state !== "object") return null;
    return state;
  } catch {
    return null;
  }
}

function pass(name, passed, evidence, nextStep = "") {
  return { name, passed, evidence, nextStep };
}

const uiPreferences = file("lib/uiPreferences.ts");
const themeKeys = [...uiPreferences.matchAll(/key:\s*"([^"]+)"/g)].map((match) => match[1]);
const launchState = readLaunchState();
const launchStatePublicUrl = launchState?.publicUrl || "";
const publicUrl = process.env.PUBLIC_API_BASE_URL || process.env.SITE_URL || launchStatePublicUrl || "";
const publicApiVerified = Boolean(
  launchState?.publicApiVerified
    && httpsUrl(launchState.publicUrl)
    && launchState.apiUrl === `${launchState.publicUrl}/api/estimate-drink`
);
const wechatDomainVerified = Boolean(
  launchState?.wechatDomainVerified
    && httpsUrl(launchState.wechatApiBaseUrl)
    && launchState.wechatApiUrl === `${launchState.wechatApiBaseUrl}/api/estimate-drink`
);
const remote = gitRemote();

const localChecks = [
  pass("api-route-present", existsSync("app/api/estimate-drink/route.ts"), "app/api/estimate-drink/route.ts"),
  pass("api-supports-get-post-options", ["GET", "POST", "OPTIONS"].every((method) => has("app/api/estimate-drink/route.ts", new RegExp(`export async function ${method}`))), "app/api/estimate-drink/route.ts"),
  pass("qwen-runtime-server-side", has("lib/qwenEstimateRuntime.mjs", /QWEN_API_KEY/) && has("app/api/estimate-drink/route.ts", /estimateWithQwen/), "lib/qwenEstimateRuntime.mjs + app/api/estimate-drink/route.ts"),
  pass("six-ui-themes", JSON.stringify(themeKeys) === JSON.stringify(requiredThemes), `themes=${themeKeys.join(",")}`),
  pass("theme-controls-present", has("components/ThemeControls.tsx", /UI_THEME_OPTIONS\.map/) && has("components/ThemeControls.tsx", /onThemeChange/), "components/ThemeControls.tsx"),
  pass(
    "theme-surface-coverage-present",
    [
      /\[data-ui-theme\] \.app-frame/,
      /\[data-ui-theme\] :where\(button\)/,
      /\.theme-control-card/,
      /nav/,
      /\.modal-enter/,
      /\.toast-enter/,
      /\.theme-toggle-track/,
      /\.theme-toggle-knob/,
      /input/,
      /\.text-\\\[\\#7D679D\\\]/,
      /\.text-\\\[\\#8D4970\\\]/,
      /button\[aria-current="page"\]/
    ].every((pattern) => has("app/globals.css", pattern)),
    "app/globals.css theme coverage for frame, nav, buttons, inputs, cards, modals, toast, text colors, and character toggle track"
  ),
  pass("character-toggle-present", has("components/ThemeControls.tsx", /onShowCharacterChange/) && has("app/page.tsx", /changeCharacterVisibility/), "components/ThemeControls.tsx + app/page.tsx"),
  pass("character-parts-hideable", ["HomeView", "RecordView", "DataView", "ResultModal"].every((name) => has(name === "ResultModal" ? "components/ResultModal.tsx" : `components/views/${name}.tsx`, /showCharacter/)), "HomeView, RecordView, DataView, ResultModal"),
  pass("static-preview-supports-ui-preferences", has("public/preview.html", /UI_THEMES/) && has("public/preview.html", /data-show-character/) && has("public/preview.html", /applyUiPreferencesToPreview/), "public/preview.html"),
  pass(
    "wechat-template-present",
    existsSync("templates/wechat-miniprogram/app.json")
      && existsSync("templates/wechat-miniprogram/pages/record/record.wxml")
      && existsSync("templates/wechat-miniprogram/services/aiEstimate.js")
      && has("templates/wechat-miniprogram/services/aiEstimate.js", /wx\.request/),
    "templates/wechat-miniprogram/ complete importable template"
  ),
  pass(
    "wechat-template-smoke-present",
    existsSync("scripts/smoke-wechat-template.mjs")
      && has("package.json", /smoke:wechat-template/)
      && has("check-wechat-template.cmd", /smoke:wechat-template/),
    "scripts/smoke-wechat-template.mjs simulates wx.request success and fallback"
  ),
  pass("wechat-template-check-helper-present", existsSync("check-wechat-template.cmd"), "check-wechat-template.cmd"),
  pass("wechat-api-url-helper-present", existsSync("set-wechat-api-url.cmd") && existsSync("scripts/set-wechat-api-base-url.mjs"), "set-wechat-api-url.cmd + scripts/set-wechat-api-base-url.mjs"),
  pass("wechat-appid-helper-present", existsSync("set-wechat-appid.cmd") && existsSync("scripts/set-wechat-appid.mjs") && has("package.json", /wechat:set-appid/), "set-wechat-appid.cmd + scripts/set-wechat-appid.mjs"),
  pass("wechat-domain-marker-present", existsSync("mark-wechat-verified.cmd") && existsSync("scripts/mark-wechat-domain-verified.mjs") && has("package.json", /launch:mark-wechat-domain/), "mark-wechat-verified.cmd + scripts/mark-wechat-domain-verified.mjs"),
  pass("github-connect-helper-present", existsSync("connect-github.cmd") && existsSync("scripts/connect-github-remote.mjs"), "connect-github.cmd + scripts/connect-github-remote.mjs"),
  pass("after-netlify-helper-present", existsSync("after-netlify.cmd"), "after-netlify.cmd"),
  pass(
    "after-netlify-verifies-wechat-template",
    has("after-netlify.cmd", /verify:public-api/)
      && has("after-netlify.cmd", /wechat:set-api-url/)
      && has("after-netlify.cmd", /verify:wechat-template/)
      && has("after-netlify.cmd", /smoke:wechat-template/)
      && has("after-netlify.cmd", /launch:mark-public-api/),
    "after-netlify.cmd verifies public API, updates WeChat template, runs template checks, and records launch state"
  ),
  pass("local-deps-helper-present", existsSync("install-local-deps.cmd") && existsSync("generate-package-lock.cmd"), "install-local-deps.cmd + generate-package-lock.cmd"),
  pass("launch-control-helper-present", existsSync("launch-control.cmd"), "launch-control.cmd"),
  pass("zero-code-docs-present", ["docs/start-here-after-sleep.md", "docs/user-action-items-after-sleep.md", "docs/zero-code-launch-manual.md", "docs/project-introduction.md", "docs/api-integration-status.md", "docs/wechat-verification-recording.md"].every(existsSync), "docs/")
];

const externalChecks = [
  pass("github-remote-configured", Boolean(remote), remote || "missing", "Create an empty GitHub repo, then double-click connect-github.cmd and paste the HTTPS repo URL"),
  pass("package-lock-present", existsSync("package-lock.json"), existsSync("package-lock.json") ? "package-lock.json" : "missing", "When local network works, double-click generate-package-lock.cmd for lockfile only, or install-local-deps.cmd for full install; otherwise let Netlify install in cloud"),
  pass("local-dependencies-installed", existsSync("node_modules"), existsSync("node_modules") ? "node_modules" : "missing", "When local network works, double-click install-local-deps.cmd"),
  pass("public-url-provided", httpsUrl(publicUrl), publicUrl || "missing PUBLIC_API_BASE_URL/SITE_URL/.launch-state.json", "Deploy to Netlify, then double-click after-netlify.cmd and paste the Netlify URL"),
  pass("public-api-verified", publicApiVerified, publicApiVerified ? `.launch-state.json verifiedAt=${launchState.verifiedAt || "unknown"}` : "requires after-netlify.cmd success", "After deployment double-click after-netlify.cmd and paste the Netlify URL"),
  pass(
    "wechat-domain-verified",
    wechatDomainVerified,
    wechatDomainVerified
      ? `.launch-state.json wechatDomainVerifiedAt=${launchState.wechatDomainVerifiedAt || "unknown"} backend=${launchState.wechatApiBaseUrl}`
      : "manual confirmation required in WeChat public platform and real phone preview",
    "Add the backend root domain to request legal domain, test on a real phone, then double-click mark-wechat-verified.cmd and record evidence in docs/launch-acceptance-checklist.md; if Netlify default domain is rejected, use an accepted HTTPS custom/proxy/backend domain"
  )
];

const localReady = localChecks.every((item) => item.passed);
const externalReady = externalChecks.every((item) => item.passed);

const result = {
  ok: localReady,
  complete: localReady && externalReady,
  launchControl: "launch-control.cmd",
  startHere: "docs/start-here-after-sleep.md",
  userActionChecklist: "docs/user-action-items-after-sleep.md",
  summary: {
    localImplementationReady: localReady,
    externalLaunchVerified: externalReady,
    uiThemesRequired: requiredThemes.length,
    uiThemesFound: themeKeys.length,
    gitRemoteConfigured: Boolean(remote),
    packageLockPresent: existsSync("package-lock.json"),
    nodeModulesPresent: existsSync("node_modules"),
    publicUrl: publicUrl || null,
    publicApiVerified,
    publicApiVerifiedAt: publicApiVerified ? launchState.verifiedAt || null : null,
    wechatDomainVerified,
    wechatDomainVerifiedAt: wechatDomainVerified ? launchState.wechatDomainVerifiedAt || null : null,
    wechatApiBaseUrl: wechatDomainVerified ? launchState.wechatApiBaseUrl || null : null,
    launchStatePresent: Boolean(launchState)
  },
  localChecks,
  externalChecks
};

console.log(JSON.stringify(result, null, 2));

if (!localReady) {
  process.exitCode = 1;
}
