# 今天不喝：0 代码基础上线操作手册

更新时间：2026-07-14

这份手册写给完全没有代码基础的人。你只需要按顺序操作，不需要理解代码。目标有两个：

1. 把网站上线，拿到一个所有人都能打开的公共链接。
2. 让微信小程序可以调用同一个后端 AI 接口。

当前项目已经准备好了 GitHub、Netlify 和微信小程序接入需要的代码。你需要亲自完成的部分主要是：登录账号、复制链接、粘贴环境变量、在微信后台填合法域名。

## 先看结论

推荐上线路线：

1. 把本地项目上传到 GitHub。
2. 在 Netlify 里连接这个 GitHub 仓库。
3. 在 Netlify 里填写 QWEN API Key 等环境变量。
4. 点 Deploy，上线后得到 `https://xxx.netlify.app` 这样的公共链接。
5. 在微信小程序后台把这个 Netlify 域名加入 `request 合法域名`。
6. 小程序代码只请求 `https://xxx.netlify.app/api/estimate-drink`，不要把 QWEN API Key 放进小程序。

你最后会得到：

```text
网站公共链接：
https://你的网站名.netlify.app

AI 接口链接：
https://你的网站名.netlify.app/api/estimate-drink
```

## 你需要提前准备什么

请准备好这几样东西：

1. GitHub 账号：用于存放项目代码。
2. Netlify 账号：用于把网站变成公共链接。
3. QWEN API Key：用于 AI 估算热量、糖分、价格。
4. 微信小程序账号：用于发布微信小程序。
5. 微信开发者工具：用于预览、上传小程序。

如果你还没有这些账号，先注册。注册时用你常用邮箱和手机号，密码保存好。

## 第 1 部分：把项目传到 GitHub

GitHub 是放代码的地方。Netlify 会从 GitHub 读取项目，然后自动上线。

### 1.1 登录 GitHub

