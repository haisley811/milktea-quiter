# 微信小程序与 iOS 迁移准备清单

## 当前迁移状态

项目当前仍以 Web MVP 为主，但已经具备迁移准备：

- 核心数据结构集中在 `lib/types.ts`。
- 饮品估算规则集中在 `lib/drinkRules.ts` 和 `lib/aiEstimate.ts`。
- 统计计算集中在 `lib/stats.ts`。
- 提交、重置、手动估算覆盖集中在 `lib/appActions.ts`。
- 本地存储通过 `lib/storage.ts` 的 `StorageAdapter` 隔离。
- 平台差异通过 `lib/platformAdapters.ts` 建立能力表。
- UI 已验证 375、390、430 宽度约束，适合迁移成手机端页面。

## 不要直接搬的内容

- 不要把 `public/preview.html` 当作最终小程序代码直接复制。
- 不要把 Next.js 组件原样搬到 SwiftUI。
- 不要把 API Key 放进前端、小程序包或 iOS app bundle。
- 不要把 Web hover 当作移动端唯一反馈，迁移时要转成 pressed state 和触感反馈。

## 微信小程序第一步

建议新建小程序项目后按这个顺序迁移：

1. 建 `models/`：迁移 `DrinkRecord`、`AppStats`、`DrinkForm`、`DrinkEstimate`、饮品枚举。
2. 建 `services/`：迁移饮品估算、统计计算、提交记录、手动估算覆盖。
3. 建 `adapters/storage.ts`：实现 `StorageAdapter` 到 `wx.getStorageSync` / `wx.setStorageSync`。
4. 建四个 tab：首页、记录、数据、我的。
5. 把角色 PNG 放入小程序资源目录，保持 `stage-1` 到 `stage-5`、`blink`、`wave` 三类命名。
6. 用 `wx.vibrateShort` 或按钮 pressed class 做点击反馈。
7. AI 估算调用 Netlify 公共接口，失败时回退本地估算。

## 小程序 API 调用

小程序只调用你自己的 Netlify 后端：

```text
https://你的站点.netlify.app/api/estimate-drink
```

不要在小程序里调用 QWEN 原始接口，不要在小程序代码里保存 `QWEN_API_KEY`。

示例：

```js
function estimateDrinkFromApi(form, localEstimate) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://你的站点.netlify.app/api/estimate-drink",
      method: "POST",
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
        } else {
          reject(new Error(`API status ${response.statusCode}`));
        }
      },
      fail: reject
    });
  });
}
```

上线前必须在微信公众平台配置 `request 合法域名`：

```text
https://你的站点.netlify.app
```

详细操作见 `docs/deployment-runbook.md`。

可复制的服务层草稿见：

```text
docs/wechat-api-service-template.md
```

## iOS 第一步

建议先用 SwiftUI 做本地版：

1. 建 `Models`：`DrinkRecord`、`AppStats`、`DrinkForm`、`DrinkEstimate`。
2. 建 `Services`：`DrinkEstimator`、`StatsService`、`RecordService`。
3. 建 `Storage`：用 `UserDefaults` 保存 `milkTeaAppData`。
4. 建四个 `TabView` 页面：首页、记录、数据、我的。
5. 角色图片放入 Asset Catalog，按阶段读取。
6. 用 `UIImpactFeedbackGenerator` 做按钮反馈。
7. AI 估算走后端 HTTPS，并保留本地兜底。

## 必须保留的产品行为

- “今天戒了”提交后 Body Score -2。
- “今天喝了”提交后 Body Score +2。
- Body Score 限制在 0 到 100。
- 分数越低代表越轻盈。
- local data key 保持 `milkTeaAppData`，方便早期数据迁移。
- 估算结果必须显示“数据为估算值，仅供参考”。
- 自定义价格、热量、糖分手动编辑后，提交必须以手动值为准。
- 历史记录必须支持删除，并在删除后重算统计。
- 重置必须二次确认。
- API 失败时必须保留本地估算兜底。

## 迁移验收

微信小程序和 iOS 各自完成后，至少手动验证：

- 首次打开显示初始状态。
- 记录“今天戒了”后统计变化并持久保存。
- 记录“今天喝了”后统计变化并持久保存。
- 自定义饮品和小料能估算，AI 失败能回退本地规则。
- 手动编辑价格、热量、糖分后保存的是手动值。
- 删除历史记录后统计重新计算。
- 重置需要二次确认。
- 角色阶段图片、眨眼帧、挥手帧都能显示。
- 375、390、430 等窄屏宽度不遮挡按钮和底部导航。
