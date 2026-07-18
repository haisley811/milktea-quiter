import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getQwenRuntimeStatus } from "../lib/qwenEstimateRuntime.mjs";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};

  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}

const envPath = join(process.cwd(), ".env.local");
const env = { ...process.env, ...loadEnvFile(envPath) };
const status = getQwenRuntimeStatus(env);
const hasEnvFile = existsSync(envPath);

const result = {
  ok: hasEnvFile && status.enabled && status.ready,
  envFile: hasEnvFile ? ".env.local" : "missing",
  enabled: status.enabled,
  ready: status.ready,
  baseUrl: status.baseUrl,
  model: status.model,
  missing: status.missing,
  apiKeyConfigured: status.missing.includes("QWEN_API_KEY") ? false : Boolean(env.QWEN_API_KEY)
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exitCode = 1;
}
