import { estimateDrink } from "./drinkRules.ts";
import type { DrinkEstimate, DrinkForm } from "./types.ts";

export type AIEstimateRequest = {
  form: DrinkForm;
  localEstimate: DrinkEstimate;
};

export type AIEstimateProvider = {
  estimate(request: AIEstimateRequest): Promise<DrinkEstimate>;
};

export function createRemoteAIEstimateProvider(endpoint = "/api/estimate-drink"): AIEstimateProvider {
  return {
    async estimate(request) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`AI estimate request failed: ${response.status}`);
      }

      const data = (await response.json()) as DrinkEstimate;
      return normalizeAIEstimate(data, request.localEstimate);
    }
  };
}

export async function estimateDrinkSmart(form: DrinkForm, provider?: AIEstimateProvider): Promise<DrinkEstimate> {
  const localEstimate = estimateDrink(form);

  if (!provider) {
    return localEstimate;
  }

  try {
    return normalizeAIEstimate(await provider.estimate({ form, localEstimate }), localEstimate);
  } catch {
    return {
      ...localEstimate,
      explanation: localEstimate.explanation ?? "已使用本地规则估算。"
    };
  }
}

function normalizeAIEstimate(data: DrinkEstimate, fallback: DrinkEstimate): DrinkEstimate {
  const price = Number.isFinite(data.price) && data.price > 0 ? Math.round(data.price * 10) / 10 : fallback.price;
  const calories = Number.isFinite(data.calories) && data.calories >= 0 ? Math.round(data.calories) : fallback.calories;
  const sugarGram = Number.isFinite(data.sugarGram) && data.sugarGram >= 0 ? Math.round(data.sugarGram) : fallback.sugarGram;

  return {
    price,
    calories,
    sugarGram,
    source: "AI智能估算",
    confidence: data.confidence === "高" || data.confidence === "中" || data.confidence === "低" ? data.confidence : "中",
    explanation: data.explanation || "由服务端 AI 根据饮品名、小料、杯型和糖量估算。"
  };
}
