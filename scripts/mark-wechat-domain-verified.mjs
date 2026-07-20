import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const statePath = join(root, ".launch-state.json");
const dryRun = process.argv.includes("--dry-run");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readLaunchState() {
  if (!existsSync(statePath)) return {};

  try {
    const state = JSON.parse(readFileSync(statePath, "utf8"));
    if (!state || typeof state !== "object" || Array.isArray(state)) return {};
    return state;
  } catch {
    return {};
  }
}

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function positionalUrl() {
  return process.argv.find((arg, index) => {
    if (index <= 1) return false;
    if (arg === "--dry-run" || arg === "--note") return false;
    if (process.argv[index - 1] === "--note") return false;
    return !arg.startsWith("--");
  }) || "";
}

function normalizeBackendUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    fail("Usage: node scripts/mark-wechat-domain-verified.mjs https://your-site.netlify.app --note \"real phone preview passed\"");
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    fail("The WeChat backend URL is not valid. Paste an https:// root URL or full /api/estimate-drink URL.");
  }

  if (parsed.protocol !== "https:") {
    fail("The WeChat backend URL must start with https://");
  }

  const apiPath = "/api/estimate-drink";
  if (parsed.pathname.endsWith(apiPath)) {
    return parsed.origin;
  }

  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    fail("Paste the backend root URL or the full /api/estimate-drink URL. Do not paste an unrelated path.");
  }

  return parsed.origin;
}

const input = positionalUrl()
  || process.env.WECHAT_API_BASE_URL
  || process.env.PUBLIC_API_BASE_URL
  || process.env.SITE_URL
  || "";
const note = argValue("--note").trim();
const wechatApiBaseUrl = normalizeBackendUrl(input);
const previousState = readLaunchState();
const usesSeparateBackendDomain = Boolean(
  previousState.publicUrl
    && previousState.publicUrl !== wechatApiBaseUrl
);
const state = {
  ...previousState,
  wechatDomainVerified: true,
  wechatDomainVerifiedAt: new Date().toISOString(),
  wechatApiBaseUrl,
  wechatApiUrl: `${wechatApiBaseUrl}/api/estimate-drink`,
  wechatUsesSeparateBackendDomain: usesSeparateBackendDomain,
  wechatVerificationNote: note,
  source: previousState.source
    ? `${previousState.source}+mark-wechat-verified.cmd`
    : "mark-wechat-verified.cmd"
};

if (!dryRun) {
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

console.log(
  JSON.stringify(
    {
      ok: true,
      dryRun,
      stateFile: ".launch-state.json",
      wechatDomainVerified: state.wechatDomainVerified,
      wechatDomainVerifiedAt: state.wechatDomainVerifiedAt,
      wechatApiBaseUrl: state.wechatApiBaseUrl,
      wechatApiUrl: state.wechatApiUrl,
      wechatUsesSeparateBackendDomain: state.wechatUsesSeparateBackendDomain,
      wechatVerificationNote: state.wechatVerificationNote
    },
    null,
    2
  )
);
