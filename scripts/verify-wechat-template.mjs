import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const templateRoot = "templates/wechat-miniprogram";

function file(path) {
  const fullPath = join(root, path);
  assert.equal(existsSync(fullPath), true, `${path} should exist`);
  return readFileSync(fullPath, "utf8");
}

const readme = file(`${templateRoot}/README.md`);
const appJson = file(`${templateRoot}/app.json`);
const appJs = file(`${templateRoot}/app.js`);
const appWxss = file(`${templateRoot}/app.wxss`);
const projectConfig = file(`${templateRoot}/project.config.json`);
const sitemap = file(`${templateRoot}/sitemap.json`);
const apiConfig = file(`${templateRoot}/config/api.js`);
const aiService = file(`${templateRoot}/services/aiEstimate.js`);
const drinkRules = file(`${templateRoot}/services/drinkRules.js`);
const recordPage = file(`${templateRoot}/pages/record/record.js`);
const recordWxml = file(`${templateRoot}/pages/record/record.wxml`);
const recordWxss = file(`${templateRoot}/pages/record/record.wxss`);
const recordJson = file(`${templateRoot}/pages/record/record.json`);
const combinedCode = [
  appJson,
  appJs,
  appWxss,
  projectConfig,
  sitemap,
  apiConfig,
  aiService,
  drinkRules,
  recordPage,
  recordWxml,
  recordWxss,
  recordJson
].join("\n");
const apiBaseUrlMatch = apiConfig.match(/API_BASE_URL = "([^"]+)"/);

assert.match(readme, /最小完整小程序/);
assert.match(readme, /request 合法域名/);
assert.match(readme, /API_BASE_URL/);
assert.match(readme, /\/api\/estimate-drink/);
assert.match(readme, /不要在小程序里直接调用 QWEN/);
assert.match(readme, /touristappid/);
assert.match(readme, /上传审核前/);
assert.match(readme, /详情 -> 基本信息/);

const app = JSON.parse(appJson);
const project = JSON.parse(projectConfig);
const page = JSON.parse(recordJson);
const site = JSON.parse(sitemap);
assert.deepEqual(app.pages, ["pages/record/record"]);
assert.equal(app.sitemapLocation, "sitemap.json");
assert.equal(project.compileType, "miniprogram");
assert.equal(project.miniprogramRoot, "./");
assert.match(project.appid, /^(touristappid|wx[a-zA-Z0-9]{8,32})$/);
assert.equal(page.navigationBarTitleText, "记录饮品");
assert.equal(site.rules[0].action, "allow");

assert.ok(apiBaseUrlMatch, "API_BASE_URL should exist");
assert.equal(new URL(apiBaseUrlMatch[1]).protocol, "https:");
assert.match(apiConfig, /AI_ESTIMATE_PATH = "\/api\/estimate-drink"/);
assert.doesNotMatch(apiBaseUrlMatch[1], /\/api\/estimate-drink\/?$/);

assert.match(aiService, /\.\.\/config\/api\.js/);
assert.match(aiService, /\.\/drinkRules\.js/);
assert.match(aiService, /wx\.request/);
assert.match(aiService, /`\$\{API_BASE_URL\}\$\{AI_ESTIMATE_PATH\}`/);
assert.match(aiService, /timeout: AI_TIMEOUT_MS/);
assert.match(aiService, /catch\(\(\) => localEstimate\)/);
assert.match(aiService, /normalizeEstimate/);
assert.match(aiService, /AI智能估算/);

assert.match(drinkRules, /estimateDrinkLocal/);
assert.match(drinkRules, /默认估算/);
assert.match(recordPage, /\.\.\/\.\.\/services\/aiEstimate\.js/);
assert.match(recordPage, /estimateDrinkSmart/);
assert.match(recordPage, /refreshEstimate/);
assert.match(recordPage, /onDrinkNameInput/);
assert.match(recordPage, /toggleTopping/);
assert.match(recordWxml, /bindtap="submitEstimate"/);
assert.match(recordWxml, /bindinput="onDrinkNameInput"/);
assert.match(recordWxml, /wx:for="\{\{drinkTypes\}\}"/);
assert.match(recordWxss, /\.submit/);
assert.match(appJs, /App\(/);

assert.doesNotMatch(combinedCode, /QWEN_API_KEY/);
assert.doesNotMatch(combinedCode, /maas-api\.cn-huabei-1\.xf-yun\.com/);
assert.doesNotMatch(combinedCode, /Bearer\s+[A-Za-z0-9._-]+/);
assert.doesNotMatch(combinedCode, /\/v2\/chat\/completions/);

console.log("WeChat mini program template verified.");
