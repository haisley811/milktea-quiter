import assert from "node:assert/strict";
import { once } from "node:events";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { estimateWithQwen, getQwenRuntimeStatus } from "../lib/qwenEstimateRuntime.mjs";

function loadDotEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(data));
}

loadDotEnvLocal();

const server = createServer(async (req, res) => {
  if ((req.url || "").split("?")[0] !== "/api/estimate-drink") {
    sendJson(res, 404, { error: "not-found" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "cache-control": "no-store"
    });
    res.end();
    return;
  }

  if (req.method === "GET") {
    sendJson(res, 200, getQwenRuntimeStatus());
    return;
  }

  try {
    const result = await estimateWithQwen(await readJsonBody(req));
    if (!result.ok) {
      sendJson(res, result.status, {
        error: result.reason,
        message: result.message
      });
      return;
    }

    sendJson(res, 200, result.estimate);
  } catch {
    sendJson(res, 400, { error: "invalid-json" });
  }
});

server.listen(4173, "127.0.0.1");
await once(server, "listening");
const address = server.address();
const port = typeof address === "object" && address ? address.port : 4173;
const endpoint = `http://127.0.0.1:${port}/api/estimate-drink`;

try {
  const optionsResponse = await fetch(endpoint, {
    method: "OPTIONS",
    headers: { origin: "https://example.com", "access-control-request-method": "POST" }
  });
  assert.equal(optionsResponse.status, 204);
  assert.equal(optionsResponse.headers.get("access-control-allow-methods"), "GET, POST, OPTIONS");

  const status = await fetch(endpoint).then((response) => response.json());
  assert.deepEqual(status, {
    enabled: true,
    ready: true,
    baseUrl: "https://maas-api.cn-huabei-1.xf-yun.com/v2",
    model: "xopqwen36v35b",
    missing: []
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      form: {
        mode: "consumed",
        drinkType: "奶茶",
        drinkName: "测试珍珠奶茶",
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
        explanation: "本地测试兜底"
      }
    })
  });

  assert.equal(response.status, 200);
  const estimate = await response.json();
  assert.equal(estimate.source, "AI智能估算");
  assert.equal(typeof estimate.price, "number");
  assert.equal(typeof estimate.calories, "number");
  assert.equal(typeof estimate.sugarGram, "number");

  console.log(JSON.stringify({ ok: true, estimate }));
} catch (error) {
  console.error(`Live API check failed at ${endpoint}`);
  console.error(error?.message || error);
  process.exitCode = 1;
} finally {
  await new Promise((resolve) => server.close(resolve));
}