1. 打开浏览器。
2. 进入 [GitHub](https://github.com/)。
3. 点击右上角 `Sign in`。
4. 输入账号和密码。
5. 如果出现验证码或二次验证，按页面提示完成。

### 1.2 新建一个空仓库

1. 登录后，看页面右上角。
2. 点击右上角的 `+` 加号。
3. 在下拉菜单里点击 `New repository`。
4. 找到 `Repository name` 输入框。
5. 输入仓库名，例如：

```text
ill-quit-milktea
```

6. `Description` 可以填：

```text
今天不喝：奶茶记录与轻体习惯养成网站
```

7. `Public / Private` 选择：
   - 想让别人看到代码：选 `Public`
   - 不想让别人看到代码：选 `Private`
8. 下面这些选项都不要勾：
   - `Add a README file`
   - `Add .gitignore`
   - `Choose a license`
9. 点击页面底部的 `Create repository`。

注意：这里一定要建空仓库。项目里已经有 README 和 .gitignore，如果 GitHub 也自动生成，后面可能会冲突。

### 1.3 复制 GitHub 仓库地址

创建成功后，GitHub 会进入一个新页面。

1. 找到 `Quick setup` 区域。
2. 确认上方选中的是 `HTTPS`，不是 `SSH`。
3. 复制类似下面的地址：

```text
https://github.com/你的用户名/ill-quit-milktea.git
```

下面的命令里，凡是看到 `你的 GitHub 仓库地址`，都要替换成你刚复制的地址。

### 1.4 打开项目文件夹里的终端

1. 打开 Windows 文件资源管理器。
2. 进入这个项目文件夹：

```text
D:\文档\I‘ll quit milktea
```

3. 在文件夹空白处按住 `Shift`，同时点击鼠标右键。
4. 点击 `在终端中打开` 或 `Open in Terminal`。
5. 如果打开的是 PowerShell，看到命令行窗口就对了。

如果你不知道自己是不是在正确位置，可以复制下面这行并按回车：

```powershell
pwd
```

正确时，屏幕里应该能看到：

```text
D:\文档\I‘ll quit milktea
```

### 1.5 先做一次上传前检查

在终端里复制下面这行，按回车：

```powershell
npm run check:github-ready
```

如果看到类似 `GitHub ready`、`ready`、`passed` 的字样，继续下一步。如果看到错误，把错误截图或复制下来，先看本文最后的“常见问题”。

如果输出里看到：

```text
"forbiddenTrackedFiles": []
```

说明 `.env.local`、`node_modules/`、`.next/`、`.netlify/`、日志和本地验收状态没有被 Git 跟踪，不会被误传到 GitHub。

你也可以运行下面这行查看“还需要你亲自做哪些外部平台动作”：

```powershell
npm run check:launch-handoff
```

它会列出 GitHub 远程仓库、Netlify 公共链接、环境变量、微信合法域名等待你填写或操作的项目。

### 1.6 连接 GitHub 仓库

最简单方式：

1. 回到项目文件夹。
2. 双击：

```text
connect-github.cmd
```

3. 粘贴刚才复制的 GitHub HTTPS 仓库地址。
4. 按回车。
5. 如果弹出 GitHub 登录授权窗口，按提示登录并授权。

如果这个方式成功，可以跳到 1.8 检查上传结果。

手动方式如下。

复制下面这行，把最后的地址替换成你自己的 GitHub 仓库地址，然后按回车：

```powershell
git remote add origin 你的 GitHub 仓库地址
```

举例：

```powershell
git remote add origin https://github.com/yourname/ill-quit-milktea.git
```

如果提示 `remote origin already exists`，说明之前已经连过一个地址。改用下面这行：

```powershell
git remote set-url origin 你的 GitHub 仓库地址
```

### 1.7 上传代码

复制下面这行并按回车：

```powershell
git push -u origin main
```

第一次上传时，GitHub 可能会弹出登录窗口：

1. 点击 `Sign in with your browser` 或类似按钮。
2. 浏览器打开 GitHub 后，点击授权。
3. 回到终端等待上传完成。

上传成功后，终端里通常会出现类似：

```text
branch 'main' set up to track 'origin/main'
```

### 1.8 在 GitHub 网页确认上传成功

1. 回到浏览器里的 GitHub 仓库页面。
2. 刷新页面。
3. 如果看到这些文件或文件夹，说明成功：
   - `app`
   - `components`
   - `lib`
   - `docs`
   - `package.json`
   - `netlify.toml`

## 第 2 部分：用 Netlify 上线网站并拿公共链接

Netlify 是托管网站的平台。它会自动安装依赖、构建项目、发布网站。

### 2.1 登录 Netlify

1. 打开 [Netlify](https://app.netlify.com/)。
2. 点击 `Log in`。
3. 推荐选择 `Log in with GitHub`。
4. 如果 GitHub 弹出授权页面，点击 `Authorize Netlify` 或同意授权。

### 2.2 新建网站项目

Netlify 页面文案可能会轻微变化，找意思相近的按钮即可。

1. 进入 Netlify 后，找到 `Add new project`。
2. 点击 `Add new project`。
3. 点击 `Import an existing project`。
4. 在代码来源里选择 `GitHub`。
5. 如果要求安装 Netlify GitHub App，点击 `Install` 或 `Configure Netlify on GitHub`。
6. 选择你的 GitHub 账号。
7. 在仓库列表里找到并选择：

```text
ill-quit-milktea
```

如果看不到仓库：

1. 点击 GitHub 授权设置里的 `Configure`。
2. 选择 `Only select repositories`。
3. 勾选 `ill-quit-milktea`。
4. 保存后回到 Netlify 重新选择。

### 2.3 检查构建设置

进入构建设置页面后，确认这些值：

```text
Branch to deploy:
main

Build command:
npm run verify && npm run build

Publish directory:
.next
```

这个项目已经有 `netlify.toml`，Netlify 通常会自动识别。如果页面上已经填好了，不要乱改；如果没填，就按上面填。

### 2.4 填写 AI 环境变量

环境变量是给服务器看的秘密配置。最重要的是：QWEN API Key 只能放在 Netlify，不能写进网页，也不能写进微信小程序。

在 Netlify 导入项目页面里，找到 `Environment variables`、`Add environment variables` 或类似区域。

逐条添加下面这些：

| Key | Value |
| --- | --- |
| `MILKTEA_AI_ENABLED` | `true` |
| `QWEN_API_BASE_URL` | `https://maas-api.cn-huabei-1.xf-yun.com/v2` |
| `QWEN_MODEL` | `xopqwen36v35b` |
| `QWEN_API_KEY` | 你的 QWEN API Key |
| `QWEN_API_TIMEOUT_MS` | `12000` |
| `MILKTEA_ALLOWED_ORIGINS` | `*` |

如果 Netlify 让你选择作用范围，选择 `All deploy contexts` 或保持默认。如果看到 `Contains secret values`，给 `QWEN_API_KEY` 打开这个选项。

### 2.5 点击部署

1. 检查仓库、分支、构建命令、环境变量都填好了。
2. 点击 `Deploy`、`Deploy site` 或 `Deploy ill-quit-milktea`。
3. 等待 Netlify 构建。一般需要 1 到 5 分钟。

### 2.6 找到公共链接

部署成功后，Netlify 会给你一个链接，通常长这样：

```text
https://随机名字.netlify.app
```

你可以点击这个链接打开网站。这就是公共链接，别人也可以打开。

### 2.7 修改网站名字，可选

如果你不喜欢随机名字，可以改成好记的名字：

1. 在 Netlify 进入这个项目。
2. 点击 `Site configuration` 或 `Site settings`。
3. 找到 `Site details`。
4. 点击 `Change site name`。
5. 输入一个英文小写名字，例如：

```text
today-no-milktea
```

6. 保存。
7. 新链接会变成：

```text
https://today-no-milktea.netlify.app
```

如果提示名字已被占用，换一个。

## 第 3 部分：确认线上 AI 接口可用

上线成功后，不要只看页面能打开，还要确认 AI 接口能用。

### 3.1 用浏览器检查接口状态

把下面地址里的域名换成你的 Netlify 域名，然后在浏览器打开：

```text
https://你的网站名.netlify.app/api/estimate-drink
```

正常情况下，页面会显示一段类似 JSON 的文字，里面应该能看到：

```text
"ready":true
```

如果看到 `"ready":false`，通常是环境变量没填好，尤其是 `QWEN_API_KEY`。

### 3.2 用项目自带检查工具确认

回到项目文件夹的终端，复制下面这行，把域名换成你的 Netlify 域名：

```powershell
npm run verify:public-api -- https://你的网站名.netlify.app
```

如果通过，说明线上 API 的基本请求没问题。如果失败，先看本文最后的“常见问题”，再看：

```text
docs/deployment-troubleshooting.md
```

### 3.3 在网站里做一次完整体验

打开公共链接，按下面步骤测试：

1. 点击 `今天戒了`。
2. 选择一个饮品类型，例如奶茶。
3. 填写或选择甜度、杯型、配料。
4. 等待 AI 估算价格、热量、糖分。
5. 如果估算值出现，点击提交。
6. 回首页，看省下金额、热量、糖分是否变化。
7. 点击 `数据`，确认记录出现。
8. 点击删除一条记录，确认数据会重新计算。
9. 再点击 `今天喝了`，记录一次真实喝奶茶。
10. 看小人形态和 Body Score 是否变化。

## 第 4 部分：上线微信小程序

微信小程序不能直接把这个网站“一键变成小程序”。你需要一个小程序项目，把页面或核心逻辑迁移到微信小程序里。当前项目已经准备好了接口方式和服务层模板，小程序应该调用 Netlify 后端接口。

关键原则：

1. 小程序只请求你的 Netlify 接口。
2. 小程序不要直接请求 QWEN。
3. 小程序不要保存 QWEN API Key。
4. 微信后台必须添加合法域名，否则真机和正式版会请求失败。

### 4.1 注册或登录微信小程序后台

1. 打开 [微信公众平台](https://mp.weixin.qq.com/)。
2. 点击右上角 `立即注册`，如果已有账号则点击 `登录`。
3. 注册类型选择 `小程序`。
4. 按页面提示填写邮箱、密码、主体信息。
5. 如果只是个人项目，按个人主体流程走。
6. 如果要正式商业上线，通常需要企业或个体工商户主体，按你的实际情况选择。

### 4.2 获取 AppID

1. 登录微信公众平台。
2. 左侧菜单找到 `开发`。
3. 点击 `开发管理`。
4. 点击 `开发设置`。
5. 找到 `开发者 ID`。
6. 复制 `AppID`，保存到一个文档里。

如果你想先把本项目的小程序模板改成正式 AppID，回到项目文件夹双击：

```text
set-wechat-appid.cmd
```

粘贴第 6 步复制的 `wx...` AppID。脚本会自动更新：

```text
templates/wechat-miniprogram/project.config.json
```

这样后面导入微信开发者工具时，模板就不再只停留在 `touristappid` 临时预览状态。

### 4.3 下载微信开发者工具

1. 打开 [微信开发者工具下载页](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 选择 Windows 版本。
3. 下载并安装。
4. 安装后打开微信开发者工具。
5. 用绑定小程序管理员或开发者身份的微信扫码登录。

### 4.4 创建或打开小程序项目

如果你已经有小程序项目：

1. 打开微信开发者工具。
2. 点击项目列表里的已有项目。
3. 进入项目后继续下一步。

如果你还没有小程序项目：

1. 打开微信开发者工具。
2. 点击 `新建项目`。
3. 项目类型选择 `小程序`。
4. `AppID` 填第 4.2 步复制的 AppID。
5. 项目名称可以填：

```text
今天不喝
```

6. 项目目录选择一个你能找到的位置，例如桌面上的新文件夹。
7. 后端服务不要选择云开发，除非你明确想用微信云开发。
8. 点击 `确定`。

### 4.5 在小程序里接入网站后端 API

当前网站提供的接口是：

```text
https://你的网站名.netlify.app/api/estimate-drink
```

小程序里应该使用这个接口。项目里已经准备了一个模板：

```text
docs/wechat-api-service-template.md
```

也准备了可复制到微信开发者工具项目里的文件模板：

```text
templates/wechat-miniprogram/
```

里面的 `config/api.js`、`services/aiEstimate.js`、`services/drinkRules.js` 和 `pages/record/record.js` 可以交给开发者直接合并进小程序项目。

拿到 Netlify 公共链接后，你可以先在本项目文件夹里双击：

```text
after-netlify.cmd
```

它会先验证公共 API，验证通过后自动把 `templates/wechat-miniprogram/config/api.js` 里的 `API_BASE_URL` 改成你的真实站点根域名。

如果你已经验证过公共 API，只想单独更新微信模板，也可以双击：

```text
set-wechat-api-url.cmd
```

然后粘贴 Netlify 公共链接。

交给开发者或之后迁移时，按这个模板创建服务层。核心请求逻辑应该类似：

```text
wx.request({
  url: "https://你的网站名.netlify.app/api/estimate-drink",
  method: "POST",
  data: drinkPayload
})
```

不要写成下面这样：

```text
https://maas-api.cn-huabei-1.xf-yun.com/v2
```

也不要在小程序代码里出现：

```text
QWEN_API_KEY
```

### 4.6 配置微信 request 合法域名

这一步非常重要。没做的话，小程序开发版也许能临时调试，但体验版、审核版、正式版会请求失败。

1. 打开 [微信公众平台](https://mp.weixin.qq.com/)。
2. 登录你的小程序账号。
3. 左侧菜单点击 `开发`。
4. 点击 `开发管理`。
5. 点击顶部或页面里的 `开发设置`。
6. 找到 `服务器域名`。
7. 找到 `request 合法域名`。
8. 点击 `修改` 或 `开始配置`。
9. 如果要求管理员扫码，按提示用管理员微信扫码。
10. 在 `request 合法域名` 里添加你的 Netlify 域名，只填域名根地址：

```text
https://你的网站名.netlify.app
```

不要填接口路径。不要填成：

```text
https://你的网站名.netlify.app/api/estimate-drink
```

11. 点击 `保存`。

### 4.7 在微信开发者工具里刷新域名设置

1. 回到微信开发者工具。
2. 点击顶部菜单 `详情`。
3. 找到 `项目配置` 或 `本地设置`。
4. 点击 `刷新` 或重新打开项目，让合法域名设置生效。
5. 如果之前勾选过 `不校验合法域名`，正式测试前要取消勾选。

### 4.8 小程序预览测试

1. 在微信开发者工具顶部点击 `编译`。
2. 确认页面能打开。
3. 点击 `预览`。
4. 用手机微信扫码。
5. 在手机里完整操作一次：
   - 选择饮品
   - 等待 AI 估算
   - 提交记录
   - 查看数据页
   - 删除记录
6. 如果 AI 估算失败，先检查：
   - Netlify 网站 API 是否能打开
   - 微信后台是否添加了合法域名
   - 小程序请求地址是否写成 Netlify 地址

### 4.9 上传小程序版本

1. 在微信开发者工具顶部点击 `上传`。
2. 填版本号，例如：

```text
1.0.0
```

3. 填项目备注，例如：

```text
首个可测试版本：奶茶记录、虚拟下单、AI 估算、Body Score、数据统计
```

4. 点击 `上传`。

### 4.10 提交审核

1. 打开微信公众平台。
2. 左侧菜单点击 `管理`。
3. 点击 `版本管理`。
4. 找到刚上传的开发版本。
5. 点击 `提交审核`。
6. 按页面要求填写：
   - 服务类目
   - 小程序简介
   - 测试账号，如果需要
   - 隐私说明，如果涉及用户信息
7. 提交后等待微信审核。

### 4.11 发布正式版

审核通过后：

1. 回到微信公众平台。
2. 进入 `管理` -> `版本管理`。
3. 找到审核通过的版本。
4. 点击 `发布`。
5. 发布后，用微信搜索小程序名称或扫码打开。

## 第 5 部分：上线前检查清单

网站上线前，请逐项打勾：

```text
[ ] GitHub 仓库能看到项目文件
[ ] GitHub 里没有 .env.local
[ ] Netlify 部署状态是 Published 或 Production
[ ] Netlify 环境变量里有 QWEN_API_KEY
[ ] 浏览器打开 /api/estimate-drink 能看到 ready true
[ ] 网站首页能打开
[ ] AI 估算能返回价格、热量、糖分
[ ] 今天戒了可以提交
[ ] 今天喝了可以提交
[ ] 数据页能看到历史记录
[ ] 删除记录后统计会变化
[ ] 手机浏览器 375px 左右宽度显示正常
[ ] 微信后台 request 合法域名已添加 Netlify 域名
[ ] 小程序里请求的是 Netlify API，不是 QWEN 原始 API
[ ] 小程序代码里没有 QWEN API Key
```

## 第 6 部分：常见问题

### GitHub 上传时要求登录

这是正常的。按弹窗登录 GitHub 即可。  
如果提示密码错误，不要输入 GitHub 密码，现代 GitHub 通常需要浏览器授权或 token。

### `remote origin already exists`

说明项目已经连过一个远程仓库。用下面这行替换地址：

```powershell
git remote set-url origin 你的 GitHub 仓库地址
```

然后再运行：

```powershell
git push -u origin main
```

### Netlify 构建失败

先点开失败的 Deploy，看 `Deploy log`。常见原因：

1. 没填环境变量。
2. Node 版本不对。
3. 依赖安装失败。
4. GitHub 仓库不是最新代码。

本项目已经配置了 Node 22 和 Netlify 构建文件。更多排查看：

```text
docs/deployment-troubleshooting.md
```

### 打开网站可以，但 AI 不工作

先打开：

```text
https://你的网站名.netlify.app/api/estimate-drink
```

如果不是 `ready true`，检查 Netlify 环境变量：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_KEY=你的真实 Key
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
```

修改环境变量后，要重新部署一次。

### 小程序真机请求失败

最常见原因是微信后台没有配置合法域名。检查：

1. 微信公众平台 -> 开发 -> 开发管理 -> 开发设置 -> 服务器域名。
2. `request 合法域名` 里必须有：

```text
https://你的网站名.netlify.app
```

3. 小程序请求地址必须是：

```text
https://你的网站名.netlify.app/api/estimate-drink
```

4. 微信开发者工具里不要依赖 `不校验合法域名`。

### 可以用自己的域名吗

可以。先完成 Netlify 默认域名上线，再在 Netlify 里添加自定义域名。添加自定义域名后，微信后台也要把新的 `https://你的域名` 加入 `request 合法域名`。

## 官方参考链接

这些是写本手册时参考的官方文档，页面按钮名称可能会随平台更新轻微变化：

1. GitHub 创建仓库：[Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
2. GitHub 远程仓库命令：[Managing remote repositories](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories)
3. Netlify Git 部署：[Create deploys](https://docs.netlify.com/deploy/create-deploys/)
4. Netlify 环境变量：[Environment variables overview](https://docs.netlify.com/build/environment-variables/overview/)
5. Netlify 部署 Next.js：[Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
6. 微信小程序文档入口：[微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
