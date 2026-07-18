import assert from "node:assert/strict";
import { applyManualEstimate, submitDrinkForm } from "../lib/appActions.ts";
import { characterStages, getCharacterStageMeta } from "../lib/character.ts";
import { designTokens } from "../lib/designTokens.ts";
import { defaultForm } from "../lib/defaultForm.ts";
import { estimateDrink } from "../lib/drinkRules.ts";
import { estimateDrinkSmart } from "../lib/aiEstimate.ts";
import { estimateWithQwen, getQwenRuntimeStatus, resolveQwenConfig } from "../lib/qwenEstimateRuntime.mjs";
import { addRecordToStats, dateKey, getTodayRecordSummary, initialStats, rebuildStats, recentSevenDays } from "../lib/stats.ts";
import { clearAppStatsFromStorage, createMemoryStorageAdapter, loadAppStatsFromStorage, saveAppStatsToStorage, STORAGE_KEY } from "../lib/storage.ts";
import { COINS_PER_SAVED_CUP, availableCoins, defaultWardrobeState, equipOutfit, earnedCoins, OUTFITS, purchaseOutfit } from "../lib/wardrobe.ts";

const presetEstimate = estimateDrink({
  ...defaultForm,
  drinkName: "喜茶多肉葡萄",
  drinkType: "果茶",
  size: "中杯",
  sugar: "半糖",
  toppings: ["波霸"],
  customTopping: ""
});

assert.equal(presetEstimate.price, 31);
assert.equal(presetEstimate.calories, 407);
assert.equal(presetEstimate.sugarGram, 33);
assert.equal(presetEstimate.source, "本地预设");
assert.equal(presetEstimate.confidence, "高");
assert.match(presetEstimate.explanation ?? "", /命中本地预设/);

const fallbackEstimate = estimateDrink({
  ...defaultForm,
  drinkName: "周末小拿铁",
  drinkType: "咖啡",
  size: "大杯",
  sugar: "微糖",
  toppings: ["茶冻"],
  customTopping: "奶盖"
});

assert.equal(fallbackEstimate.price, 22.9);
assert.equal(fallbackEstimate.calories, 259);
assert.equal(fallbackEstimate.sugarGram, 15);
assert.equal(fallbackEstimate.source, "默认估算");
assert.equal(fallbackEstimate.confidence, "低");
assert.match(fallbackEstimate.explanation ?? "", /本地规则/);

const savedRecord = {
  id: "saved-1",
  date: new Date().toISOString(),
  mode: "saved",
  drinkType: "奶茶",
  drinkName: "一点点波霸奶茶",
  size: "中杯",
  ice: "少冰",
  sugar: "半糖",
  toppings: ["波霸"],
  customTopping: "",
  price: 20,
  calories: 408,
  sugarGram: 46,
  source: "本地预设",
  confidence: "高"
};

const consumedRecord = {
  ...savedRecord,
  id: "consumed-1",
  mode: "consumed",
  price: 18,
  calories: 220,
  sugarGram: 18
};

const afterSaved = addRecordToStats(initialStats, savedRecord);
assert.equal(afterSaved.bodyScore, 48);
assert.equal(afterSaved.totalSavedMoney, 20);
assert.equal(afterSaved.totalReducedCalories, 408);
assert.equal(afterSaved.streakDays, 1);
assert.equal(COINS_PER_SAVED_CUP, 10);
assert.equal(OUTFITS.length, 11);
assert.equal(OUTFITS.filter((outfit) => outfit.id !== "default" && Boolean(outfit.previewPath)).length, 10);
assert.equal(earnedCoins([savedRecord, consumedRecord, savedRecord]), 20);
assert.equal(availableCoins([savedRecord, consumedRecord, savedRecord], defaultWardrobeState), 20);
assert.equal(purchaseOutfit([savedRecord], defaultWardrobeState, "kpop-lilac"), null);
const purchasedWardrobe = purchaseOutfit(Array.from({ length: 10 }, (_, index) => ({ ...savedRecord, id: `coin-${index}` })), defaultWardrobeState, "kpop-lilac");
assert.ok(purchasedWardrobe);
assert.equal(availableCoins(Array.from({ length: 10 }, (_, index) => ({ ...savedRecord, id: `coin-${index}` })), purchasedWardrobe), 0);
assert.equal(equipOutfit(purchasedWardrobe, "kpop-lilac").equippedOutfitId, "kpop-lilac");

const afterConsumed = addRecordToStats(afterSaved, consumedRecord);
assert.equal(afterConsumed.bodyScore, 50);
assert.equal(afterConsumed.totalSpentMoney, 18);
assert.equal(afterConsumed.netMoney, 2);
assert.equal(afterConsumed.netCalories, 188);
assert.equal(afterConsumed.netSugar, 28);

const afterDelete = rebuildStats(afterConsumed.records.filter((record) => record.id !== consumedRecord.id), 50);
assert.equal(afterDelete.bodyScore, 48);
assert.equal(afterDelete.records.length, 1);
assert.equal(afterDelete.netMoney, 20);

