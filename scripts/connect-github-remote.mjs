import { execFileSync, spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rawInput = args.filter((arg) => arg !== "--dry-run").join(" ").trim();

function fail(message) {
  console.error(message);
  console.error("");
  console.error("Usage:");
  console.error("  npm run github:connect -- https://github.com/yourname/ill-quit-milktea.git");
  process.exit(1);
}

function normalizeGithubUrl(value) {
  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    fail("This does not look like a valid GitHub HTTPS repository URL.");
  }

  if (parsed.protocol !== "https:" || parsed.hostname.toLowerCase() !== "github.com") {
    fail("Please use the GitHub HTTPS URL, for example https://github.com/yourname/ill-quit-milktea.git.");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) {
    fail("Please paste the repository root URL, not a branch, file, settings, or Pull Request URL.");
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!owner || !repo || owner.includes(" ") || repo.includes(" ")) {
    fail("The GitHub repository URL contains an invalid owner or repository name.");
  }

  return `https://github.com/${owner}/${repo}.git`;
}

function runGit(argsForGit, options = {}) {
  if (dryRun) {
    console.log(`DRY RUN: git ${argsForGit.join(" ")}`);
    return "";
  }

  const result = spawnSync("git", argsForGit, {
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"]
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    if (argsForGit[0] === "push") {
      fail(`${output || "git push failed."}\n\nIf GitHub asks you to sign in, choose browser sign-in and authorize Git Credential Manager. If it asks for a password, do not type your GitHub password; use the browser authorization flow instead.`);
    }
    fail(output || `git ${argsForGit.join(" ")} failed.`);
  }

  return result.stdout?.trim() || "";
}

function readGit(argsForGit) {
  try {
    return execFileSync("git", argsForGit, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
}

if (!rawInput) {
  fail("Please paste your GitHub repository HTTPS URL.");
}

const repoUrl = normalizeGithubUrl(rawInput);
const status = readGit(["status", "--short"]);

if (status && !dryRun) {
  fail("There are uncommitted local changes. Run npm run check:goal-status, or ask Codex to commit the latest work before pushing.");
}

const existingOrigin = readGit(["remote", "get-url", "origin"]);

if (existingOrigin) {
  console.log(`Updating origin from ${existingOrigin} to ${repoUrl}`);
  runGit(["remote", "set-url", "origin", repoUrl]);
} else {
  console.log(`Adding origin ${repoUrl}`);
  runGit(["remote", "add", "origin", repoUrl]);
}

console.log("Pushing main to GitHub...");
runGit(["push", "-u", "origin", "main"], { inherit: true });

console.log("");
console.log(dryRun ? "GitHub connection dry run passed." : "GitHub remote is configured and main has been pushed.");
console.log(`origin=${repoUrl}`);
