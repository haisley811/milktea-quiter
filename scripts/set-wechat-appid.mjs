import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const configPath = join(root, "templates/wechat-miniprogram/project.config.json");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rawInput = args.filter((arg) => arg !== "--dry-run").join(" ").trim();

function fail(message) {
  console.error(message);
  console.error("");
  console.error("Usage:");
  console.error("  npm run wechat:set-appid -- wx1234567890abcdef");
  process.exit(1);
}

if (!rawInput) {
  fail("Please paste your WeChat mini program AppID.");
}

if (!existsSync(configPath)) {
  fail("Missing templates/wechat-miniprogram/project.config.json.");
}

const appid = rawInput.trim();
if (appid !== "touristappid" && !/^wx[a-zA-Z0-9]{8,32}$/.test(appid)) {
  fail("The AppID should look like wx1234567890abcdef. Use touristappid only for temporary preview.");
}

let projectConfig;
try {
  projectConfig = JSON.parse(readFileSync(configPath, "utf8"));
} catch {
  fail("templates/wechat-miniprogram/project.config.json is not valid JSON.");
}

projectConfig.appid = appid;

if (!dryRun) {
  writeFileSync(configPath, `${JSON.stringify(projectConfig, null, 2)}\n`, "utf8");
}

console.log(dryRun ? "WeChat AppID dry run passed." : "WeChat AppID updated.");
console.log(`appid=${appid}`);
console.log(appid === "touristappid"
  ? "This is still a temporary preview AppID. Use your real AppID before upload review."
  : "This looks like a real WeChat mini program AppID.");
