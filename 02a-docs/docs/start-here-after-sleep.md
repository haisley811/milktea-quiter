# 醒来后先看这里

更新时间：2026-07-14

这份文件是给 0 代码基础使用的总入口。你不用先读完整个项目，只要按这里的顺序做。

如果你不想先打开命令行，可以在项目文件夹里双击总入口：

```text
launch-control.cmd
```

它会显示数字菜单，你可以直接选择：

```text
1 查看当前状态
2 打开这份醒来手册
3 连接 GitHub 并推送
4 Netlify 部署后验证 API 并更新微信模板
5 重试本机依赖安装、验证和构建
6 检查微信小程序 API 模板
7 打开需要你亲自操作的事项
8 打开项目介绍
9 打开排障手册
A 打开 0 代码完整上线手册
L 只生成 package-lock.json
E 打开 Netlify 环境变量复制模板
I 打开 API 接入状态说明
C 打开上线后验收交接单
D 设置微信小程序正式 AppID
W 记录微信合法域名和真机预览验收
P 打开静态预览
```

如果你只想看我还需要你亲自做哪些外部平台操作，可以直接双击：

```text
what-you-need-to-do.cmd
```

它会打开：

```text
docs/user-action-items-after-sleep.md
```

如果你只想打开这份文字手册，也可以双击：

```text
start-here.cmd
```

它会用 Windows 记事本打开这份手册。

如果你想让电脑告诉你“现在完成到哪一步”，在 PowerShell 里运行：

```powershell
npm run check:goal-status
```

或者直接双击：

```text
check-status.cmd
```

结果里的 `localImplementationReady: true` 表示本地代码、API、UI 风格和隐藏人物功能已经准备好；`externalLaunchVerified: false` 表示还需要你登录 GitHub、Netlify 和微信后台完成外部上线验收。

## 当前结论

项目代码已经准备好，网站也已经接入 API。

已经完成：

1. 网站页面、记录功能、数据页、我的页面已完成。
2. 已加入 6 套 UI 风格：软糖奶茶、黑白极简、液态玻璃、千禧甜心、新粗野、霓虹赛博。
3. 已加入 `显示人物` 开关，关闭后会隐藏小人、Body Score、阶段进度和人物相关状态组件。
4. 已接入后端 API：`/api/estimate-drink`。
5. 后端 API 会在服务端调用 QWEN，不会把 `QWEN_API_KEY` 放到前端或小程序。
6. 已准备 GitHub、Netlify、微信小程序接入文档和小程序 API 模板。
7. 本地项目验证 `npm run verify` 已通过。

还没有完成：

1. 还没有创建 GitHub 远程仓库。
2. 还没有上传到 GitHub。
3. 还没有部署到 Netlify，所以还没有公共链接。
4. 还没有在 Netlify 填环境变量。
5. 还没有在微信公众平台添加 request 合法域名。
6. 当前机器多次 `npm install` 联网下载超时，所以还没有 `node_modules` 和 `package-lock.json`。

这不是代码没做完，而是需要登录外部平台完成的上线动作。

如果你醒来后本机 `npm install` 仍然卡住，看这一份：

```text
docs/dependency-install-fallback.md
```

如果你想重试本机安装依赖，可以双击：

```text
install-local-deps.cmd
```

它会自动运行安装、验证和构建。失败也不影响继续走 GitHub + Netlify 上线主线。

如果你只是想确认本机 npm 网络是不是通的，可以双击：

```text
check-npm-network.cmd
```

它不会安装依赖，只会检查当前 npm registry 和官方 npm registry 是否能连上。

如果你只想先生成 `package-lock.json`，不想完整安装 `node_modules/`，可以双击：

```text
generate-package-lock.cmd
```

它会运行 `npm install --package-lock-only --ignore-scripts`。如果仍然超时，也可以继续走 GitHub + Netlify，让 Netlify 云端安装依赖。

## 你要按什么顺序做

### 第 1 步：打开 0 代码上线手册

先打开：

```text
docs/zero-code-launch-manual.md
```

这份是最详细的手把手操作文档，里面写到每一步点哪里。

你要从里面的第 1 部分开始做：

```text
第 1 部分：把项目上传到 GitHub
```

### 第 2 步：创建 GitHub 空仓库

如果你只想看 GitHub 上传这一步，打开专项手册：

```text
docs/github-upload-manual.md
```

按手册创建一个空仓库。仓库名建议：

```text
ill-quit-milktea
```

创建时不要勾选：

```text
Add a README file
Add .gitignore
Choose a license
```

创建成功后复制 GitHub 给你的 HTTPS 仓库地址，类似：

```text
https://github.com/你的用户名/ill-quit-milktea.git
```

### 第 3 步：把本地项目连接到 GitHub

最简单方式：回到项目文件夹，双击：

```text
connect-github.cmd
```

然后粘贴刚才复制的 GitHub HTTPS 仓库地址。它会自动设置 `origin` 并推送 `main`。

如果双击脚本没有成功，再使用下面的手动方式。

在这个项目文件夹里打开 PowerShell，然后运行：

