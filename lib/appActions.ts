import { createId } from "./ids.ts";
import { addRecordToStats, initialStats } from "./stats.ts";
import type { AppStats, DrinkEstimate, DrinkForm, DrinkRecord, ManualDrinkEstimate } from "./types.ts";

export function submitDrinkForm(stats: AppStats, form: DrinkForm, estimate: DrinkEstimate, now = new Date()) {
  const finalEstimate = applyManualEstimate(estimate, form.manualEstimate);
  const record: DrinkRecord = {
    id: createId(),
    date: now.toISOString(),
    mode: form.mode,
    drinkType: form.drinkType,
    drinkName: form.drinkName.trim() || `${form.drinkType}小确幸`,
    size: form.size,
    ice: form.ice,
    sugar: form.sugar,
    toppings: form.toppings,
    customTopping: form.customTopping.trim(),
    price: finalEstimate.price,
    calories: finalEstimate.calories,
    sugarGram: finalEstimate.sugarGram,
    source: finalEstimate.source,
    confidence: finalEstimate.confidence,
    explanation: finalEstimate.explanation
  };

  return {
    record,
    stats: addRecordToStats(stats, record)
  };
}

export function resetAppData() {
  return initialStats;
}

export function applyManualEstimate(estimate: DrinkEstimate, manualEstimate?: ManualDrinkEstimate): DrinkEstimate {
  const manual = manualEstimate ?? {};
  const price = normalizeManualValue(manual.price, "price");
  const calories = normalizeManualValue(manual.calories, "whole");
  const sugarGram = normalizeManualValue(manual.sugarGram, "whole");
  const hasManualValue = price !== undefined || calories !== undefined || sugarGram !== undefined;

  if (!hasManualValue) {
    return estimate;
  }

  return {
    ...estimate,
    price: price ?? estimate.price,
    calories: calories ?? estimate.calories,
    sugarGram: sugarGram ?? estimate.sugarGram,
    explanation: `${estimate.explanation ?? "数据为估算值，仅供参考。"} 你已手动修正价格、热量或糖分，提交会以手动值为准。`
  };
}

function normalizeManualValue(value: number | undefined, mode: "price" | "whole") {
  if (value === undefined || !Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return mode === "price" ? Math.round(value * 10) / 10 : Math.round(value);
}