const todaySummary = getTodayRecordSummary(afterConsumed.records);
assert.equal(todaySummary.total, 2);
assert.equal(todaySummary.saved, 1);
assert.equal(todaySummary.consumed, 1);
assert.equal(todaySummary.netMoney, 2);
assert.equal(todaySummary.latestMode, "consumed");

assert.equal(getCharacterStageMeta(0).stage, 1);
assert.equal(getCharacterStageMeta(25).stage, 1);
assert.equal(getCharacterStageMeta(26).stage, 2);
assert.equal(getCharacterStageMeta(46).stage, 3);
assert.equal(getCharacterStageMeta(61).stage, 4);
assert.equal(getCharacterStageMeta(81).stage, 5);
assert.equal(getCharacterStageMeta(30).label, "健康活力");
assert.equal(characterStages.length, 5);
assert.deepEqual(characterStages.map((item) => item.imagePath), [
  "/images/girl-stage-1-transparent.png",
  "/images/girl-stage-2-transparent.png",
  "/images/girl-stage-3-transparent.png",
  "/images/girl-stage-4-transparent.png",
  "/images/girl-stage-5-transparent.png"
]);
assert.deepEqual(characterStages.map((item) => item.blinkImagePath), [
  "/images/girl-stage-1-blink.png",
  "/images/girl-stage-2-blink.png",
  "/images/girl-stage-3-blink.png",
  "/images/girl-stage-4-blink.png",
  "/images/girl-stage-5-blink.png"
]);
assert.deepEqual(characterStages.map((item) => item.waveImagePath), [
  "/images/girl-stage-1-wave.png",
  "/images/girl-stage-2-wave.png",
  "/images/girl-stage-3-wave.png",
  "/images/girl-stage-4-wave.png",
  "/images/girl-stage-5-wave.png"
]);

const trendBaseDate = new Date();
const yesterday = new Date(trendBaseDate);
yesterday.setDate(yesterday.getDate() - 1);
const trend = recentSevenDays([
  { ...savedRecord, id: "trend-saved", date: trendBaseDate.toISOString(), mode: "saved" },
  { ...consumedRecord, id: "trend-consumed", date: trendBaseDate.toISOString(), mode: "consumed" },
  { ...savedRecord, id: "trend-yesterday", date: yesterday.toISOString(), mode: "saved" }
], trendBaseDate);
assert.equal(trend.length, 7);
assert.equal(trend.at(-1)?.saved, 1);
assert.equal(trend.at(-1)?.consumed, 1);
assert.equal(trend.at(-2)?.saved, 1);
assert.equal(dateKey(trendBaseDate), trend.at(-1)?.key);

assert.equal(designTokens.layout.maxAppWidth, 430);
assert.equal(designTokens.motion.estimatePopMs, 220);
assert.equal(designTokens.accessibility.usesBusyState, true);
assert.equal(designTokens.accessibility.supportsReducedMotion, true);

const submitted = submitDrinkForm(
  initialStats,
  { ...defaultForm, mode: "saved", drinkName: "霸王茶姬伯牙绝弦", sugar: "少糖" },
  estimateDrink({ ...defaultForm, drinkName: "霸王茶姬伯牙绝弦", sugar: "少糖" }),
  new Date("2026-06-04T10:00:00+08:00")
);

assert.equal(submitted.record.drinkName, "霸王茶姬伯牙绝弦");
assert.equal(submitted.record.source, "本地预设");
assert.equal(submitted.stats.bodyScore, 48);
assert.equal(submitted.stats.records.length, 1);

const manualEstimate = applyManualEstimate(
  { price: 19.95, calories: 301.6, sugarGram: 20.2, source: "默认估算", confidence: "中", explanation: "基础估算。" },
  { price: 21.26, calories: 288.6, sugarGram: 16.2 }
);
assert.deepEqual(manualEstimate, {
  price: 21.3,
  calories: 289,
  sugarGram: 16,
  source: "默认估算",
  confidence: "中",
  explanation: "基础估算。 你已手动修正价格、热量或糖分，提交会以手动值为准。"
});

const manualSubmitted = submitDrinkForm(
  initialStats,
  { ...defaultForm, mode: "consumed", drinkName: "手动修正饮品", manualEstimate: { price: 12.5, calories: 88, sugarGram: 7 } },
  estimateDrink({ ...defaultForm, drinkName: "手动修正饮品" }),
  new Date("2026-06-04T11:00:00+08:00")
);
assert.equal(manualSubmitted.record.price, 12.5);
assert.equal(manualSubmitted.record.calories, 88);
assert.equal(manualSubmitted.record.sugarGram, 7);
assert.match(manualSubmitted.record.explanation ?? "", /手动修正/);

const memoryStore = new Map();
const memoryStorage = {
  getItem: (key) => memoryStore.get(key) ?? null,
  setItem: (key, value) => memoryStore.set(key, value),
  removeItem: (key) => memoryStore.delete(key)
};

