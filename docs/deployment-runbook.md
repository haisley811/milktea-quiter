# GitHub、Netlify 和微信小程序部署操作清单

更新时间：2026-07-14

这份文档只写需要你亲自操作的步骤。代码里已经准备好：

- Web 端调用同站点接口：`/api/estimate-drink`
- Netlify 部署配置：`netlify.toml`
- 服务端 QWEN 配置模板：`.env.example`
- GitHub 自动检查：`.github/workflows/verify.yml`
- 小程序将来调用公共接口所需的跨端响应头

## 1. 本地最后检查

在项目目录打开 PowerShell：

```powershell
cd "D:\文档\I‘ll quit milktea"
npm run check:github-ready
npm install
npm run verify
npm run build
```

如果 `npm run check:github-ready` 通过，说明可以安全推送到 GitHub。输出里应该看到：

```text
"ok": true
"forbiddenTrackedFiles": []
```

`forbiddenTrackedFiles` 是空数组，表示 `.env.local`、`.next/`、`.netlify/`、`node_modules/`、日志和本地验收状态不会被误传到 GitHub。

如果 `npm install` 或 `npm run build` 因为本机网络下载超时报错，不要卡在这里，可以先继续走 GitHub + Netlify 主线，让 Netlify 云端安装依赖和构建。详细兜底看：

```text
docs/dependency-install-fallback.md
```

如果 `npm run verify` 报错，说明是代码或文档检查没有通过，这时先把报错内容发给我。

如果你已经在 `.env.local` 里填好了 QWEN API Key，还可以额外跑一次真实 API 检查：

```powershell
npm run check:qwen-env
npm run verify:qwen-direct
npm run verify:api-live
```

`check:qwen-env` 不会打印 API Key，只会告诉你配置是否 ready。`verify:qwen-direct` 会绕过本地端口，直接检查 QWEN 上游是否可用。`verify:api-live` 会真实调用当前配置的本地临时后端，确认跨端预检和 AI 估算都能工作。没有填密钥时不要跑 direct 或 live 检查。

## 2. 创建 GitHub 仓库

本地 Git 仓库和首个提交已经准备好。你醒来后只需要创建 GitHub 远程仓库并推送。

