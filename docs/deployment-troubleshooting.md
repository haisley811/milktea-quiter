# 部署和 API 排障清单

这份文档用于出错后定位问题。正常部署步骤仍看：

```text
docs/deployment-runbook.md
```

## 1. GitHub 上传失败

上传前先运行：

```powershell
npm run check:github-ready
```

如果这一步失败，先修复输出里提到的忽略规则、必需文件或敏感内容。

如果双击 `connect-github.cmd` 后看到：

```text
GitHub connection or push failed.
```

优先检查：

1. GitHub 仓库是不是空仓库，不要提前添加 README、`.gitignore` 或 license。
2. 粘贴的仓库地址是不是 HTTPS 根地址，例如 `https://github.com/你的用户名/ill-quit-milktea.git`。
3. GitHub 登录是否走浏览器授权，不要在命令行里输入 GitHub 登录密码。
4. 本地是否还有未提交改动；如果有，先提交后再推送。

### 提示 `not a git repository`

说明当前目录还没有初始化 Git。进入项目目录后运行：

```powershell
cd "D:\文档\I‘ll quit milktea"
git init
git branch -M main
```

### 提示 `remote origin already exists`

说明已经加过远程仓库。先查看：

```powershell
git remote -v
```

如果地址不对，替换成 GitHub 给你的仓库地址：

```powershell
git remote set-url origin <你的仓库地址>
```

### 提示认证失败

优先用 GitHub Desktop 或 GitHub 网页重新登录。也可以用 GitHub CLI：

```powershell
gh auth login
```

然后再推送：

```powershell
git push -u origin main
```

### 提示 `getaddrinfo() thread failed to start`

这表示 Windows 当前会话的命令行 DNS 解析组件无法创建线程。它不是 GitHub 仓库不存在，也不是密码填错。

先这样处理：

1. 保存其他正在编辑的文件。
2. 打开 `D:\文档\I‘ll quit milktea`，双击 `repair-github-network.cmd`。
3. Windows 弹出管理员确认时，点击 `是`。
4. 黑色窗口显示 `Repair complete` 后，点击 `开始` -> 电源图标 -> `重启`。
5. 重启后先不要一次打开大量软件。
6. 打开 GitHub Desktop，点击 `Publish branch` 再试一次。

如果重启后仍失败，使用 GitHub Desktop 作为图形界面上传方式：

1. 浏览器打开 `https://desktop.github.com/`。
2. 点击 `Download for Windows`，下载完成后双击安装包。
3. 安装结束后打开 GitHub Desktop，点击 `Sign in to GitHub.com` 并在浏览器里完成登录。
4. 回到 GitHub Desktop，顶部菜单点击 `File` -> `Add local repository...`。
5. 点击 `Choose...`，选择 `D:\文档\I‘ll quit milktea`，再点击 `Add repository`。
6. 左下角确认当前分支显示为 `main`。
7. 点击顶部 `Repository` -> `Repository settings...` -> `Remote`。
8. 把远程地址填为 `https://github.com/haisley811/milktea-quiter.git`，点击 `Save`。
9. 点击窗口上方的 `Push origin`。
10. 浏览器打开仓库页面并刷新，看到 `app`、`components`、`package.json` 和 `netlify.toml` 就完成了。

如果 GitHub Desktop 同样显示网络错误，说明电脑的网络安全软件、代理或 Windows 网络组件仍在拦截 Git；保留报错截图后再继续处理，不要删除项目文件。

## 2. Netlify 构建失败

### 失败在 `npm install`

常见原因：

- Netlify 连接 GitHub 仓库失败。
- npm registry 临时不可用。
- `package.json` 格式错误。

先确认仓库里有：

```text
package.json
netlify.toml
app/
components/
lib/
```

然后在 Netlify 点 `Retry deploy`。

### 失败在 `npm run verify`

说明代码结构、文档或部署检查没有通过。打开 Netlify 日志，找到第一个 `AssertionError`，把那一段发给我。

### 失败在 `npm run build`

先看日志里有没有这些关键词：

- `Module not found`：通常是依赖没有安装或 import 路径写错。
- `Type error`：通常是 TypeScript 类型问题。
- `Environment Variable`：检查 Netlify 环境变量。
- `QWEN_API_KEY`：确认只放在 Netlify 环境变量里，不放进代码。

