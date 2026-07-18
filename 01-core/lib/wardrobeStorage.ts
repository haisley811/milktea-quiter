import { defaultWardrobeState, type OutfitId, type WardrobeState } from "./wardrobe";

export const WARDROBE_STORAGE_KEY = "milkTeaWardrobe";

function validId(value: unknown): value is OutfitId {
  return typeof value === "string" && ["default", "kpop-lilac", "hanfu-cloud", "denim-street", "ballet-pink", "coquette-red", "techwear-black", "summer-sundress", "office-chic", "idol-silver", "winter-coat"].includes(value);
}

export function loadWardrobe(): WardrobeState {
  if (typeof window === "undefined") return defaultWardrobeState;
  try {
    const raw = window.localStorage.getItem(WARDROBE_STORAGE_KEY);
    if (!raw) return defaultWardrobeState;
    const data = JSON.parse(raw) as Partial<WardrobeState>;
    const owned = Array.isArray(data.ownedOutfitIds) ? data.ownedOutfitIds.filter(validId) : [];
    const ownedOutfitIds = Array.from(new Set<OutfitId>(["default", ...owned]));
    const equippedOutfitId = validId(data.equippedOutfitId) && ownedOutfitIds.includes(data.equippedOutfitId) ? data.equippedOutfitId : "default";
    return { ownedOutfitIds, equippedOutfitId };
  } catch {
    return defaultWardrobeState;
  }
}

export function saveWardrobe(state: WardrobeState) {
  try {
    window.localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
