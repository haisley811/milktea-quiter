# 需要你亲自操作的事项

更新时间：2026-07-14

这份文件只列我不能替你完成、必须你登录外部平台操作的事情。代码、API 接入、UI 风格切换、隐藏人物、小程序模板和本地检查脚本都已经准备好。

## 先双击这个总入口

在项目文件夹里双击：

```text
launch-control.cmd
```

如果只想看当前完成到哪一步，双击：

```text
check-status.cmd
```

## 你需要准备的账号和信息

1. GitHub 账号。
2. Netlify 账号，建议用 GitHub 登录。
3. 真实 `QWEN_API_KEY`。只填进 Netlify 环境变量，不要发给任何人，不要写进 GitHub，不要写进微信小程序。
4. 微信小程序 AppID。
5. 微信公众平台账号权限，需要能打开“开发管理 / 开发设置 / 服务器域名”。

## 第 1 件事：创建 GitHub 空仓库

1. 打开浏览器，进入：
```text
https://github.com/
```

2. 登录 GitHub。
3. 点击右上角 `+`。
4. 点击 `New repository`。
5. Repository name 填：
```text
ill-quit-milktea
```

6. 不要勾选：
```text
Add a README file
Add .gitignore
Choose a license
```

7. 点击 `Create repository`。
8. 复制 GitHub 给你的 HTTPS 仓库地址，形如：
```text
https://github.com/你的用户名/ill-quit-milktea.git
```

9. 回到项目文件夹，双击：
```text
connect-github.cmd
```

10. 粘贴刚才复制的 HTTPS 地址，按回车。它会自动设置远程仓库并推送 `main`。

## 第 2 件事：在 Netlify 部署网站

1. 打开：
```text
https://app.netlify.com/
```

2. 用 GitHub 登录 Netlify。
3. 点击 `Add new site`。
4. 选择 `Import an existing project`。
5. 选择 `GitHub`。
6. 选择刚才的仓库 `ill-quit-milktea`。
7. 构建设置保持：
```text
Build command: npm run build
Publish directory: .next
Production branch: main
Node version: 22
```

8. 在 Netlify 的环境变量里填：
```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY 这一项填你的真实 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

9. 点击 `Deploy site`。
10. 等待 Deploy log 出现 `Published`。
11. 复制 Netlify 公共链接，形如：
```text
https://你的站点.netlify.app
```

## 第 3 件事：验证公共 API

拿到 Netlify 链接后，回到项目文件夹，优先双击：

```text
after-netlify.cmd
```

粘贴 Netlify 公共链接，按回车。它会做四件事：

1. 验证公共 API 是否能访问。
2. 验证 `POST /api/estimate-drink` 是否能真实返回 AI 估算。
3. 更新微信小程序模板里的 `API_BASE_URL`。
4. 运行微信模板检查和烟测，通过后把结果写入本地 `.launch-state.json`。

如果你只想验证 API，不想更新微信模板，可以双击：

```text
verify-public-api.cmd
```

## 第 4 件事：配置微信小程序合法域名

1. 打开微信公众平台：
```text
https://mp.weixin.qq.com/
```

2. 登录你的小程序账号。
3. 进入：
```text
开发管理 -> 开发设置 -> 服务器域名 -> request 合法域名
```

4. 添加 Netlify 根域名，例如：
```text
https://你的站点.netlify.app
```

不要填：
```text
https://你的站点.netlify.app/api/estimate-drink
```

如果微信后台保存失败，或保存后真机仍然请求失败，不要把 `QWEN_API_KEY` 写进小程序，也不要让小程序直接请求 QWEN。你需要换成微信后台能保存且真机能请求的 HTTPS 后端域名，例如绑定到 Netlify 的自定义域名，或迁移/代理到腾讯云、微信云开发、你自己的后端域名。

## 第 5 件事：导入并测试微信小程序模板

1. 打开微信开发者工具。
2. 点击 `导入项目`。
3. 项目目录选择：
```text
templates/wechat-miniprogram
```

4. AppID 填你的小程序 AppID。
5. 点击 `导入` 或 `确定`。
6. 点击顶部 `编译`。
7. 打开页面：
```text
pages/record/record
```

8. 输入或选择一杯饮品。
9. 点击 `估算价格、热量、糖分`。
10. 打开调试器，确认请求地址是：
```text
https://你的站点.netlify.app/api/estimate-drink
```

11. 确认没有请求 QWEN 原始域名，也没有任何 `QWEN_API_KEY` 出现在小程序代码里。

提醒：模板默认 `project.config.json` 里是 `touristappid`，只适合临时预览。准备上传审核前，必须在导入项目时填写你的小程序正式 AppID，或在微信开发者工具 `详情 -> 基本信息` 里改成正式 AppID。

如果你想先在模板文件里改好，回到项目文件夹双击：

```text
set-wechat-appid.cmd
```

粘贴你的正式小程序 AppID，例如 `wx1234567890abcdef`。脚本会自动更新 `templates/wechat-miniprogram/project.config.json`。

## 第 6 件事：真机预览和上传审核

1. 在微信开发者工具顶部点击 `预览`。
2. 用手机微信扫码。
3. 在手机上操作一次饮品估算。
4. 如果能正常估算，回到开发者工具点击 `上传`。
5. 填版本号，例如：
```text
1.0.0
```

6. 填项目备注，例如：
```text
今天不喝：接入 Netlify AI 饮品估算 API
```

7. 上传成功后，回到微信公众平台提交审核。

## 做完后检查

回到项目文件夹，双击：

```text
check-status.cmd
```

你希望看到：

```text
localImplementationReady: true
publicApiVerified: true
publicUrl: https://你的站点.netlify.app
```

微信后台合法域名和真机预览是否通过，仍需要你按实际平台页面确认。

全部外部平台步骤做完后，打开并填写：

```text
docs/launch-acceptance-checklist.md
```

把 `.launch-state.json` 里的 `publicUrl`、`apiUrl`、`verifiedAt` 抄进去，但不要写入真实 `QWEN_API_KEY`。

## 不要做的事

1. 不要把真实 `QWEN_API_KEY` 发到 GitHub。
2. 不要把真实 `QWEN_API_KEY` 写进微信小程序。
3. 不要在微信合法域名里填写 `/api/estimate-drink`。
4. 不要手动上传 `node_modules`。
5. 不要把 `.env.local` 发给别人。
