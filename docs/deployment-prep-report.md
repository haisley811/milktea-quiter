# 部署准备检查报告

更新时间：2026-07-14

## 已完成

- 已添加 Netlify 配置：`netlify.toml`。
- 已添加 Git 属性文件：`.gitattributes`，用于稳定文本换行和图片二进制处理。
- 已添加 GitHub 上传前体检命令：`npm run check:github-ready`。
- 已初始化本地 Git 仓库，并创建首个提交：`Prepare GitHub and Netlify deployment`。
- 已锁定 Node 版本：`package.json` 的 `engines.node` 和 `.nvmrc` 都使用 Node 22。
- 已添加 GitHub Actions：`.github/workflows/verify.yml`。
- 已扩展项目校验：`npm run verify` 现在会额外执行 `verify:deploy`。
- 已添加本地 QWEN 环境变量体检命令：`npm run check:qwen-env`，不会打印 API Key。
- 已添加 QWEN 上游直连检查命令：`npm run verify:qwen-direct`，可验证密钥和模型接口是否真实可用。
- 已添加真实 API 检查命令：`npm run verify:api-live`，填好 QWEN API Key 后可手动运行。
- 已添加公共 API 检查命令：`npm run verify:public-api -- https://你的站点.netlify.app`，Netlify 部署成功后可手动运行。
- 已让 `/api/estimate-drink` 支持 `GET`、`POST`、`OPTIONS`。
- 已给 API 响应加上跨端调用所需响应头，方便未来小程序调用公共 HTTPS API。
- 已给公共 API 加请求体大小限制，并清洗超长饮品名、小料列表和自定义小料。
- 已确认 API Key 仍只从服务端环境变量读取，不会返回给前端。
- 已把部署说明改成 GitHub + Netlify 主线。
- 已补充微信小程序合法域名和 API 调用说明。

## 已通过的检查

```text
npm run verify
```

包含：

- 核心估算规则检查。
- 项目结构和资源检查。
- 响应式约束检查。
- 部署准备检查。

也已额外检查：

- 没有发现旧部署平台说明残留。
- 没有发现旧预览端口残留。
- 没有发现明文 QWEN API Key。
- 没有发现中文乱码命中。
- `public/preview.html` 内联脚本语法正常。

## 尚未完成的本机检查

```text
npm run build
```

当前没有完成，原因是本机 `node_modules` 不存在，`npm install` 多次联网下载超时，没有成功安装 Next.js 依赖。

尝试过 `npm install --package-lock-only`，也因为联网下载超时，没有生成 `package-lock.json`。

```text
npm run verify:api-live
```

当前 Codex 沙盒里也没有完成，原因是本环境拒绝连接临时本机地址 `127.0.0.1:4173`。这条命令仍适合你在普通 PowerShell 里运行，用来检查 `.env.local`、本地临时后端和 QWEN API 是否真实可用。

```text
npm run verify:qwen-direct
```

这条命令用于绕过本地端口，直接检查 QWEN 上游接口。当前 Codex 环境已尝试运行，结果是 `QWEN API 请求超时`。这说明当前环境到 QWEN 上游没有成功完成请求；你醒来后需要在普通 PowerShell 里重新运行同一条命令。如果仍然超时，再检查 QWEN 平台、网络和 API Key 权限。

这不代表 Netlify 一定会失败。Netlify 会在云端重新执行依赖安装和构建；但为了更稳，建议你醒来后先按 `docs/deployment-runbook.md` 的第 1 步在本机再试一次：

```powershell
npm install
npm run verify
npm run check:github-ready
npm run build
```

如果本地网络仍然下载失败，可以直接走 GitHub + Netlify，让 Netlify 在云端安装依赖。部署后以 Netlify 的构建结果为准。

## 部署后一定要做的检查

Netlify 给出公开网址后，运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

这一步需要真实公共网址，所以现在不能在本地提前完成。

## 你醒来后主要看这一份

```text
docs/deployment-runbook.md
```

里面列了你需要亲自操作的 GitHub、Netlify、环境变量、公共 API 验证和微信小程序合法域名步骤。

现在 GitHub 部分只剩下：在 GitHub 网页创建远程仓库，然后运行 `git remote add origin <你的仓库地址>` 和 `git push -u origin main`。

如果部署或 API 验证报错，看：

```text
docs/deployment-troubleshooting.md
```

## 2026-07-14 追加检查

本轮继续为 GitHub、Netlify 和微信小程序部署做准备，同时新增了 UI 风格切换和隐藏人物选项。

已完成：

- 新增 6 套可切换 UI 风格：软糖奶茶、黑白极简、液态玻璃、千禧甜心、新粗野、霓虹赛博。
- 新增 `显示人物` 开关，关闭后会隐藏小人、Body Score、阶段进度和人物相关状态部件。
- 新增本地 UI 偏好存储：`milkTeaUiPreferences`。
- `public/preview.html` 已同步支持 6 套 UI 风格切换和隐藏人物开关，未安装依赖时也能预览这些功能。
- 新增可复制的小程序 API 接入模板：`templates/wechat-miniprogram/`，并加入 `npm run verify:wechat-template` 检查，确保模板只调用 Netlify 后端、不包含 QWEN API Key。
- 新增上线后验收交接单：`docs/launch-acceptance-checklist.md`，用于记录 Netlify 公共链接、公共 API 验证和微信小程序真机 API 验收。
- 强化 `npm run check:github-ready`：除了确认 `.gitignore` 规则存在，还会检查 Git 实际跟踪文件，防止 `.env.local`、`.netlify/`、`.next/`、`node_modules/`、`shots/`、`.launch-state.json`、预览日志和错误日志被误推到 GitHub。
- 新增 `.npmrc`：本机、GitHub Actions 和 Netlify 安装依赖时默认使用更长 npm 下载超时、更多重试，并关闭构建无关的 `audit`、`fund` 输出。
- `npm run verify` 已通过，覆盖核心规则、项目结构、响应式约束和部署准备检查。

官方文档复核：

- Netlify 官方文档说明 Next.js 通过 OpenNext adapter 支持主要 Next.js 能力，并且对 Next.js 13.5+ 是零配置支持。
- Netlify 官方文档说明 App Router、Route Handlers/API routes 都是 Full Support。
- Netlify 官方文档不建议固定旧适配器版本；当前项目没有添加 `@netlify/plugin-nextjs` 固定版本，保持由 Netlify 自动使用最新适配器。
- `netlify.toml` 使用 `npm run build`、`.next` 和 Node 22 配置；完整项目检查仍在本地运行 `npm run verify`，敏感环境变量仍通过 Netlify UI 填写，不写入仓库。

仍受当前环境限制的检查：

```powershell
npm install
npm install --package-lock-only --ignore-scripts --prefer-offline
```

以上两条在当前 Codex 环境里都因为 npm registry 联网下载超时而失败，没有生成 `node_modules`，也没有生成 `package-lock.json`。

因此下面这条也无法在当前环境完成：

```powershell
npm run build
```

失败原因是 `next` 依赖没有安装，终端提示 `next is not recognized`。这不是新 UI 代码已经被证明有语法错误，而是本机依赖没有成功安装。你醒来后如果网络正常，优先重新运行：

```powershell
npm install
npm run verify
npm run build
```

如果本机仍然安装超时，可以先推送到 GitHub，让 Netlify 在云端执行依赖安装和构建，再以 Netlify 的构建日志为准。
