import { AI_ESTIMATE_PATH, AI_TIMEOUT_MS, API_BASE_URL } from "../config/api.js";
import { estimateDrinkLocal } from "./drinkRules.js";

export function estimateDrinkSmart(form) {
  const localEstimate = estimateDrinkLocal(form);

  return requestAIEstimate(form, localEstimate)
    .then((estimate) => normalizeEstimate(estimate, localEstimate))
    .catch(() => localEstimate);
}

function requestAIEstimate(form, localEstimate) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${AI_ESTIMATE_PATH}`,
      method: "POST",
      timeout: AI_TIMEOUT_MS,
      header: {
        "content-type": "application/json"
      },
      data: {
        form,
        localEstimate
      },
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data);
          return;
        }

        reject(new Error(`AI estimate failed: ${response.statusCode}`));
      },
      fail: reject
    });
  });
}

function normalizeEstimate(data, fallback) {
  const price = Number(data?.price);
  const calories = Number(data?.calories);
  const sugarGram = Number(data?.sugarGram);
  const confidence = ["高", "中", "低"].includes(data?.confidence) ? data.confidence : "中";

  return {
    price: Number.isFinite(price) && price > 0 ? Math.round(price * 10) / 10 : fallback.price,
    calories: Number.isFinite(calories) && calories >= 0 ? Math.round(calories) : fallback.calories,
    sugarGram: Number.isFinite(sugarGram) && sugarGram >= 0 ? Math.round(sugarGram) : fallback.sugarGram,
    source: "AI智能估算",
    confidence,
    explanation: data?.explanation || "由服务端 AI 根据饮品名称、小料、杯型和糖量估算。数据为估算值，仅供参考。"
  };
}