saveAppStatsToStorage(submitted.stats, memoryStorage);
assert.equal(memoryStore.has(STORAGE_KEY), true);
assert.equal(loadAppStatsFromStorage(memoryStorage).records.length, 1);

const memoryAdapter = createMemoryStorageAdapter();
assert.deepEqual(saveAppStatsToStorage(submitted.stats, memoryAdapter), { ok: true });
assert.equal(loadAppStatsFromStorage(memoryAdapter).records.length, 1);
assert.deepEqual(clearAppStatsFromStorage(memoryAdapter), { ok: true });
assert.equal(loadAppStatsFromStorage(memoryAdapter).records.length, 0);

memoryStorage.setItem(STORAGE_KEY, "{broken-json");
assert.deepEqual(loadAppStatsFromStorage(memoryStorage), initialStats);

saveAppStatsToStorage(submitted.stats, memoryStorage);
clearAppStatsFromStorage(memoryStorage);
assert.equal(memoryStore.has(STORAGE_KEY), false);

const failingStorage = {
  getItem: () => {
    throw new Error("read failed");
  },
  setItem: () => {
    throw new Error("write failed");
  },
  removeItem: () => {
    throw new Error("remove failed");
  }
};
assert.deepEqual(loadAppStatsFromStorage(failingStorage), initialStats);
assert.deepEqual(saveAppStatsToStorage(submitted.stats, failingStorage), { ok: false, reason: "write-failed" });
assert.deepEqual(clearAppStatsFromStorage(failingStorage), { ok: false, reason: "remove-failed" });
assert.deepEqual(saveAppStatsToStorage(submitted.stats, null), { ok: false, reason: "unavailable" });
assert.deepEqual(clearAppStatsFromStorage(null), { ok: false, reason: "unavailable" });

const smartFallback = await estimateDrinkSmart(
  { ...defaultForm, drinkName: "自定义奶盖麻薯奶茶", customTopping: "奶盖麻薯" },
  { estimate: async () => { throw new Error("mock provider offline"); } }
);
assert.equal(smartFallback.source, "默认估算");
assert.doesNotMatch(smartFallback.explanation ?? "", /AI 接口暂不可用/);

const smartAI = await estimateDrinkSmart(
  { ...defaultForm, drinkName: "自定义奶盖麻薯奶茶", customTopping: "奶盖麻薯" },
  { estimate: async () => ({ price: 23.6, calories: 450.2, sugarGram: 39.8, source: "AI智能估算", confidence: "中", explanation: "模拟服务端 AI 估算。" }) }
);
assert.deepEqual(smartAI, {
  price: 23.6,
  calories: 450,
  sugarGram: 40,
  source: "AI智能估算",
  confidence: "中",
  explanation: "模拟服务端 AI 估算。"
});

const disabledQwen = await estimateWithQwen(
  { form: defaultForm, localEstimate: fallbackEstimate },
  { env: { MILKTEA_AI_ENABLED: "false" } }
);
assert.equal(disabledQwen.ok, false);
assert.equal(disabledQwen.reason, "disabled");

const missingQwen = resolveQwenConfig({ MILKTEA_AI_ENABLED: "true" });
assert.equal(missingQwen.enabled, true);
assert.deepEqual(missingQwen.missing, ["QWEN_API_KEY"]);

assert.deepEqual(getQwenRuntimeStatus({ MILKTEA_AI_ENABLED: "true", QWEN_API_KEY: "secret", QWEN_MODEL: "xopqwen36v35b" }), {
  enabled: true,
  ready: true,
  baseUrl: "https://maas-api.cn-huabei-1.xf-yun.com/v2",
  model: "xopqwen36v35b",
  missing: []
});

const qwenSuccess = await estimateWithQwen(
  { form: defaultForm, localEstimate: fallbackEstimate },
  {
    env: { MILKTEA_AI_ENABLED: "true", QWEN_API_KEY: "secret", QWEN_MODEL: "xopqwen36v35b" },
    fetch: async (url, init) => {
      assert.equal(url, "https://maas-api.cn-huabei-1.xf-yun.com/v2/chat/completions");
      assert.equal(init.headers.authorization, "Bearer secret");
      const payload = JSON.parse(init.body);
      assert.equal(payload.model, "xopqwen36v35b");
      assert.equal(payload.messages.length, 2);
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  price: 24.28,
                  calories: 401.7,
                  sugarGram: 31.2,
                  confidence: "中",
                  explanation: "按 QWEN 模拟结果估算。"
                })
              }
            }
          ]
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
  }
);
assert.deepEqual(qwenSuccess, {
  ok: true,
  estimate: {
    price: 24.3,
    calories: 402,
    sugarGram: 31,
    source: "AI智能估算",
    confidence: "中",
    explanation: "按 QWEN 模拟结果估算。"
  }
});

console.log("Core rules verified.");