1. 打开 [GitHub 新建仓库页面](https://github.com/new)。
2. Repository name 填：`ill-quit-milktea`。
3. Visibility 可以选 `Private`，等你想公开时再改成 `Public`。
4. 不要勾选添加 README、`.gitignore` 或 license，因为本地项目已经有文件。
5. 点击 `Create repository`。

然后回到 PowerShell，按 GitHub 页面给出的地址替换下面的 `<你的仓库地址>`：

```powershell
npm run check:github-ready
git remote add origin <你的仓库地址>
git push -u origin main
```

如果提示 `remote origin already exists`，改用：

```powershell
git remote set-url origin <你的仓库地址>
git push -u origin main
```

注意：`.env.local` 已被 `.gitignore` 忽略，不要手动上传它。

## 3. 连接 Netlify

1. 打开 [Netlify](https://app.netlify.com/) 并登录。
2. 点击 `Add new project`。
3. 选择 `Import an existing project`。
4. 选择 GitHub，授权 Netlify 读取你的仓库。
5. 选择 `ill-quit-milktea` 仓库。
6. Build settings 保持：
   - Build command: `npm run build`
   - Publish directory: `.next`
7. 先不要点 Deploy，先配置环境变量。

## 4. 在 Netlify 填环境变量

进入 Netlify 项目的环境变量设置页面。通常路径是：

```text
Site configuration -> Environment variables
```

如果 Netlify 页面文案变了，就找类似 `Environment variables`、`Add variable`、`Key`、`Value` 的位置。添加这些变量：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY=你的 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

如果你之后绑定了自己的域名，可以把 `MILKTEA_ALLOWED_ORIGINS=*` 改成：

```text
MILKTEA_ALLOWED_ORIGINS=https://你的域名,https://你的站点.netlify.app
```

API Key 只填在 Netlify，不要写进 GitHub、README、小程序代码或前端文件。

## 5. 部署并验证公共 API

1. 在 Netlify 点击 `Deploy`、`Deploy site` 或意思相近的部署按钮。
2. 部署成功后，Netlify 会给你一个公开网址，例如：

```text
https://ill-quit-milktea.netlify.app
```

3. 打开：

```text
https://你的站点.netlify.app/api/estimate-drink
```

正常情况下会看到类似：

```json
{
  "enabled": true,
  "ready": true,
  "baseUrl": "https://maas-api.cn-huabei-1.xf-yun.com/v2",
  "model": "xopqwen36v35b",
  "missing": []
}
```

如果 `ready` 是 `false`，重点检查 Netlify 环境变量里的 `QWEN_API_KEY`。

4. 回到项目文件夹，最推荐直接双击：

```text
after-netlify.cmd
```

粘贴 Netlify 给你的公共链接。它会先验证公共 API，通过后自动更新微信小程序模板里的 `API_BASE_URL`，并写入 `.launch-state.json`，以后双击 `check-status.cmd` 就能看到公共 API 已验收。

如果你只想用命令检查，也可以在 PowerShell 里运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

这个命令会检查：

- 公共地址必须是 HTTPS。
- `OPTIONS /api/estimate-drink` 预检可用。
- `GET /api/estimate-drink` 返回 `ready: true`。
- `POST /api/estimate-drink` 能返回 AI 估算结果。
- 响应里不会暴露 API Key。

5. 打开网站首页，进入记录页，输入一个自定义饮品名，确认“实时估算”显示 AI 已连接或能正常回退本地估算。

## 6. 微信小程序要调用哪个 API

小程序不要调用 QWEN 原始地址，也不要保存 QWEN API Key。它只调用你自己的 Netlify 后端：

```text
https://你的站点.netlify.app/api/estimate-drink
```

小程序请求示例：

```js
wx.request({
  url: "https://你的站点.netlify.app/api/estimate-drink",
  method: "POST",
  header: {
    "content-type": "application/json"
  },
  data: {
    form,
    localEstimate
  },
  success(res) {
    console.log(res.data);
  },
  fail() {
    // 这里回退本地估算
  }
});
```

## 7. 配置微信小程序合法域名

1. 打开 [微信公众平台](https://mp.weixin.qq.com/)。
2. 进入你的小程序。
3. 打开 `开发管理`。
4. 打开 `开发设置`。
5. 找到 `服务器域名`。
6. 在 `request 合法域名` 里添加：

```text
https://你的站点.netlify.app
```

如果你绑定了自定义域名，就添加自定义域名，例如：

```text
https://api.yourdomain.com
```

微信小程序正式版必须使用 HTTPS 域名。Netlify 默认提供 HTTPS。

## 8. 小程序发布前手动验收

至少检查这些项目：

- 第一次打开能显示初始状态。
- 记录“今天戒了”后，Body Score 减少 2，并保存到本地。
- 记录“今天喝了”后，Body Score 增加 2，并保存到本地。
- 自定义饮品能请求 `https://你的站点.netlify.app/api/estimate-drink`。
- 公共 API 请求失败时，小程序仍能使用本地估算。
- 历史记录可以删除，删除后统计重新计算。
- 清空记录需要二次确认。
- 不要在小程序代码包里出现 `QWEN_API_KEY`。

## 9. 常见错误

- Netlify 页面能打开，但 API `ready: false`：检查 `QWEN_API_KEY` 是否填在 Netlify。
- 小程序开发工具能请求，真机失败：检查微信公众平台的 `request 合法域名`。
- 网站估算一直是本地值：检查 `MILKTEA_AI_ENABLED=true`。
- GitHub Actions 失败：先看失败步骤是 `npm install`、`npm run verify` 还是 `npm run build`，把报错发给我。

更完整的排障清单见：

```text
docs/deployment-troubleshooting.md
```
