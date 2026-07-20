# Netlify 部署专项手册

更新时间：2026-07-14

这份文件只讲第二步：把 GitHub 仓库部署到 Netlify，并拿到公共链接。

在做这一步之前，你需要先完成：

```text
docs/github-upload-manual.md
```

也就是 GitHub 仓库里已经能看到项目文件。

## 当前项目的 Netlify 配置

项目已经有：

```text
netlify.toml
```

里面已经配置好：

```text
Build command: npm run build
Publish directory: .next
Node version: 22
```

所以在 Netlify 页面里如果看到相同设置，保持不改。

Netlify 官方文档说明，连接 Git 仓库后，Netlify 会在你 push 到 Git 仓库时运行构建命令并部署结果。Next.js 项目会通过 Netlify 的 Next.js 支持进行构建和运行。

## 第 1 步：登录 Netlify

1. 打开浏览器。
2. 进入：

```text
https://app.netlify.com/
```

3. 点击 `Log in`。
4. 推荐选择 `Log in with GitHub`。
5. 如果 GitHub 弹出授权页面，点击同意或授权。

## 第 2 步：新建站点

1. 登录后进入 Netlify 控制台。
2. 找到 `Add new site`。
3. 点击 `Add new site`。
4. 选择 `Import an existing project`。
5. 代码来源选择 `GitHub`。
6. 如果页面要求安装或授权 Netlify GitHub App，按页面提示同意。
7. 在仓库列表里选择：

```text
ill-quit-milktea
```

如果看不到仓库：

1. 回 GitHub 确认项目已经 push 成功。
2. 回 Netlify 重新授权 GitHub。
3. 如果 Netlify 让你选择仓库权限，选择 `Only select repositories` 后勾选 `ill-quit-milktea`。

## 第 3 步：确认构建设置

Netlify 可能会自动识别项目。

请确认这些设置：

```text
Build command: npm run build
Publish directory: .next
Production branch: main
```

如果页面有 Node 版本设置，使用：

```text
22
```

如果页面没有 Node 版本设置也没关系，项目的 `netlify.toml` 已经写了：

```text
NODE_VERSION = "22"
```

## 第 4 步：先填环境变量

在第一次正式部署前，建议先填环境变量。

打开这一份逐项复制：

```text
docs/netlify-env-copy-paste.md
```

必须填：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY 这一项的值填你的真实 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

真实 `QWEN_API_KEY` 只填在 Netlify，不要提交到 GitHub。

如果你已经先部署了，也可以部署后再填变量。填完变量后一定要重新部署一次。

## 第 5 步：点击部署

配置确认后，点击类似按钮：

```text
Deploy
Deploy site
```

Netlify 会开始安装依赖和构建。

## 第 6 步：查看构建日志

进入：

```text
Deploys -> 最新一次 deploy -> Deploy log
```

重点找这些内容：

```text
npm install
npm run verify
npm run build
next build
Published
```

如果看到 `Published`，说明部署成功。

如果失败，先看：

```text
docs/deployment-troubleshooting.md
docs/dependency-install-fallback.md
```

本机没有 `package-lock.json` 时，Netlify 仍然可能在云端成功安装依赖。以 Netlify 的 deploy log 为准。

## 第 7 步：复制公共链接

部署成功后，Netlify 会给你一个公共链接，类似：

```text
https://xxxx.netlify.app
```

保存这个链接。

网站首页是：

```text
https://xxxx.netlify.app
```

AI API 是：

```text
https://xxxx.netlify.app/api/estimate-drink
```

## 第 8 步：检查 API 状态

在浏览器打开：

```text
https://xxxx.netlify.app/api/estimate-drink
```

应该看到 JSON。

重点看：

```text
ready: true
enabled: true
missing: []
```

如果 `ready` 是 `false`，通常是 Netlify 环境变量没填好，尤其是 `QWEN_API_KEY`。

## 第 9 步：运行公共 API 验证

最简单方式：回到项目文件夹，双击：

```text
after-netlify.cmd
```

然后粘贴你的 Netlify 公共链接。它会做四件事：

1. 验证公共 API 是否能真实调用。
2. 如果验证通过，自动更新微信小程序模板里的 `API_BASE_URL`。
3. 更新后立刻运行微信小程序模板检查和烟测，确认模板只请求 Netlify 后端、没有 QWEN Key、失败时能回退本地估算。
4. 把公共链接和验证时间写入本地 `.launch-state.json`，以后双击 `check-status.cmd` 就能看到这次验收记录。

如果你只想单独验证 API，也可以在 PowerShell 里运行：

```powershell
npm run verify:public-api -- https://xxxx.netlify.app
```

把 `https://xxxx.netlify.app` 换成你自己的 Netlify 公共链接。

如果你不想敲命令，也可以直接双击：

```text
verify-public-api.cmd
```

然后把 Netlify 公共链接粘贴进去。这个文件验证通过后也会写入 `.launch-state.json`，所以之后双击 `check-status.cmd` 能看到公共 API 已验收。

通过后说明：

1. 公共 HTTPS 地址能访问。
2. `GET /api/estimate-drink` 返回 ready。
3. `OPTIONS` 预检正常。
4. `POST` 能完成一次 AI 估算。

如果验证失败，窗口会显示 `Public API verification failed`，并列出优先检查项。最常见的是：

1. 粘贴的不是 Netlify 根链接，或链接里多了别的路径。
2. Netlify 环境变量没填完整，尤其是 `QWEN_API_KEY`。
3. 填完环境变量后没有重新部署。
4. QWEN Key、模型、额度或上游接口暂时不可用。

先按窗口提示和 `docs/deployment-troubleshooting.md` 修好，再重新运行 `after-netlify.cmd`。

## 第 10 步：更新状态

如果你用过 `after-netlify.cmd`，这一步通常不需要手动做，因为它已经写入了 `.launch-state.json`。

如果你只是想临时让本地状态检查知道公共链接，也可以在 PowerShell 里运行：

```powershell
$env:PUBLIC_API_BASE_URL="https://xxxx.netlify.app"
npm run check:goal-status
```

注意这只是当前 PowerShell 窗口里的临时变量，不会提交到 GitHub。

## 完成后下一步

Netlify 公共 API 验证通过后，继续微信小程序配置：

```text
docs/wechat-mini-program-launch-manual.md
```
