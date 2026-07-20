# 微信小程序 API 服务模板

这份是迁移时可参考的服务层草稿。正式小程序项目里建议放在：

```text
services/aiEstimate.ts
```

项目里也已经提供了可直接复制的小程序模板目录：

```text
templates/wechat-miniprogram/
```

里面包含：

```text
config/api.js
services/drinkRules.js
services/aiEstimate.js
pages/record/record.js
```

如果你不是自己写代码，可以把这个目录直接交给小程序开发者，让对方把 `config/api.js` 里的 Netlify 域名替换成你的公共链接。

## 目标

- 小程序只请求你自己的 Netlify 后端。
- 不在小程序包里保存 QWEN API Key。
- API 失败时回退本地估算。
- 请求体保持和 Web 端一致，方便复用现有规则。

## 配置

建议单独放一个配置文件：

```js
export const API_BASE_URL = "https://你的站点.netlify.app";
```

上线前要把这个域名添加到微信公众平台的 `request 合法域名`。

## 服务函数草稿

```js
import { API_BASE_URL } from "../config/api";
import { estimateDrinkLocal } from "./drinkRules";

export function estimateDrinkSmart(form) {
  const localEstimate = estimateDrinkLocal(form);

  return requestAIEstimate(form, localEstimate)
    .then((estimate) => normalizeEstimate(estimate, localEstimate))
    .catch(() => localEstimate);
}

function requestAIEstimate(form, localEstimate) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/estimate-drink`,
      method: "POST",
      timeout: 12000,
      header: {
        "content-type": "application/json"
      },
      data: {
        form,
        localEstimate
      },
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data);
          return;
        }

        reject(new Error(`AI estimate failed: ${response.statusCode}`));
      },
      fail: reject
    });
  });
}

function normalizeEstimate(data, fallback) {
  const price = Number(data?.price);
  const calories = Number(data?.calories);
  const sugarGram = Number(data?.sugarGram);

  return {
    price: Number.isFinite(price) && price > 0 ? Math.round(price * 10) / 10 : fallback.price,
    calories: Number.isFinite(calories) && calories >= 0 ? Math.round(calories) : fallback.calories,
    sugarGram: Number.isFinite(sugarGram) && sugarGram >= 0 ? Math.round(sugarGram) : fallback.sugarGram,
    source: "AI智能估算",
    confidence: data?.confidence === "高" || data?.confidence === "中" || data?.confidence === "低" ? data.confidence : "中",
    explanation: data?.explanation || "由服务端 AI 根据饮品名、小料、杯型和糖量估算。数据为估算值，仅供参考。"
  };
}
```

## 小程序端验收

迁移后至少检查：

- `API_BASE_URL` 是 HTTPS。
- `API_BASE_URL` 不包含 `/api/estimate-drink`，服务函数里会拼接路径。
- 小程序代码里搜不到 `QWEN_API_KEY`。
- 真机请求不会报“url not in domain list”。
- 断网或 API 返回 500 时仍能显示本地估算。
- 估算结果仍显示“数据为估算值，仅供参考”。
