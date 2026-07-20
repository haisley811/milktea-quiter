export type DrinkMode = "saved" | "consumed";

export type DrinkType = "奶茶" | "果茶" | "咖啡";

export type DrinkSize = "小杯" | "中杯" | "大杯" | "超大杯";

export type IceLevel = "正常冰" | "少冰" | "微冰" | "去冰" | "常温";

export type SugarLevel = "正常糖" | "少糖" | "半糖" | "微糖" | "无糖";

export type Topping = "波霸" | "茶冻" | "椰果" | "芋圆";

export type EstimateSource = "本地预设" | "默认估算" | "AI智能估算";

export type EstimateConfidence = "高" | "中" | "低";

export type DrinkRecord = {
  id: string;
  date: string;
  mode: DrinkMode;
  drinkType: DrinkType;
  drinkName: string;
  size: DrinkSize;
  ice: IceLevel;
  sugar: SugarLevel;
  toppings: Topping[];
  customTopping: string;
  price: number;
  calories: number;
  sugarGram: number;
  source: EstimateSource;
  confidence: EstimateConfidence;
  explanation?: string;
};

export type AppStats = {
  totalSavedMoney: number;
  totalSpentMoney: number;
  netMoney: number;
  totalReducedCalories: number;
  totalAddedCalories: number;
  netCalories: number;
  totalReducedSugar: number;
  totalAddedSugar: number;
  netSugar: number;
  bodyScore: number;
  streakDays: number;
  records: DrinkRecord[];
};

export type DrinkForm = {
  mode: DrinkMode;
  drinkType: DrinkType;
  drinkName: string;
  size: DrinkSize;
  ice: IceLevel;
  sugar: SugarLevel;
  toppings: Topping[];
  customTopping: string;
  manualEstimate?: ManualDrinkEstimate;
};

export type DrinkEstimate = {
  price: number;
  calories: number;
  sugarGram: number;
  source: EstimateSource;
  confidence: EstimateConfidence;
  explanation?: string;
};

export type ManualDrinkEstimate = Partial<Pick<DrinkEstimate, "price" | "calories" | "sugarGram">>;
