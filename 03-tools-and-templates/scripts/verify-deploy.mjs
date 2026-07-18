import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function file(path) {
  const fullPath = join(root, path);
  assert.equal(existsSync(fullPath), true, `${path} should exist`);
  return readFileSync(fullPath, "utf8");
}

const packageJson = JSON.parse(file("package.json"));
assert.equal(packageJson.engines?.node, "22.x");
assert.equal(packageJson.scripts.build, "next build");
assert.match(packageJson.scripts.verify, /verify:deploy/);
assert.equal(packageJson.scripts["check:github-ready"], "node scripts/check-github-ready.mjs");
assert.equal(packageJson.scripts["check:qwen-env"], "node scripts/check-qwen-env.mjs");
assert.equal(packageJson.scripts["verify:deploy"], "node scripts/verify-deploy.mjs");
assert.equal(packageJson.scripts["verify:public-api"], "node scripts/verify-public-api.mjs");
assert.equal(packageJson.scripts["verify:qwen-direct"], "node scripts/verify-qwen-direct.mjs");
assert.equal(packageJson.scripts["verify:launch-url"], "node scripts/verify-public-api.mjs");
assert.equal(file(".nvmrc").trim(), "22");

const npmrc = file(".npmrc");
assert.match(npmrc, /^fetch-timeout=600000$/m);
assert.match(npmrc, /^fetch-retries=5$/m);
assert.match(npmrc, /^fetch-retry-mintimeout=20000$/m);
assert.match(npmrc, /^fetch-retry-maxtimeout=120000$/m);
assert.match(npmrc, /^audit=false$/m);
assert.match(npmrc, /^fund=false$/m);

const gitignore = file(".gitignore");
assert.match(gitignore, /^\.env\*/m);
assert.match(gitignore, /^!\.env\.example/m);
assert.match(gitignore, /^\.netlify\//m);
assert.match(gitignore, /^\.launch-state\.json/m);

const gitattributes = file(".gitattributes");
assert.match(gitattributes, /^\* text=auto/m);
assert.match(gitattributes, /^\*\.png binary/m);
assert.match(gitattributes, /^\*\.md text eol=lf/m);
assert.match(gitattributes, /^\.npmrc text eol=lf/m);

const netlify = file("netlify.toml");
assert.match(netlify, /command = "npm run verify && npm run build"/);
assert.match(netlify, /publish = "\.next"/);
assert.match(netlify, /NODE_VERSION = "22"/);
assert.match(netlify, /for = "\/api\/\*"/);
assert.match(netlify, /Cache-Control = "no-store"/);

const envExample = file(".env.example");
[
  "MILKTEA_AI_ENABLED=false",
  "QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2",
  "QWEN_MODEL=xopqwen36v35b",
  "QWEN_API_KEY=replace-with-your-qwen-openai-api-key",
  "QWEN_API_TIMEOUT_MS=12000",
  "MILKTEA_ALLOWED_ORIGINS=*"
].forEach((line) => assert.match(envExample, new RegExp(line.replaceAll("/", "\\/"))));

const apiRoute = file("app/api/estimate-drink/route.ts");
assert.match(apiRoute, /dynamic = "force-dynamic"/);
assert.match(apiRoute, /runtime = "nodejs"/);
assert.match(apiRoute, /export async function OPTIONS/);
assert.match(apiRoute, /MAX_BODY_BYTES/);
assert.match(apiRoute, /payload-too-large/);
assert.match(apiRoute, /TextEncoder/);
assert.match(apiRoute, /Access-Control-Allow-Origin/);
assert.match(apiRoute, /Access-Control-Allow-Methods/);
assert.match(apiRoute, /GET, POST, OPTIONS/);
assert.match(apiRoute, /MILKTEA_ALLOWED_ORIGINS/);
assert.match(apiRoute, /Cache-Control/);
assert.doesNotMatch(apiRoute, /QWEN_API_KEY/);

const qwenRuntime = file("lib/qwenEstimateRuntime.mjs");
assert.match(qwenRuntime, /function cleanText\(value, maxLength = 80\)/);
assert.match(qwenRuntime, /function cleanList/);
assert.match(qwenRuntime, /slice\(0, maxItems\)/);

const workflow = file(".github/workflows/verify.yml");
assert.match(workflow, /node-version: 22/);
assert.match(workflow, /npm install/);
assert.match(workflow, /npm run verify/);
assert.match(workflow, /npm run build/);

const runbook = file("docs/deployment-runbook.md");
assert.match(runbook, /GitHub/);
assert.match(runbook, /Netlify/);
assert.match(runbook, /微信小程序/);
assert.match(runbook, /ill-quit-milktea/);
assert.match(runbook, /QWEN_API_KEY/);
assert.match(runbook, /\/api\/estimate-drink/);
assert.match(runbook, /合法域名/);
assert.match(runbook, /verify:public-api/);
assert.match(runbook, /forbiddenTrackedFiles/);
assert.match(runbook, /after-netlify\.cmd/);

const publicApiVerifier = file("scripts/verify-public-api.mjs");
assert.match(publicApiVerifier, /PUBLIC_API_BASE_URL/);
assert.match(publicApiVerifier, /OPTIONS/);
assert.match(publicApiVerifier, /ready/);
assert.match(publicApiVerifier, /AI智能估算/);
assert.match(publicApiVerifier, /apiKey/);

const afterNetlifyCmd = file("after-netlify.cmd");
assert.match(afterNetlifyCmd, /verify:public-api/);
assert.match(afterNetlifyCmd, /wechat:set-api-url/);
assert.match(afterNetlifyCmd, /verify:wechat-template/);
assert.match(afterNetlifyCmd, /smoke:wechat-template/);
assert.match(afterNetlifyCmd, /launch:mark-public-api/);
assert.match(afterNetlifyCmd, /Public API verification failed/);

const verifyPublicApiCmd = file("verify-public-api.cmd");
assert.match(verifyPublicApiCmd, /verify:public-api/);
assert.match(verifyPublicApiCmd, /launch:mark-public-api/);
assert.match(verifyPublicApiCmd, /\.launch-state\.json/);

const qwenEnvChecker = file("scripts/check-qwen-env.mjs");
assert.match(qwenEnvChecker, /getQwenRuntimeStatus/);
assert.match(qwenEnvChecker, /\.env\.local/);
assert.match(qwenEnvChecker, /apiKeyConfigured/);
assert.doesNotMatch(qwenEnvChecker, /console\.log\(env\.QWEN_API_KEY/);

const qwenDirectVerifier = file("scripts/verify-qwen-direct.mjs");
assert.match(qwenDirectVerifier, /estimateWithQwen/);
assert.match(qwenDirectVerifier, /getQwenRuntimeStatus/);
assert.match(qwenDirectVerifier, /直连测试珍珠奶茶/);
assert.match(qwenDirectVerifier, /AI智能估算/);
assert.doesNotMatch(qwenDirectVerifier, /console\.log\(env\.QWEN_API_KEY/);

const githubReadyChecker = file("scripts/check-github-ready.mjs");
assert.match(githubReadyChecker, /\.gitignore/);
assert.match(githubReadyChecker, /\.gitattributes/);
assert.match(githubReadyChecker, /secretHits/);
assert.match(githubReadyChecker, /gitTrackedFiles/);
assert.match(githubReadyChecker, /forbiddenTrackedFiles/);
assert.match(githubReadyChecker, /Ignored local\/generated files must not be tracked by Git/);
assert.match(githubReadyChecker, /Usage: npm run check:github-ready/);

console.log("Deployment readiness verified.");
