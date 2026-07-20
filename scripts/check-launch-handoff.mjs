import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function readGitRemote() {
  try {
    return execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
}

function checkHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function readLaunchState() {
  if (!existsSync(".launch-state.json")) return null;

  try {
    const state = JSON.parse(readFileSync(".launch-state.json", "utf8"));
    if (!state || typeof state !== "object") return null;
    return state;
  } catch {
    return null;
  }
}

const gitRemote = readGitRemote();
const launchState = readLaunchState();
const launchStatePublicUrl = launchState?.publicUrl || "";
const publicUrl = process.env.PUBLIC_API_BASE_URL || process.env.SITE_URL || launchStatePublicUrl || "";
const publicApiVerified = Boolean(
  launchState?.publicApiVerified
    && checkHttpsUrl(launchState.publicUrl)
    && launchState.apiUrl === `${launchState.publicUrl}/api/estimate-drink`
);
const wechatDomainVerified = Boolean(
  launchState?.wechatDomainVerified
    && checkHttpsUrl(launchState.wechatApiBaseUrl)
    && launchState.wechatApiUrl === `${launchState.wechatApiBaseUrl}/api/estimate-drink`
);
const hasPackageLock = existsSync("package-lock.json");
const hasNodeModules = existsSync("node_modules");

const externalActions = [];

if (!gitRemote) {
  externalActions.push({
    id: "github-remote",
    action: "Create an empty GitHub repository, then double-click connect-github.cmd, paste the HTTPS repo URL, and push main.",
    doc: "docs/github-upload-manual.md"
  });
}

if (!publicUrl) {
  externalActions.push({
    id: "netlify-public-url",
    action: "After Netlify deploys successfully, double-click after-netlify.cmd and paste the public URL. It verifies the public API, updates the WeChat template, runs the WeChat template checks and smoke test, and records .launch-state.json.",
    doc: "docs/netlify-deploy-manual.md"
  });
} else if (!checkHttpsUrl(publicUrl)) {
  externalActions.push({
    id: "public-url-https",
    action: "PUBLIC_API_BASE_URL or SITE_URL must start with https://.",
    doc: "docs/netlify-deploy-manual.md"
  });
}

if (publicUrl && checkHttpsUrl(publicUrl) && !publicApiVerified) {
  externalActions.push({
    id: "public-api-verification-state",
    action: "Run after-netlify.cmd with the Netlify public URL so it verifies the public API, checks the WeChat template, and records .launch-state.json.",
    doc: "docs/netlify-deploy-manual.md"
  });
}

if (!hasPackageLock) {
  externalActions.push({
    id: "package-lock",
    action: "When local network access works, double-click generate-package-lock.cmd to create package-lock.json only, or install-local-deps.cmd for a full local install. If local npm still times out, let Netlify install dependencies in the cloud.",
    doc: "docs/dependency-install-fallback.md"
  });
}

if (!hasNodeModules) {
  externalActions.push({
    id: "local-build-dependencies",
    action: "When local network access works, double-click install-local-deps.cmd to install dependencies, verify, and build. Without node_modules, local Next.js builds will fail with a missing next command.",
    doc: "docs/dependency-install-fallback.md"
  });
}

externalActions.push({
  id: "netlify-env",
  action: "In Netlify, set QWEN_API_KEY and the other environment variables from docs/netlify-env-copy-paste.md. Do not commit real secrets to GitHub.",
  doc: "docs/netlify-env-copy-paste.md"
});

if (!wechatDomainVerified) {
  externalActions.push({
    id: "wechat-domain",
    action: "Add the backend root domain to WeChat request legal domain, test with a real phone preview, then double-click mark-wechat-verified.cmd to record the evidence. If the Netlify default domain cannot be saved in WeChat, use an accepted HTTPS custom/proxy/backend domain.",
    doc: "docs/wechat-mini-program-launch-manual.md"
  });
}

externalActions.push({
  id: "wechat-api-base-url",
  action: "If the public API has already been verified, double-click set-wechat-api-url.cmd to update only the WeChat mini program template API_BASE_URL.",
  doc: "docs/wechat-mini-program-launch-manual.md"
});

console.log(
  JSON.stringify(
    {
      ok: true,
      launchControl: "launch-control.cmd",
      startHere: "docs/start-here-after-sleep.md",
      userActionChecklist: "docs/user-action-items-after-sleep.md",
      gitRemoteConfigured: Boolean(gitRemote),
      gitRemote: gitRemote || null,
      packageLockPresent: hasPackageLock,
      nodeModulesPresent: hasNodeModules,
      publicUrl: publicUrl || null,
      publicApiVerified,
      publicApiVerifiedAt: publicApiVerified ? launchState.verifiedAt || null : null,
      wechatDomainVerified,
      wechatDomainVerifiedAt: wechatDomainVerified ? launchState.wechatDomainVerifiedAt || null : null,
      wechatApiBaseUrl: wechatDomainVerified ? launchState.wechatApiBaseUrl || null : null,
      externalActions
    },
    null,
    2
  )
);