## 3. Netlify 页面能打开，但 API 不通

先打开：

```text
https://你的站点.netlify.app/api/estimate-drink
```

### `ready: false`

检查 Netlify 环境变量：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY=你的 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

改完后必须重新部署。

### `missing: ["QWEN_API_KEY"]`

说明 Netlify 没读到密钥。重新检查：

- 变量名必须是 `QWEN_API_KEY`。
- 不要多空格。
- 不要加中文冒号。
- 变量作用范围要覆盖 Production。

### POST 返回 413

说明请求体太大。当前公共 API 限制 16 KB。小程序端应减少饮品名、自定义小料或其他无关字段长度。

### POST 返回 500 或 504

可能是 QWEN 上游失败、超时或密钥不可用。先运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

把输出和 Netlify Functions 日志一起发给我。

如果窗口显示：

```text
Public API verification failed.
```

先按窗口列出的 4 项检查：链接是否是 Netlify 根链接、`/api/estimate-drink` 是否 `ready: true`、Netlify 环境变量是否和 `docs/netlify-env-copy-paste.md` 一致、改完变量后是否重新部署。

### `npm run verify:qwen-direct` 超时

说明本机到 QWEN 上游没有成功完成请求。按顺序检查：

1. 当前网络是否能访问：

```text
https://maas-api.cn-huabei-1.xf-yun.com/v2
```

2. QWEN 平台里的 API Key 是否仍然有效。
3. `QWEN_MODEL` 是否仍是你账号可用的模型。
4. 是否有额度、并发或区域限制。
5. 稍后重试：

```powershell
npm run verify:qwen-direct
```

如果本地直连一直超时，但 Netlify 公共 API 可用，则以 Netlify 验证结果为准。

## 4. 网站里一直显示本地估算

检查：

- Netlify API 状态是否 `ready: true`。
- 浏览器开发者工具 Network 里 `/api/estimate-drink` 是否返回 200。
- Netlify 环境变量里 `MILKTEA_AI_ENABLED` 是否是 `true`。
- 如果刚改过环境变量，是否重新部署。

本地估算兜底是正常保护，不代表记录功能坏了。

## 5. 小程序开发工具能请求，真机失败

重点检查微信公众平台：

```text
开发管理 -> 开发设置 -> 服务器域名 -> request 合法域名
```

必须添加：

```text
https://你的站点.netlify.app
```

注意：

- 只填域名，不要填 `/api/estimate-drink`。
- 必须是 HTTPS。
- 如果使用自定义域名，小程序后台也要填自定义域名。
- 修改合法域名后，重新打开开发工具或重新预览真机。

### 微信后台不接受 Netlify 默认域名

如果 `https://你的站点.netlify.app` 在微信公众平台无法保存，或者保存后真机仍然请求失败，说明这条小程序正式请求链路还没有验收通过。

不要这样做：

```text
把 QWEN_API_KEY 写进小程序
让小程序直接请求 maas-api.cn-huabei-1.xf-yun.com
在 request 合法域名里加 /api/estimate-drink
```

推荐处理：

1. 先保留 Netlify 公共链接作为网页版本。
2. 给 Netlify 绑定一个微信后台可保存、真机可请求的 HTTPS 自定义域名。
3. 或者把 `/api/estimate-drink` 代理/迁移到微信后台可接受的后端域名，例如腾讯云、微信云开发或你自己的后端。
4. 然后重新运行：

```text
after-netlify.cmd
```

或：

```text
set-wechat-api-url.cmd
check-wechat-template.cmd
```

## 6. 小程序里不要出现这些内容

正式提交前搜索小程序项目，确认没有：

```text
QWEN_API_KEY
maas-api.cn-huabei-1.xf-yun.com
Bearer
```

小程序只应该出现你的后端地址：

```text
https://你的站点.netlify.app/api/estimate-drink
```

## 7. 最小可用判断

满足下面几条，就可以继续小程序联调：

- Netlify 首页能打开。
- `https://你的站点.netlify.app/api/estimate-drink` 返回 `ready: true`。
- `npm run verify:public-api -- https://你的站点.netlify.app` 通过。
- 微信公众平台已添加 `request 合法域名`。
- 小程序真机能请求你的 Netlify 后端。
