import assert from "node:assert/strict";

const input = process.argv[2] || process.env.PUBLIC_API_BASE_URL || process.env.SITE_URL || "";

if (!input) {
  console.error("Usage: npm run verify:public-api -- https://your-site.netlify.app");
  process.exit(1);
}

function normalizeEndpoint(value) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:", "Public API URL must use HTTPS");
  const normalizedPath = url.pathname.replace(/\/+$/, "") || "/";
  const apiPath = "/api/estimate-drink";

  if (normalizedPath === apiPath) {
    url.pathname = apiPath;
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  assert.ok(
    normalizedPath === "/",
    "Paste the Netlify root URL or the full /api/estimate-drink URL."
  );

  url.pathname = apiPath;
  url.search = "";
  url.hash = "";
  return url.toString();
}

async function readJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Expected JSON response, received: ${text.slice(0, 200)}`);
  }
}

async function main() {
  const endpoint = normalizeEndpoint(input);

  const optionsResponse = await fetch(endpoint, {
    method: "OPTIONS",
    headers: {
      origin: "https://example.com",
      "access-control-request-method": "POST",
      "access-control-request-headers": "content-type"
    }
  });
  assert.equal(optionsResponse.status, 204, "OPTIONS preflight should return 204");
  assert.match(optionsResponse.headers.get("access-control-allow-methods") || "", /POST/);
  assert.match(optionsResponse.headers.get("access-control-allow-headers") || "", /content-type/i);

  const statusResponse = await fetch(endpoint, { method: "GET" });
  assert.equal(statusResponse.status, 200, "GET status endpoint should return 200");
  const status = await readJsonResponse(statusResponse);
  if (status.enabled !== true || status.ready !== true || !Array.isArray(status.missing) || status.missing.length > 0) {
    throw new Error(
      [
        "GET /api/estimate-drink is reachable, but QWEN runtime is not ready.",
        `Status payload: ${JSON.stringify(status)}`,
        "Check Netlify environment variables, especially MILKTEA_AI_ENABLED=true and QWEN_API_KEY, then trigger a new deploy."
      ].join("\n")
    );
  }
  assert.equal(typeof status.model, "string");
  assert.equal(Object.prototype.hasOwnProperty.call(status, "apiKey"), false, "Status must not expose API keys");

  const estimateResponse = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      form: {
        mode: "consumed",
        drinkType: "奶茶",
        drinkName: "公开部署测试珍珠奶茶",
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
        explanation: "公共 API 验证兜底"
      }
    })
  });

  assert.equal(estimateResponse.status, 200, "POST estimate endpoint should return 200");
  const estimate = await readJsonResponse(estimateResponse);
  if (estimate.source !== "AI智能估算") {
    throw new Error(
      [
        "POST /api/estimate-drink returned a fallback or unexpected estimate instead of AI智能估算.",
        `Estimate payload: ${JSON.stringify(estimate)}`,
        "Check Netlify function logs, QWEN API key validity, model access, quota, and timeout settings."
      ].join("\n")
    );
  }
  assert.equal(typeof estimate.price, "number");
  assert.equal(typeof estimate.calories, "number");
  assert.equal(typeof estimate.sugarGram, "number");
  assert.ok(estimate.price > 0);
  assert.ok(estimate.calories >= 0);
  assert.ok(estimate.sugarGram >= 0);
  assert.equal(Object.prototype.hasOwnProperty.call(estimate, "apiKey"), false, "Estimate must not expose API keys");

  console.log(
    JSON.stringify(
      {
        ok: true,
        endpoint,
        model: status.model,
        estimate: {
          price: estimate.price,
          calories: estimate.calories,
          sugarGram: estimate.sugarGram,
          confidence: estimate.confidence
        }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error("");
  console.error("Public API verification failed.");
  console.error(error instanceof Error ? error.message : String(error));
  console.error("");
  console.error("What to check:");
  console.error("1. Paste the Netlify root URL, for example https://your-site.netlify.app.");
  console.error("2. Open /api/estimate-drink in the browser and confirm ready: true, enabled: true, missing: [].");
  console.error("3. In Netlify, confirm QWEN_API_KEY and the other variables from docs/netlify-env-copy-paste.md.");
  console.error("4. After changing Netlify variables, trigger a new deploy before running this check again.");
  process.exit(1);
});
