import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", ".next", ".netlify", ".npm-cache", "node_modules", "out", "dist"]);
const scannedExts = new Set([".cmd", ".css", ".html", ".js", ".json", ".md", ".mjs", ".ps1", ".toml", ".ts", ".tsx", ".wxml", ".wxss", ".yml"]);
const selfCheckFiles = new Set(["scripts/check-github-ready.mjs", "scripts/verify-project.mjs"]);

if (process.argv.includes("--help")) {
  console.log("Usage: npm run check:github-ready");
  process.exit(0);
}

function file(path) {
  const fullPath = join(root, path);
  assert.equal(existsSync(fullPath), true, `${path} should exist`);
  return readFileSync(fullPath, "utf8");
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const rel = relative(root, fullPath).replaceAll("\\", "/");
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoredDirs.has(name)) walk(fullPath, files);
      continue;
    }

    if (scannedExts.has(extname(name))) files.push(rel);
  }
  return files;
}

function gitTrackedFiles() {
  try {
    return execFileSync("git", ["ls-files"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const gitignore = file(".gitignore");
[
  ".env*",
  "!.env.example",
  "node_modules/",
  ".next/",
  ".netlify/",
  ".npm-cache/",
  "shots/",
  ".preview-*",
  ".launch-state.json",
  "*.err",
  "*.log"
].forEach((rule) => assert.match(gitignore, new RegExp(`^${rule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m")));

const gitattributes = file(".gitattributes");
[
  "* text=auto",
  "*.md text eol=lf",
  "*.ts text eol=lf",
  "*.tsx text eol=lf",
  "*.mjs text eol=lf",
  ".npmrc text eol=lf",
  "*.png binary"
].forEach((rule) => assert.match(gitattributes, new RegExp(`^${rule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m")));

[
  "README.md",
  "package.json",
  ".npmrc",
  "netlify.toml",
  ".env.example",
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
  "set-wechat-appid.cmd",
  "verify-public-api.cmd",
  "docs/dependency-install-fallback.md",
  "docs/github-upload-manual.md",
  "docs/netlify-deploy-manual.md",
  "docs/deployment-runbook.md",
  "docs/deployment-troubleshooting.md",
  "docs/start-here-after-sleep.md",
  "docs/user-action-items-after-sleep.md",
  "docs/api-integration-status.md",
  "docs/netlify-env-copy-paste.md",
  "docs/wechat-mini-program-launch-manual.md",
  "docs/wechat-verification-recording.md",
  "docs/zero-code-launch-manual.md",
  "docs/project-introduction.md"
].forEach((path) => assert.equal(existsSync(join(root, path)), true, `${path} should exist`));

const trackedFiles = gitTrackedFiles();
const forbiddenTrackedFiles = trackedFiles.filter((path) => {
  const normalized = path.replaceAll("\\", "/");
  return (
    normalized === ".env.local"
    || normalized.startsWith(".env.local.")
    || normalized.startsWith(".netlify/")
    || normalized.startsWith(".next/")
    || normalized.startsWith(".npm-cache/")
    || normalized.startsWith("node_modules/")
    || normalized.startsWith("shots/")
    || normalized === ".launch-state.json"
    || normalized.startsWith(".preview-")
    || normalized.endsWith(".log")
    || normalized.endsWith(".err")
  );
});
assert.deepEqual(forbiddenTrackedFiles, [], "Ignored local/generated files must not be tracked by Git");

const secretHits = [];
for (const path of walk(root)) {
  if (path === ".env.example") continue;
  if (selfCheckFiles.has(path)) continue;
  const text = readFileSync(join(root, path), "utf8");

  if (/QWEN_API_KEY\s*=\s*(?!你的|这里填|replace-with|$)[^\s]+/.test(text)) {
    secretHits.push(`${path}: concrete QWEN_API_KEY assignment`);
  }
  if (/Bearer\s+[A-Za-z0-9._-]{12,}/.test(text)) {
    secretHits.push(`${path}: bearer token-like string`);
  }
  if (/5905235/.test(text)) {
    secretHits.push(`${path}: known sensitive marker`);
  }
}

assert.deepEqual(secretHits, []);

console.log(
  JSON.stringify(
    {
      ok: true,
      checkedFiles: walk(root).length,
      trackedFiles: trackedFiles.length,
      ignored: [".env*", "node_modules/", ".next/", ".netlify/", "shots/", ".preview-*", ".launch-state.json"],
      forbiddenTrackedFiles,
      requiredDocs: [
        "docs/dependency-install-fallback.md",
        "docs/github-upload-manual.md",
        "docs/netlify-deploy-manual.md",
        "docs/deployment-runbook.md",
        "docs/deployment-troubleshooting.md",
        "docs/start-here-after-sleep.md",
        "docs/user-action-items-after-sleep.md",
        "docs/api-integration-status.md",
        "docs/netlify-env-copy-paste.md",
        "docs/wechat-mini-program-launch-manual.md",
        "docs/wechat-verification-recording.md",
        "docs/zero-code-launch-manual.md",
        "docs/project-introduction.md"
      ]
    },
    null,
    2
  )
);
