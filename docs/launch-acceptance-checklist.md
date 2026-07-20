# 上线后验收交接单

这份文件用于你完成 GitHub、Netlify 和微信小程序外部平台操作后，逐项确认公共链接和小程序 API 都能正常工作。

## 1. 基本信息

请上线后填写：

```text
GitHub 仓库地址：

Netlify 公共链接：

AI 接口链接：
https://你的站点.netlify.app/api/estimate-drink

公共 API 验证时间 verifiedAt：

微信小程序 AppID：

微信小程序版本号：

微信 request 合法域名保存时间：

真机预览测试时间：

真机测试手机/微信号备注：

提交审核日期：
```

不要把真实 `QWEN_API_KEY` 写进这份交接单。这里只记录链接、状态和日期。

上线前或上线后，都可以运行下面这条命令查看当前还缺哪些外部平台动作：

```powershell
npm run check:launch-handoff
```

如果已经双击过 `after-netlify.cmd` 或 `verify-public-api.cmd` 并且通过，本地会生成：

```text
.launch-state.json
```

打开它，把里面的 `publicUrl`、`apiUrl` 和 `verifiedAt` 抄到本交接单。这个 `.launch-state.json` 只保存在本机，并且已被 `.gitignore` 忽略，不会提交到 GitHub。

## 2. Netlify 部署验收

```text
[ ] GitHub 仓库已推送 main 分支
[ ] Netlify 已连接 GitHub 仓库
[ ] Netlify 最新 Production deploy 是 Published
[ ] Netlify build command 是 npm run build
[ ] Netlify publish directory 是 .next
[ ] Netlify 使用 Node 22
```

Netlify 环境变量：

```text
[ ] MILKTEA_AI_ENABLED=true
[ ] QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
[ ] QWEN_MODEL=xopqwen36v35b
[ ] QWEN_API_KEY 已填写，并标记为 secret
[ ] QWEN_API_TIMEOUT_MS=12000
[ ] MILKTEA_ALLOWED_ORIGINS=*
```

## 3. 公共网站验收

打开你的 Netlify 公共链接，逐项确认：

```text
[ ] 首页能打开
[ ] 底部导航能切换：首页、记录、数据、我的
[ ] 我的页面能看到 6 套 UI 风格按钮
[ ] 能切换到软糖奶茶
[ ] 能切换到黑白极简
[ ] 能切换到液态玻璃
[ ] 能切换到千禧甜心
[ ] 能切换到新粗野
[ ] 能切换到霓虹赛博
[ ] 每套风格切换后，页面背景、手机外框、卡片、按钮、底部导航、输入框、弹窗和 Toast 都跟随变化
[ ] UI 风格刷新后仍保留
[ ] 显示人物开关能关闭人物
[ ] 关闭人物后首页、记录页、数据页不再出现小人
[ ] 关闭人物后 Body Score 面板、Body Score 仪表、阶段进度和提交结果里的 Body Score 反馈不再出现
[ ] 重新打开人物后小人和人物相关部件恢复
[ ] 今天戒了可以提交记录
[ ] 今天喝了可以提交记录
[ ] 数据页能看到历史记录
[ ] 删除记录后统计重新计算
[ ] 清空记录需要二次确认
```

## 4. 公共 API 验收

### 4.1 浏览器检查

在浏览器打开：

```text
https://你的站点.netlify.app/api/estimate-drink
```

期望结果：

```text
[ ] 返回 JSON
[ ] ready 是 true
[ ] enabled 是 true
[ ] missing 是空数组
[ ] 页面里看不到 API Key
```

### 4.2 命令检查

在项目目录运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

更推荐双击 `after-netlify.cmd`，它会在公共 API 验证通过后更新微信模板，运行微信模板检查和烟测，然后写入 `.launch-state.json`；再运行 `check-status.cmd` 时就能看到公共链接和验证时间。只双击 `verify-public-api.cmd` 也会记录这份本地验收状态，但不会自动更新或检查微信模板。

记录结果：

```text
[ ] OPTIONS 预检通过
[ ] GET ready 状态通过
[ ] POST AI 估算通过
[ ] 返回 source 是 AI智能估算
[ ] 返回 price/calories/sugarGram 都是数字
[ ] 输出里没有 API Key
```

## 5. 微信小程序后台验收

在微信公众平台确认：

```text
[ ] 开发 -> 开发管理 -> 开发设置 -> 服务器域名 已打开
[ ] request 合法域名已添加 Netlify 根域名
[ ] 填的是 https://你的站点.netlify.app
[ ] 没有把 /api/estimate-drink 填进合法域名
[ ] 已保存成功，并截图或记录保存时间
```

## 6. 微信小程序代码验收

如果使用项目里的模板，先复制：

```text
templates/wechat-miniprogram/
```

检查小程序代码：

```text
[ ] config/api.js 里的 API_BASE_URL 已改成 Netlify 公共链接
[ ] API_BASE_URL 只包含根域名，不包含 /api/estimate-drink
[ ] services/aiEstimate.js 使用 wx.request
[ ] services/aiEstimate.js 请求 `${API_BASE_URL}${AI_ESTIMATE_PATH}`
[ ] 小程序代码里搜不到 QWEN_API_KEY
[ ] 小程序代码里搜不到 maas-api.cn-huabei-1.xf-yun.com
[ ] API 失败时会回退 estimateDrinkLocal
```

## 7. 微信开发者工具验收

```text
[ ] 微信开发者工具能编译项目
[ ] 正式上传前 AppID 已换成你的小程序 AppID，不再是 touristappid
[ ] 开发者工具里不依赖“不校验合法域名”也能请求
[ ] 预览二维码能在手机微信打开
[ ] 真机里能触发饮品估算
[ ] 真机调试或日志里请求的是 https://你的站点.netlify.app/api/estimate-drink
[ ] 真机里没有请求 maas-api.cn-huabei-1.xf-yun.com
[ ] 真机里能提交记录
[ ] 真机里断网或 API 失败时仍有本地估算兜底
[ ] 上传版本成功
```

## 8. 最终结论

全部通过后填写：

```text
网站公共链接是否可用：

网站 AI API 是否可用：

微信小程序真机 API 是否可用：

是否可以提交审核：

备注：
```

如果任何一项失败，先看：

```text
docs/deployment-troubleshooting.md
```
