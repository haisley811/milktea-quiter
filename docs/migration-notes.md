# 迁移说明

第一版把规则层和界面层分开，方便后续迁移。

## 可直接复用

- `lib/types.ts`：核心数据类型。
- `lib/drinkRules.ts`：饮品估算、本地预设、杯型、糖量和小料计算。
- `lib/stats.ts`：统计重算、连续天数、今日摘要和最近 7 天趋势。
- `lib/character.ts`：Body Score 五阶段、状态文案和图片路径。
- `lib/designTokens.ts`：颜色、圆角、阴影和动效时长。

## 需要替换

- `components/` 和 `components/views/`：迁移到小程序或 iOS 原生 UI。
- `lib/storage.ts`：当前是 localStorage 适配层，后续替换为小程序 storage、云存储或 iOS 本地存储。
- `public/preview.html`：只是无依赖本地预览页，不作为正式跨端代码。

## 建议顺序

1. 先迁移 `lib/` 纯逻辑。
2. 再替换存储端口。
3. 最后重做 UI 组件，并按 `docs/design-system.md` 保留视觉和交互标准。
