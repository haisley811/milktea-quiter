import type {
  DrinkEstimate,
  DrinkForm,
  DrinkSize,
  DrinkType,
  SugarLevel,
  Topping
} from "./types.ts";

type EstimateBase = {
  price: number;
  calories: number;
  sugarGram: number;
};

export const drinkTypeOptions: DrinkType[] = ["奶茶", "果茶", "咖啡"];
export const drinkSizeOptions: DrinkSize[] = ["小杯", "中杯", "大杯", "超大杯"];
export const iceOptions = ["正常冰", "少冰", "微冰", "去冰", "常温"] as const;
export const sugarOptions: SugarLevel[] = ["正常糖", "少糖", "半糖", "微糖", "无糖"];
export const toppingOptions: Topping[] = ["波霸", "茶冻", "椰果", "芋圆"];

const presetDrinks: Record<string, EstimateBase & { type: DrinkType }> = {
  霸王茶姬伯牙绝弦: { type: "奶茶", price: 16, calories: 220, sugarGram: 18 },
  喜茶多肉葡萄: { type: "果茶", price: 29, calories: 360, sugarGram: 46 },
  瑞幸生椰拿铁: { type: "咖啡", price: 18, calories: 235, sugarGram: 17 },
  古茗杨枝甘露: { type: "果茶", price: 18, calories: 380, sugarGram: 48 },
  一点点波霸奶茶: { type: "奶茶", price: 15, calories: 420, sugarGram: 42 }
};

const typeDefaults: Record<DrinkType, EstimateBase> = {
  奶茶: { price: 18, calories: 360, sugarGram: 38 },
  果茶: { price: 17, calories: 260, sugarGram: 36 },
  咖啡: { price: 16, calories: 190, sugarGram: 18 }
};

const sizeMultiplier: Record<DrinkSize, number> = {
  小杯: 0.82,
  中杯: 1,
  大杯: 1.18,
  超大杯: 1.35
};

const sugarMultiplier: Record<SugarLevel, number> = {
  正常糖: 1,
  少糖: 0.78,
  半糖: 0.52,
  微糖: 0.28,
  无糖: 0.08
};

const toppingCalories: Record<Topping, number> = {
  波霸: 95,
  茶冻: 45,
  椰果: 55,
  芋圆: 90
};

const toppingSugar: Record<Topping, number> = {
  波霸: 9,
  茶冻: 5,
  椰果: 8,
  芋圆: 10
};

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, "");
}

function roundMoney(value: number) {
  return Math.round(value * 10) / 10;
}

export function estimateDrink(form: DrinkForm): DrinkEstimate {
  const normalizedName = normalizeName(form.drinkName);
  const preset = normalizedName ? presetDrinks[normalizedName] : undefined;
  const base = preset ?? typeDefaults[form.drinkType];
  const sizeFactor = sizeMultiplier[form.size];
  const sugarFactor = sugarMultiplier[form.sugar];
  const toppingCaloriesTotal = form.toppings.reduce((sum, item) => sum + toppingCalories[item], 0);
  const toppingSugarTotal = form.toppings.reduce((sum, item) => sum + toppingSugar[item], 0);
  const customToppingBoost = form.customTopping.trim() ? 35 : 0;
  const hasCustomInput = Boolean(normalizedName && !preset) || Boolean(form.customTopping.trim());

  return {
    price: roundMoney(base.price * sizeFactor + form.toppings.length * 2 + (form.customTopping.trim() ? 2 : 0)),
    calories: Math.round(base.calories * sizeFactor * (0.72 + sugarFactor * 0.28) + toppingCaloriesTotal + customToppingBoost),
    sugarGram: Math.round(base.sugarGram * sugarFactor * sizeFactor + toppingSugarTotal + (form.customTopping.trim() ? 4 : 0)),
    source: preset ? "本地预设" : "默认估算",
    confidence: preset ? "高" : hasCustomInput ? "低" : "中",
    explanation: preset
      ? "命中本地预设，并结合杯型、糖量和小料调整。"
      : hasCustomInput
        ? "正在用本地规则生成临时建议，服务端 AI 返回后会自动更新。"
        : "未命中预设，按饮品类型默认值生成临时建议。"
  };
}
