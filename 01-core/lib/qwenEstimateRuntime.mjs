const DEFAULT_BASE_URL = "https://maas-api.cn-huabei-1.xf-yun.com/v2";
const DEFAULT_MODEL = "xopqwen36v35b";

export function resolveQwenConfig(env = process.env) {
  const enabled = env.MILKTEA_AI_ENABLED === "true";
  const baseUrl = (env.QWEN_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = env.QWEN_MODEL || DEFAULT_MODEL;
  const apiKey = env.QWEN_API_KEY || "";
  const timeoutMs = Number(env.QWEN_API_TIMEOUT_MS || 12_000);
  const missing = [];

  if (!apiKey) {
    missing.push("QWEN_API_KEY");
  }

  return {
    enabled,
    baseUrl,
    model,
    apiKey,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 12_000,
    missing
  };
}

export function getQwenRuntimeStatus(env = process.env) {
  const config = resolveQwenConfig(env);

  return {
    enabled: config.enabled,
    ready: config.enabled && config.missing.length === 0,
    baseUrl: config.baseUrl,
    model: config.model,
    missing: config.missing
  };
}

function cleanText(value, maxLength = 80) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function cleanList(value, maxItems = 6, maxItemLength = 30) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => cleanText(item, maxItemLength)).filter(Boolean);
}

function buildEstimateMessages(request) {
  const form = request?.form ?? {};
  const local = request?.localEstimate ?? {};

  return [
    {
      role: "system",
      content:
        "你是奶茶饮品营养和价格估算助手。你只返回严格 JSON，不要 Markdown，不要解释 JSON 以外的文字。字段必须是 price, calories, sugarGram, confidence, explanation。price 单位人民币元，保留 1 位小数；calories 单位 kcal，整数；sugarGram 单位 g，整数；confidence 只能是 高、中、低。估算要保守、合理，数据仅供参考。"
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          task: "估算这杯饮品的价格、热量和糖分",
          drink: {
            name: cleanText(form.drinkName) || "未命名饮品",
            type: form.drinkType,
            size: form.size,
            ice: form.ice,
            sugar: form.sugar,
            toppings: cleanList(form.toppings),
            customTopping: cleanText(form.customTopping, 80)
          },
          localFallback: {
            price: local.price,
            calories: local.calories,
            sugarGram: local.sugarGram,
            source: local.source,
            confidence: local.confidence
          },
          outputExample: {
            price: 18.5,
            calories: 320,
            sugarGram: 28,
            confidence: "中",
            explanation: "按同类饮品、杯型、糖量和小料估算，实际以门店配方为准。"
          }
        },
        null,
        2
      )
    }
  ];
}

function extractJsonObject(text) {
  const raw = String(text ?? "").trim();
  if (!raw) {
    throw new Error("QWEN response is empty");
  }

  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced?.[1] ?? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    return JSON.parse(candidate);
  }
}

function normalizeConfidence(value) {
  return value === "高" || value === "中" || value === "低" ? value : "中";
}

function normalizeEstimate(data, fallback) {
  const price = Number(data?.price);
  const calories = Number(data?.calories);
  const sugarGram = Number(data?.sugarGram);

  return {
    price: Number.isFinite(price) && price > 0 ? Math.round(price * 10) / 10 : fallback.price,
    calories: Number.isFinite(calories) && calories >= 0 ? Math.round(calories) : fallback.calories,
    sugarGram: Number.isFinite(sugarGram) && sugarGram >= 0 ? Math.round(sugarGram) : fallback.sugarGram,
    source: "AI智能估算",
    confidence: normalizeConfidence(data?.confidence),
    explanation:
      cleanText(data?.explanation) ||
      "QWEN 根据饮品名、杯型、糖量和小料估算，数据为估算值，仅供参考。"
  };
}

export async function estimateWithQwen(request, options = {}) {
  const config = resolveQwenConfig(options.env);
  const fallback = request?.localEstimate ?? { price: 0, calories: 0, sugarGram: 0 };

  if (!config.enabled) {
    return {
      ok: false,
      status: 503,
      reason: "disabled",
      message: "AI 估算已在后端关闭。",
      fallback
    };
  }

  if (config.missing.length > 0) {
    return {
      ok: false,
      status: 500,
      reason: "missing-config",
      message: `后端缺少配置：${config.missing.join(", ")}`,
      fallback
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const fetcher = options.fetch ?? fetch;
    const response = await fetcher(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: buildEstimateMessages(request),
        temperature: 0.2,
        max_tokens: 280
      }),
      signal: controller.signal
    });

    const bodyText = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        reason: "provider-error",
        message: `QWEN API 返回 ${response.status}`,
        providerBody: bodyText.slice(0, 500),
        fallback
      };
    }

    const body = JSON.parse(bodyText);
    const content = body?.choices?.[0]?.message?.content;
    return {
      ok: true,
      estimate: normalizeEstimate(extractJsonObject(content), fallback)
    };
  } catch (error) {
    return {
      ok: false,
      status: 504,
      reason: "request-failed",
      message: error?.name === "AbortError" ? "QWEN API 请求超时。" : "QWEN API 请求失败。",
      fallback
    };
  } finally {
    clearTimeout(timer);
  }
}
