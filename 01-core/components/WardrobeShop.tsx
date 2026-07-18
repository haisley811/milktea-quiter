"use client";

import type { AppStats } from "@/lib/types";
import { availableCoins, earnedCoins, findOutfit, OUTFITS, type OutfitId, type WardrobeState } from "@/lib/wardrobe";

type WardrobeShopProps = {
  stats: AppStats;
  wardrobe: WardrobeState;
  onPurchase: (id: OutfitId) => void;
  onEquip: (id: OutfitId) => void;
};

export function WardrobeShop({ stats, wardrobe, onPurchase, onEquip }: WardrobeShopProps) {
  const coins = availableCoins(stats.records, wardrobe);
  const total = earnedCoins(stats.records);

  return (
    <section className="glass-card rounded-[30px] p-5" aria-label="服装商店">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#8A74AA]">角色衣橱</p>
          <h2 className="mt-1 text-xl font-black text-[#4C3575]">用戒奶茶金币换新衣</h2>
        </div>
        <div className="shrink-0 rounded-[18px] border border-amber-200 bg-amber-50 px-3 py-2 text-right shadow-sm">
          <p className="text-[10px] font-black text-amber-700">可用金币</p>
          <p className="text-lg font-black text-amber-800">{coins}</p>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-[#8A74AA]">每成功戒 1 杯获得 10 金币。已累计获得 {total} 金币；服装价格对应 10 到 50 杯的坚持。</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {OUTFITS.map((outfit) => {
          const owned = wardrobe.ownedOutfitIds.includes(outfit.id);
          const equipped = wardrobe.equippedOutfitId === outfit.id;
          const canBuy = coins >= outfit.price;
          return (
            <article key={outfit.id} className={`wardrobe-card wardrobe-card-${outfit.id} rounded-[22px] border p-3 ${equipped ? "border-[#A78BFA] ring-2 ring-[#E9D5FF]" : "border-white/80"}`}>
              <div className={`wardrobe-preview relative h-20 overflow-hidden rounded-[16px] bg-gradient-to-br ${outfit.accent}`} aria-hidden="true">
                {outfit.previewPath ? <img src={outfit.previewPath} alt="" className="h-full w-full object-contain" /> : <span className={`wardrobe-mini wardrobe-${outfit.id}`} />}
              </div>
              <p className="mt-2 truncate text-sm font-black text-[#4C3575]">{outfit.name}</p>
              <p className="mt-1 h-8 text-[10px] font-semibold leading-snug text-[#8A74AA]">{outfit.description}</p>
              {owned ? (
                <button type="button" className={`mt-2 w-full rounded-[14px] px-2 py-2 text-xs font-black ${equipped ? "bg-[#EDE9FE] text-[#6D28D9]" : "bg-[#4C3575] text-white"}`} onClick={() => onEquip(outfit.id)} aria-pressed={equipped}>
                  {equipped ? "已穿上" : "换上"}
                </button>
              ) : (
                <button type="button" className="mt-2 w-full rounded-[14px] bg-amber-100 px-2 py-2 text-xs font-black text-amber-800 disabled:cursor-not-allowed disabled:opacity-45" onClick={() => onPurchase(outfit.id)} disabled={!canBuy}>
                  {outfit.price} 金币
                </button>
              )}
            </article>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] font-semibold text-[#8A74AA]">当前穿着：{findOutfit(wardrobe.equippedOutfitId).name}。服装会随角色阶段等比调整，不改变 Body Score 的真实形态。</p>
    </section>
  );
}
