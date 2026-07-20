import assert from "node:assert/strict";
import { API_BASE_URL, AI_ESTIMATE_PATH, AI_TIMEOUT_MS } from "../templates/wechat-miniprogram/config/api.js";
import { estimateDrinkSmart } from "../templates/wechat-miniprogram/services/aiEstimate.js";
import { estimateDrinkLocal } from "../templates/wechat-miniprogram/services/drinkRules.js";

const form = {
  mode: "consumed",
  drinkType: "奶茶",
  drinkName: "珍珠奶茶",
  size: "中杯",
  ice: "少冰",
  sugar: "半糖",
  toppings: ["波霸"],
  customTopping: ""
};

const requests = [];
let requestMode = "success";

globalThis.wx = {
  request(options) {
    requests.push(options);

    if (requestMode === "success") {
      options.success({
        statusCode: 200,
        data: {
          price: 21.26,
          calories: 333.4,
          sugarGram: 27.6,
          confidence: "高",
          explanation: "mock AI estimate"
        }
      });
      return;
    }

    options.fail(new Error("mock network failure"));
  }
};

const aiResult = await estimateDrinkSmart(form);
const firstRequest = requests.at(-1);
assert.ok(firstRequest, "wx.request should be called");
assert.equal(firstRequest.url, `${API_BASE_URL}${AI_ESTIMATE_PATH}`);
assert.equal(firstRequest.method, "POST");
assert.equal(firstRequest.timeout, AI_TIMEOUT_MS);
assert.equal(firstRequest.header["content-type"], "application/json");
assert.deepEqual(firstRequest.data.form, form);
assert.deepEqual(firstRequest.data.localEstimate, estimateDrinkLocal(form));
assert.equal(aiResult.price, 21.3);
assert.equal(aiResult.calories, 333);
assert.equal(aiResult.sugarGram, 28);
assert.equal(aiResult.source, "AI智能估算");
assert.equal(aiResult.confidence, "高");

requestMode = "failure";
const fallbackResult = await estimateDrinkSmart(form);
const secondRequest = requests.at(-1);
assert.ok(secondRequest, "wx.request should still be called before fallback");
assert.equal(secondRequest.url, `${API_BASE_URL}${AI_ESTIMATE_PATH}`);
assert.deepEqual(fallbackResult, estimateDrinkLocal(form));

assert.doesNotMatch(JSON.stringify(requests), /QWEN_API_KEY|maas-api\.cn-huabei-1\.xf-yun\.com|\/v2\/chat\/completions/);

console.log("WeChat mini program API smoke test passed.");
