import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const configPath = join(root, "templates/wechat-miniprogram/config/api.js");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rawInput = args.filter((arg) => arg !== "--dry-run").join(" ").trim();

function fail(message) {
  console.error(message);
  console.error("");
  console.error("Usage:");
  console.error("  npm run wechat:set-api-url -- https://your-site.netlify.app");
  process.exit(1);
}

if (!rawInput) {
  fail("Please paste your Netlify public link.");
}

if (!existsSync(configPath)) {
  fail("Missing templates/wechat-miniprogram/config/api.js.");
}

let normalizedUrl;

try {
  const parsed = new URL(rawInput);

  if (parsed.protocol !== "https:") {
    fail("The WeChat mini program request domain must start with https://.");
  }

  const normalizedPath = parsed.pathname.replace(/\/+$/, "") || "/";
  const apiPath = "/api/estimate-drink";
  if (normalizedPath === apiPath) {
    normalizedUrl = parsed.origin;
  } else if (normalizedPath === "/") {
    normalizedUrl = parsed.origin;
  } else {
    fail("Paste the Netlify root URL or the full /api/estimate-drink URL.");
  }

} catch {
  fail("This does not look like a valid public URL.");
}

const before = readFileSync(configPath, "utf8");
const after = before.replace(
  /export const API_BASE_URL = "([^"]+)";/,
  `export const API_BASE_URL = "${normalizedUrl}";`
);

if (before === after) {
  fail("Could not find API_BASE_URL in templates/wechat-miniprogram/config/api.js.");
}

if (!dryRun) {
  writeFileSync(configPath, after);
}

console.log(dryRun ? "WeChat mini program API base URL dry run passed." : "WeChat mini program API base URL updated.");
console.log(`API_BASE_URL=${normalizedUrl}`);
console.log(`Full endpoint=${normalizedUrl}/api/estimate-drink`);