```powershell
git remote add origin https://github.com/你的用户名/ill-quit-milktea.git
git push -u origin main
```

注意：上面地址要换成你自己的 GitHub 仓库地址。

如果第一行提示 `remote origin already exists`，就改用：

```powershell
git remote set-url origin https://github.com/你的用户名/ill-quit-milktea.git
git push -u origin main
```

### 第 4 步：用 Netlify 连接 GitHub 仓库

如果你只想看 Netlify 部署这一步，打开专项手册：

```text
docs/netlify-deploy-manual.md
```

进入 Netlify，选择从 GitHub 导入项目。按手册里的 Netlify 部分操作。

Netlify 构建设置保持：

```text
Build command: npm run verify && npm run build
Publish directory: .next
```

如果 Netlify 自动识别为 Next.js 项目，保持默认即可。

### 第 5 步：在 Netlify 填环境变量

在 Netlify 的环境变量页面填：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY=你的真实 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

如果你担心填错变量名，打开这一份逐项复制：

```text
docs/netlify-env-copy-paste.md
```

只把真实密钥填在 Netlify。不要把真实 `QWEN_API_KEY` 发到 GitHub，不要写进微信小程序。

### 第 6 步：部署并拿公共链接

Netlify 部署成功后，你会得到类似这样的链接：

```text
https://你的站点.netlify.app
```

把这个链接保存下来。后面网站访问和微信小程序 API 都要用它。

### 第 7 步：验证公共 API

拿到 Netlify 链接后，最简单方式是直接双击：

```text
after-netlify.cmd
```

然后粘贴你的 Netlify 公共链接。它会先验证公共 API，通过后自动更新微信小程序模板里的 `API_BASE_URL`，再运行微信模板检查和烟测，最后在本地写入 `.launch-state.json` 记录这次公共 API 已通过验收。

如果你只想单独验证公共 API，也可以在 PowerShell 里运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

或者双击：

```text
verify-public-api.cmd
```

然后粘贴你的 Netlify 公共链接。
这个文件验证通过后也会写入 `.launch-state.json`，所以之后双击 `check-status.cmd` 能看到公共 API 已验收。

如果通过，说明公共 API 可以真实调用。

公共 API 地址是：

```text
https://你的站点.netlify.app/api/estimate-drink
```

### 第 8 步：配置微信小程序合法域名

如果你要上线微信小程序，先打开这一份专项手册：

```text
docs/wechat-mini-program-launch-manual.md
```

进入微信公众平台，找到：

```text
开发管理 -> 开发设置 -> 服务器域名 -> request 合法域名
```

添加 Netlify 根域名：

```text
https://你的站点.netlify.app
```

注意：这里只填根域名，不要填 `/api/estimate-drink`。

### 第 9 步：接入小程序 API 模板

可复制的小程序模板在：

```text
templates/wechat-miniprogram/
```

拿到 Netlify 公共链接后，可以直接双击：

```text
after-netlify.cmd
```

如果你已经单独验证过公共 API，只想更新小程序模板，也可以双击：

```text
set-wechat-api-url.cmd
```

它们会自动更新：

```text
templates/wechat-miniprogram/config/api.js
```

小程序只请求：

```text
https://你的站点.netlify.app/api/estimate-drink
```

不要在小程序里保存 `QWEN_API_KEY`。

正式上传审核前，还需要把模板里的临时 `touristappid` 换成你自己的正式小程序 AppID。最简单方式是双击：

```text
set-wechat-appid.cmd
```

或者双击 `launch-control.cmd` 后按 `D`。粘贴形如 `wx1234567890abcdef` 的 AppID 后，它会自动更新：

```text
templates/wechat-miniprogram/project.config.json
```

## 如果你只想看一份详细文档

看这一份：

```text
docs/zero-code-launch-manual.md
```

它是最详细的上线步骤手册。

## 如果你要介绍这个项目

看这一份：

```text
docs/project-introduction.md
```

里面介绍了全部功能、虚拟下单、会变化体型的小人、AI 估算热量糖分价格、多套 UI 风格、微交互和部署方式。

## 如果你只想确认 API 到底有没有接

看这一份：

```text
docs/api-integration-status.md
```

结论是：已经接入，接口是 `/api/estimate-drink`，上线后公共地址是 `https://你的站点.netlify.app/api/estimate-drink`。

## 如果出错了

先看：

```text
docs/deployment-troubleshooting.md
```

常见问题包括：

1. GitHub push 失败。
2. Netlify 构建失败。
3. API 返回 `ready: false`。
4. 微信小程序真机请求失败。
5. 本机 `npm install` 下载超时。

## 当前最重要的提醒

1. 真实 `QWEN_API_KEY` 只放在 Netlify 环境变量里。
2. 微信小程序只请求 Netlify 后端，不直接请求 QWEN。
3. 微信合法域名只填根域名，不填接口路径。
4. Netlify 公共链接出来后，一定双击 `after-netlify.cmd` 验证公共 API、更新微信模板、运行微信模板检查，并让 `.launch-state.json` 记住公共链接。
5. 如果本机 `npm install` 继续超时，可以先让 Netlify 云端安装依赖和构建。
