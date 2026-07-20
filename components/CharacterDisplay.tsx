"use client";

import { useEffect, useState } from "react";
import { getCharacterStageMeta } from "@/lib/character";
import { findOutfit, type OutfitId } from "@/lib/wardrobe";

type CharacterDisplayProps = {
  bodyScore: number;
  compact?: boolean;
  withBubble?: boolean;
  outfitId?: OutfitId;
};

type MotionFrame = "base" | "blink" | "wave";

export function CharacterDisplay({ bodyScore, compact = false, withBubble = false, outfitId = "default" }: CharacterDisplayProps) {
  const stageMeta = getCharacterStageMeta(bodyScore);
  const outfit = findOutfit(outfitId);
  const dressedPath = outfitId === "default" ? null : `/images/dressed/${outfitId}-stage-${stageMeta.stage}.png`;
  const characterPath = dressedPath ?? stageMeta.imagePath;
  const [motionFrame, setMotionFrame] = useState<MotionFrame>("base");
  const [src, setSrc] = useState(characterPath);
  const [missing, setMissing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const onChange = () => setReduceMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setMotionFrame("base");
    setSrc(characterPath);
    setMissing(false);
  }, [characterPath]);

  useEffect(() => {
    if (reduceMotion || missing || dressedPath) return;

    const waveTimer = window.setTimeout(() => setMotionFrame("wave"), 140);
    const baseAfterWave = window.setTimeout(() => setMotionFrame("base"), 780);
    const blinkLoop = window.setInterval(() => {
      setMotionFrame("blink");
      window.setTimeout(() => setMotionFrame("base"), 170);
    }, 5200);

    return () => {
      window.clearTimeout(waveTimer);
      window.clearTimeout(baseAfterWave);
      window.clearInterval(blinkLoop);
    };
  }, [dressedPath, missing, reduceMotion, stageMeta.stage]);

  return (
    <div className="relative">
      {withBubble ? (
        <div className="absolute right-2 top-2 z-10 max-w-[152px] rounded-[22px] border border-white/80 bg-white/90 px-4 py-3 text-xs font-semibold leading-relaxed text-[#6D5A8C] shadow-[0_12px_26px_rgba(76,53,117,0.12)]">
          你超棒的！每一次选择，都是更好的自己。
        </div>
      ) : null}
      <div
        data-character-stage={stageMeta.stage}
        data-outfit={outfitId}
        className={`relative overflow-hidden rounded-[32px] border border-white/80 bg-gradient-to-br ${stageMeta.tint} shadow-[0_18px_44px_rgba(76,53,117,0.14)] ${
          compact ? "min-h-[190px]" : "min-h-[300px]"
        }`}
      >
        <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3 rounded-[22px] border border-white/80 bg-white/78 px-3 py-2 text-xs font-bold text-[#4C3575] shadow-[0_10px_24px_rgba(76,53,117,0.1)] backdrop-blur-xl">
          <span className="min-w-0 truncate">{stageMeta.label}</span>
          <span className="shrink-0 rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[10px] font-black text-[#7C5BD6]">S{stageMeta.stage}</span>
        </div>
        {missing ? (
          <div className="flex min-h-[inherit] items-center justify-center px-8 text-center text-sm font-semibold text-[#8A74AA]">
            角色图片未找到
          </div>
        ) : (
          <div className={`character-canvas-anchor ${compact ? "character-canvas-anchor-compact" : ""}`}>
            <div className="character-canvas floaty">
              <img
                src={src}
                alt={outfitId === "default" ? stageMeta.status : `${stageMeta.status}，穿着${outfit.name}`}
                className={`character-motion-frame ${motionFrame === "base" ? "opacity-100" : "opacity-0"}`}
                onError={() => {
                  if (dressedPath && src === dressedPath) {
                    setSrc(stageMeta.imagePath);
                    return;
                  }
                  if (src !== "/images/girl-normal-transparent.png") {
                    setSrc("/images/girl-normal-transparent.png");
                    return;
                  }
                  setMissing(true);
                }}
              />
              {outfitId === "default" ? (
                <>
                  <img
                    src={stageMeta.blinkImagePath}
                    alt=""
                    aria-hidden="true"
                    className={`character-motion-frame ${motionFrame === "blink" ? "opacity-100" : "opacity-0"}`}
                  />
                  <img
                    src={stageMeta.waveImagePath}
                    alt=""
                    aria-hidden="true"
                    className={`character-motion-frame ${motionFrame === "wave" ? "opacity-100" : "opacity-0"}`}
                  />
                </>
              ) : null}
            </div>
          </div>
        )}
        <div className="absolute inset-x-4 bottom-4 z-10 rounded-[22px] border border-white/75 bg-white/72 px-3 py-2 text-xs font-semibold leading-snug text-[#6D5A8C] shadow-[0_10px_24px_rgba(76,53,117,0.1)] backdrop-blur-xl">
          {stageMeta.status}
        </div>
      </div>
    </div>
  );
}
