# 平台适配说明

当前项目已经把核心业务逻辑和平台能力做了第一层隔离。迁移时优先保留 `lib` 下的纯逻辑模块，再替换 UI 和平台 API。

## 可直接复用的核心模块

- `lib/types.ts`：记录、统计、饮品表单和估算类型。
- `lib/defaultForm.ts`：默认表单状态。
- `lib/drinkRules.ts`：本地估算规则和预设饮品。
- `lib/aiEstimate.ts`：AI 估算 Provider 接口和失败兜底。
- `lib/appActions.ts`：提交记录、手动估算覆盖、重置动作。
- `lib/stats.ts`：统计、连续天数、最近 7 天趋势。
- `lib/storage.ts`：可替换存储适配层。
- `lib/character.ts`：角色阶段与图片路径规则。
- `lib/platformAdapters.ts`：平台能力、触感反馈、迁移替换表。

## Web

当前 Web 使用：

```text
localStorage key: milkTeaAppData
```

接口集中在 `lib/storage.ts` 的 `StorageAdapter`。保存和清理会返回 `StorageResult`，页面可以据此展示成功或失败反馈。

## 微信小程序

后续可把 `StorageAdapter` 映射为：

```ts
const wxStorage = {
  getItem: (key: string) => wx.getStorageSync(key) || null,
  setItem: (key: string, value: string) => wx.setStorageSync(key, value),
  removeItem: (key: string) => wx.removeStorageSync(key)
};
```

建议路径：

1. 先用小程序本地 storage 跑通 MVP。
2. 再接入登录，使用 `openid` 做用户隔离。
3. 最后把记录同步到云数据库或自有后端。
4. AI 估算只调用云函数或服务端 HTTPS 接口，不把 API Key 写进小程序包。

## iOS

iOS 本地版可以先映射到 `UserDefaults`。如果需要跨设备同步，再迁移到 iCloud、CloudKit 或自己的后端账号体系。

建议路径：

1. 先用 SwiftUI 做四个 Tab：首页、记录、数据、我的。
2. 把 `DrinkRecord`、`AppStats`、估算规则和统计规则翻译成 Swift model/service。
3. 使用 `UserDefaults` 或本地 JSON 文件保存 `milkTeaAppData`。
4. 使用 SwiftUI `Material`、卡片、按钮 pressed state、toast/alert 复刻现有交互。
5. AI 估算走服务端 HTTPS，不把 API Key 放进 app bundle。

## UI 映射

- Web hover 在移动端可映射为 pressed 触感反馈。
- `glass-card` 在不支持 blur 的平台上使用更高不透明度奶白背景。
- `estimate-pop`、弹窗进入、Toast 和 loading 可以用原生动画实现相同节奏。
- 估算卡片的“手动值高亮 / 恢复建议值”需要保留，这是核心状态反馈。
- 角色图片优先使用透明 PNG；眨眼和挥手是整张角色帧切换，不要叠加 DOM 图层。
