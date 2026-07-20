import type { HapticStyle, HapticsAdapter } from "./platformAdapters";

const vibrationPatterns: Record<HapticStyle, VibratePattern> = {
  light: 8,
  medium: 14,
  success: [8, 30, 12],
  warning: [16, 40, 16],
  error: [20, 30, 20]
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canVibrate() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export const webHaptics: HapticsAdapter = {
  feedback(style) {
    if (!canVibrate() || prefersReducedMotion()) return;

    navigator.vibrate(vibrationPatterns[style]);
  }
};
