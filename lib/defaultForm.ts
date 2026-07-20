import type { DrinkForm } from "./types.ts";

export const defaultForm: DrinkForm = {
  mode: "saved",
  drinkType: "奶茶",
  drinkName: "",
  size: "中杯",
  ice: "少冰",
  sugar: "半糖",
  toppings: [],
  customTopping: ""
};
