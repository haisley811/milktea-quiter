# 今天不喝

一个本地优先的软萌饮品记录与习惯养成网页 App。第一版使用 Next.js、TypeScript、Tailwind CSS 和 App Router，数据保存在浏览器 `localStorage`，固定 key 为 `milkTeaAppData`。

## 快速预览

无需安装依赖，可以直接打开：

```text
public/preview.html
```

如果希望用本地服务预览，并使用本地 API 兜底：

```powershell
npm run preview
```

然后打开：

```text
http://127.0.0.1:4173/
```

如果 PowerShell 当前停在 `C:\Users\10347>`，先进入项目目录：

```powershell
cd "D:\文档\I‘ll quit milktea"
npm run preview
```

也可以直接双击项目里的 `preview.cmd` 或 `启动预览.cmd`。

如果浏览器显示 `ERR_CONNECTION_REFUSED` 或“拒绝建立连接”，说明本地预览服务没有运行，或浏览器打开的是旧端口。请先双击 `preview.cmd`，看到窗口里出现 `Preview ready: http://127.0.0.1:4173/` 后不要关闭这个窗口，再回到浏览器刷新 `http://127.0.0.1:4173/`。

## Next 开发版

如果想在本机安装依赖、验证并构建，可以双击：

```text
install-local-deps.cmd
```

或者手动运行：

```powershell
npm install
npm run dev
```

默认地址通常是：

```text
http://localhost:3000
```

## API

当前 AI 估算接口是：

```text
/api/estimate-drink
```

QWEN API Key 只放在服务端环境变量里，不进入前端代码。接口不可用时会回退到本地估算。详细说明见：

```text
docs/qwen-api.md
```

## 验证

```powershell
npm run verify
npm run check:goal-status
npm run smoke:preview
```

`verify` 会检查核心估算规则、Body Score、角色阶段、图片资源、页面结构、交互标记、部署配置和 API 部署准备。`check:goal-status` 会按部署/API/UI/人物开关/外部上线验收输出当前完成状态。

也可以直接双击：

```text
check-status.cmd
```

如果你只想打开一个总入口，双击：

```text
launch-control.cmd
```

它会用数字菜单带你打开状态检查、GitHub 上传、Netlify 验收、微信模板检查、依赖安装、微信 AppID 设置、微信真机验收登记、需要你操作的事项和项目介绍。

如果你只想看哪些事情必须你亲自登录外部平台操作，双击：

```text
what-you-need-to-do.cmd
```

创建 GitHub 空仓库后，可以双击下面这个文件，粘贴 GitHub HTTPS 仓库地址并推送：

```text
connect-github.cmd
```

上线后验证公共 API 可以双击：

```text
verify-public-api.cmd
```

它验证通过后也会把公共链接记录到本地 `.launch-state.json`，供 `check-status.cmd` 读取。

Netlify 部署成功并拿到公共链接后，更推荐双击这个文件：

```text
after-netlify.cmd
```

它会先验证公共 API，通过后再自动更新微信小程序模板里的后端地址，并把公共链接记录到本地 `.launch-state.json` 供 `check-status.cmd` 读取。

拿到 Netlify 公共链接后，如果要更新微信小程序模板里的后端地址，可以双击：

```text
set-wechat-api-url.cmd
```

正式上传微信小程序前，如果要把模板里的 `touristappid` 换成你的正式 AppID，可以双击：

```text
set-wechat-appid.cmd
```

微信后台合法域名和真机预览都通过后，可以双击：

```text
mark-wechat-verified.cmd
```

把这次微信验收写进本地 `.launch-state.json`，供 `check-status.cmd` 读取。

更新后检查微信小程序模板可以双击：

```text
check-wechat-template.cmd
```

## 部署

醒来后先看这份总入口：

```text
launch-control.cmd
```

也可以直接打开文字手册：

```text
start-here.cmd
```

```text
docs/start-here-after-sleep.md
```

部署主线是 GitHub + Netlify：
```text
docs/deployment-runbook.md
```

0 代码基础上线操作手册：

```text
docs/zero-code-launch-manual.md
```

项目完整介绍（功能、特点、UI 和微交互）：

```text
docs/project-introduction.md
```

当前准备状态和已知限制：

```text
docs/deployment-prep-report.md
```

npm install 超时兜底手册：
```text
docs/dependency-install-fallback.md
```

GitHub 上传专项手册：
```text
docs/github-upload-manual.md
```

Netlify 部署专项手册：
```text
docs/netlify-deploy-manual.md
```

API 是否已经接入、上线后怎么验证：
```text
docs/api-integration-status.md
```

Netlify 环境变量复制模板：
```text
docs/netlify-env-copy-paste.md
```

上线完成后的验收交接单：

```text
docs/launch-acceptance-checklist.md
```

部署或 API 出错后的排障清单：

```text
docs/deployment-troubleshooting.md
```

手机测试和公开上线说明：

```text
docs/mobile-and-public-deploy.md
```

微信小程序和 iOS 迁移准备：

```text
docs/wechat-ios-readiness.md
```

小程序 API 服务层模板：

```text
docs/wechat-api-service-template.md
```

微信小程序上线专项手册：

```text
docs/wechat-mini-program-launch-manual.md
```

## 结构

```text
app/                 Next.js 页面入口、API 路由和全局样式
components/          可复用 UI 组件
components/views/    首页、记录、数据、我的
docs/                部署、迁移和设计说明
lib/                 类型、估算、统计、角色、存储适配
public/images/       角色图片
public/preview.html  无依赖本地预览页
scripts/             离线验证和静态预览服务
```

后续迁移到微信小程序或 iOS 时，优先保留 `lib/` 中的规则层，再替换 UI 和存储适配。
