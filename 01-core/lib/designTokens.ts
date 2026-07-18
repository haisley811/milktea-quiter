export const designTokens = {
  color: {
    appBg: "#f8f4ff",
    cardBg: "rgba(255, 255, 255, 0.68)",
    cardBorder: "rgba(255, 255, 255, 0.82)",
    text: "#4c3575",
    muted: "#8a74aa",
    purple: "#a78bfa",
    purpleDeep: "#7c5bd6",
    mint: "#8eddd3",
    pink: "#f8bbd9",
    honey: "#f6b44b"
  },
  radius: {
    appShell: 38,
    card: 28,
    control: 22,
    pill: 999
  },
  shadow: {
    appShell: "0 24px 80px rgba(76, 53, 117, 0.16)",
    card: "0 14px 34px rgba(111, 82, 153, 0.12)",
    control: "0 10px 24px rgba(124, 91, 214, 0.18)"
  },
  motion: {
    pageEnterMs: 240,
    viewSwitchFeedbackMs: 220,
    viewSwitchBarMs: 620,
    modalEnterMs: 220,
    toastEnterMs: 260,
    toastVisibleMs: 1800,
    submitFeedbackMs: 260,
    loadingSpinnerMs: 780,
    skeletonShimmerMs: 1400,
    estimatePopMs: 220,
    characterFloatMs: 4500
  },
  layout: {
    maxAppWidth: 430,
    minStatCardHeight: 112,
    maxStatusBadgeWidth: 150,
    bottomNavHeight: 88,
    safeBottomPadding: "env(safe-area-inset-bottom)"
  },
  accessibility: {
    usesBusyState: true,
    usesFocusVisible: true,
    disabledOpacity: 0.72,
    supportsReducedMotion: true
  }
} as const;
