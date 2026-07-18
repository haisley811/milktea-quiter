import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { estimateWithQwen, getQwenRuntimeStatus } from "../lib/qwenEstimateRuntime.mjs";

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

const env = { ...process.env, ...loadEnvFile(join(process.cwd(), ".env.local")) };
const status = getQwenRuntimeStatus(env);

assert.equal(status.enabled, true, "MILKTEA_AI_ENABLED should be true");
assert.equal(status.ready, true, `QWEN runtime is not ready: missing ${status.missing.join(", ")}`);

const result = await estimateWithQwen(
  {
    form: {
      mode: "consumed",
      drinkType: "奶茶",
      drinkName: "直连测试珍珠奶茶",
      size: "中杯",
      ice: "少冰",
      sugar: "半糖",
      toppings: ["波霸"],
      customTopping: ""
    },
    localEstimate: {
      price: 20,
      calories: 360,
      sugarGram: 32,
      source: "默认估算",
      confidence: "中",
      explanation: "直连 QWEN 检查兜底"
    }
  },
  { env }
);

if (!result.ok) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        status: result.status,
        reason: result.reason,
        message: result.message,
        providerBody: result.providerBody
      },
      null,
      2
    )
  );
  process.exit(1);
}

assert.equal(result.estimate.source, "AI智能估算");
assert.equal(typeof result.estimate.price, "number");
assert.equal(typeof result.estimate.calories, "number");
assert.equal(typeof result.estimate.sugarGram, "number");

console.log(
  JSON.stringify(
    {
      ok: true,
      baseUrl: status.baseUrl,
      model: status.model,
      estimate: {
        price: result.estimate.price,
        calories: result.estimate.calories,
        sugarGram: result.estimate.sugarGram,
        confidence: result.estimate.confidence
      }
    },
    null,
    2
  )
);
