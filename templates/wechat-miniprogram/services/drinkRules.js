const defaults = {
  "奶茶": { price: 18, calories: 360, sugarGram: 38 },
  "果茶": { price: 17, calories: 260, sugarGram: 36 },
  "咖啡": { price: 16, calories: 190, sugarGram: 18 }
};

const sizeFactor = {
  "小杯": 0.82,
  "中杯": 1,
  "大杯": 1.18,
  "超大杯": 1.35
};

const sugarFactor = {
  "正常糖": 1,
  "少糖": 0.78,
  "半糖": 0.52,
  "微糖": 0.28,
  "无糖": 0.08
};

const toppingCalories = {
  "波霸": 95,
  "茶冻": 45,
  "椰果": 55,
  "芋圆": 90
};

const toppingSugar = {
  "波霸": 9,
  "茶冻": 5,
  "椰果": 8,
  "芋圆": 10
};

export function estimateDrinkLocal(form) {
  const drinkType = form.drinkType || "奶茶";
  const size = form.size || "中杯";
  const sugar = form.sugar || "半糖";
  const toppings = Array.isArray(form.toppings) ? form.toppings : [];
  const customTopping = String(form.customTopping || "").trim();
  const base = defaults[drinkType] || defaults["奶茶"];
  const currentSizeFactor = sizeFactor[size] || 1;
  const currentSugarFactor = sugarFactor[sugar] ?? 0.52;

  const toppingKcal = toppings.reduce((sum, item) => sum + (toppingCalories[item] || 0), 0);
  const toppingSugarTotal = toppings.reduce((sum, item) => sum + (toppingSugar[item] || 0), 0);

  return {
    price: Math.round((base.price * currentSizeFactor + toppings.length * 2 + (customTopping ? 2 : 0)) * 10) / 10,
    calories: Math.round(base.calories * currentSizeFactor * (0.72 + currentSugarFactor * 0.28) + toppingKcal + (customTopping ? 35 : 0)),
    sugarGram: Math.round(base.sugarGram * currentSugarFactor * currentSizeFactor + toppingSugarTotal + (customTopping ? 4 : 0)),
    source: "默认估算",
    confidence: customTopping ? "低" : "中",
    explanation: "小程序本地兜底估算。AI 接口不可用时会使用这个结果。"
  };
}
