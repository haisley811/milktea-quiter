import type { AIEstimateProvider } from "./aiEstimate.ts";
import type { StorageAdapter } from "./storage.ts";

export type PlatformKind = "web" | "wechat-miniprogram" | "ios";

export type HapticStyle = "light" | "medium" | "success" | "warning" | "error";

export type HapticsAdapter = {
  feedback(style: HapticStyle): void;
};

export type PlatformCapabilities = {
  platform: PlatformKind;
  supportsHover: boolean;
  supportsBackdropBlur: boolean;
  supportsSafeAreaInset: boolean;
  prefersNativeNavigation: boolean;
};

export type AppPlatformAdapter = {
  capabilities: PlatformCapabilities;
  storage: StorageAdapter | null;
  aiEstimateProvider?: AIEstimateProvider;
  haptics?: HapticsAdapter;
};

export const webCapabilities: PlatformCapabilities = {
  platform: "web",
  supportsHover: true,
  supportsBackdropBlur: true,
  supportsSafeAreaInset: true,
  prefersNativeNavigation: false
};

export const wechatMiniprogramCapabilities: PlatformCapabilities = {
  platform: "wechat-miniprogram",
  supportsHover: false,
  supportsBackdropBlur: false,
  supportsSafeAreaInset: true,
  prefersNativeNavigation: true
};

export const iosCapabilities: PlatformCapabilities = {
  platform: "ios",
  supportsHover: false,
  supportsBackdropBlur: true,
  supportsSafeAreaInset: true,
  prefersNativeNavigation: true
};

export const migrationReadyModules = [
  "lib/types.ts",
  "lib/defaultForm.ts",
  "lib/drinkRules.ts",
  "lib/aiEstimate.ts",
  "lib/appActions.ts",
  "lib/stats.ts",
  "lib/storage.ts",
  "lib/character.ts"
] as const;

export const platformReplacementMap = {
  storage: {
    web: "window.localStorage",
    wechat: "wx.getStorageSync / wx.setStorageSync / wx.removeStorageSync",
    ios: "UserDefaults first, CloudKit or server sync later"
  },
  aiEstimate: {
    web: "Next.js route handler or external backend",
    wechat: "Cloud Function or backend HTTPS endpoint",
    ios: "Backend HTTPS endpoint; keep API keys outside the app bundle"
  },
  haptics: {
    web: "CSS active states and optional Vibration API",
    wechat: "wx.vibrateShort or native tap feedback",
    ios: "UIImpactFeedbackGenerator and UINotificationFeedbackGenerator"
  },
  visualEffects: {
    web: "CSS backdrop-filter with solid fallback",
    wechat: "WXSS translucent cards, fewer blur assumptions",
    ios: "SwiftUI Material or UIKit blur effects"
  }
} as const;
