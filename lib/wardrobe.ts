import type { DrinkRecord } from "./types";

export type OutfitId =
  | "default"
  | "kpop-lilac"
  | "hanfu-cloud"
  | "denim-street"
  | "ballet-pink"
  | "coquette-red"
  | "techwear-black"
  | "summer-sundress"
  | "office-chic"
  | "idol-silver"
  | "winter-coat";

export type Outfit = {
  id: OutfitId;
  name: string;
  description: string;
  price: number;
  accent: string;
  previewPath?: string;
};

export type WardrobeState = {
  ownedOutfitIds: OutfitId[];
  equippedOutfitId: OutfitId;
};

export const COINS_PER_SAVED_CUP = 10;

export const OUTFITS: Outfit[] = [
  { id: "default", name: "元气日常", description: "初始套装，轻松出门。", price: 0, accent: "from-[#DDF8F5] to-[#F3E8FF]" },
  { id: "kpop-lilac", name: "薰衣草舞台", description: "女团舞台感短外套与百褶裙。", price: 100, accent: "from-[#E9D5FF] to-[#FCE7F3]", previewPath: "/images/outfits/kpop-lilac.png" },
  { id: "hanfu-cloud", name: "云纹汉服", description: "浅碧与奶白的轻盈襦裙。", price: 150, accent: "from-[#D1FAE5] to-[#FEF3C7]", previewPath: "/images/outfits/hanfu-cloud.png" },
  { id: "denim-street", name: "丹宁街头", description: "短卫衣、工装裙与厚底鞋。", price: 180, accent: "from-[#DBEAFE] to-[#E0E7FF]", previewPath: "/images/outfits/denim-street.png" },
  { id: "ballet-pink", name: "芭蕾粉雾", description: "针织开衫、纱裙与软软护腿。", price: 220, accent: "from-[#FCE7F3] to-[#FDF2F8]", previewPath: "/images/outfits/ballet-pink.png" },
  { id: "coquette-red", name: "樱桃蝴蝶结", description: "甜酷红针织与格纹百褶裙。", price: 260, accent: "from-[#FEE2E2] to-[#FCE7F3]", previewPath: "/images/outfits/coquette-red.png" },
  { id: "techwear-black", name: "夜行机能", description: "黑色拉链外套与霓虹机能带。", price: 310, accent: "from-[#E5E7EB] to-[#DDD6FE]", previewPath: "/images/outfits/techwear-black.png" },
  { id: "summer-sundress", name: "夏日奶油花", description: "碎花吊带裙与轻薄小披肩。", price: 350, accent: "from-[#FEF3C7] to-[#FEF9C3]", previewPath: "/images/outfits/summer-sundress.png" },
  { id: "office-chic", name: "珍珠通勤", description: "珍珠领衬衫与简洁 A 字裙。", price: 400, accent: "from-[#F3F4F6] to-[#E0E7FF]", previewPath: "/images/outfits/office-chic.png" },
  { id: "idol-silver", name: "银曜偶像", description: "未来感不对称上衣和金属靴。", price: 450, accent: "from-[#E0E7FF] to-[#CFFAFE]", previewPath: "/images/outfits/idol-silver.png" },
  { id: "winter-coat", name: "冰蓝暖冬", description: "呢大衣、针织裙和围巾。", price: 500, accent: "from-[#DBEAFE] to-[#E0F2FE]", previewPath: "/images/outfits/winter-coat.png" }
];

export const defaultWardrobeState: WardrobeState = {
  ownedOutfitIds: ["default"],
  equippedOutfitId: "default"
};

export function earnedCoins(records: DrinkRecord[]) {
  return records.filter((record) => record.mode === "saved").length * COINS_PER_SAVED_CUP;
}

export function findOutfit(id: OutfitId) {
  return OUTFITS.find((outfit) => outfit.id === id) ?? OUTFITS[0];
}

export function spentCoins(state: WardrobeState) {
  return state.ownedOutfitIds.reduce((total, id) => total + findOutfit(id).price, 0);
}

export function availableCoins(records: DrinkRecord[], state: WardrobeState) {
  return Math.max(0, earnedCoins(records) - spentCoins(state));
}

export function purchaseOutfit(records: DrinkRecord[], state: WardrobeState, outfitId: OutfitId): WardrobeState | null {
  if (state.ownedOutfitIds.includes(outfitId)) return state;
  const outfit = findOutfit(outfitId);
  if (availableCoins(records, state) < outfit.price) return null;
  return { ...state, ownedOutfitIds: [...state.ownedOutfitIds, outfitId] };
}

export function equipOutfit(state: WardrobeState, outfitId: OutfitId): WardrobeState {
  return state.ownedOutfitIds.includes(outfitId) ? { ...state, equippedOutfitId: outfitId } : state;
}
