import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const statePath = join(root, ".launch-state.json");
const dryRun = process.argv.includes("--dry-run");
const input = process.argv.find((arg, index) => index > 1 && arg !== "--dry-run")
  || process.env.PUBLIC_API_BASE_URL
  || process.env.SITE_URL
  || "";

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

function normalizePublicUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) fail("Usage: node scripts/mark-public-api-verified.mjs https://your-site.netlify.app");

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    fail("The public URL is not valid. Paste an https:// Netlify site URL.");
  }

  if (parsed.protocol !== "https:") {
    fail("The public URL must start with https://");
  }

  const apiPath = "/api/estimate-drink";
  if (parsed.pathname.endsWith(apiPath)) {
    return parsed.origin;
  }

  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    fail("Paste the Netlify root URL or the full /api/estimate-drink URL.");
  }

  return parsed.origin;
}

const publicUrl = normalizePublicUrl(input);
const previousState = readLaunchState();
const state = {
  ...previousState,
  publicUrl,
  apiUrl: `${publicUrl}/api/estimate-drink`,
  publicApiVerified: true,
  verifiedAt: new Date().toISOString(),
  source: "after-netlify.cmd"
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
      ...state
    },
    null,
    2
  )
);
