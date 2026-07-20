# Netlify 环境变量复制模板

更新时间：2026-07-14

这份文件只用于你在 Netlify 网页后台复制变量名和值。真实 `QWEN_API_KEY` 不要写进这个文件、不要提交到 GitHub，只能填在 Netlify 的环境变量页面里。

## 填写位置

在 Netlify 项目页面里按这个路径找：

```text
Site configuration -> Environment variables
```

如果页面文案变了，找类似这些字样：

```text
Environment variables
Add variable
Key
Value
```

## 需要添加的变量

### 1. 开启 AI

Key：

```text
MILKTEA_AI_ENABLED
```

Value：

```text
true
```

### 2. QWEN 接口地址

Key：

```text
QWEN_API_BASE_URL
```

Value：

```text
https://maas-api.cn-huabei-1.xf-yun.com/v2
```

### 3. QWEN 模型名

Key：

```text
QWEN_MODEL
```

Value：

```text
xopqwen36v35b
```

### 4. QWEN 密钥

Key：

```text
QWEN_API_KEY
```

Value：

```text
这里粘贴你的真实 QWEN API Key
```

注意：

1. 只在 Netlify 网页后台粘贴真实 Key。
2. 如果 Netlify 有 `Secret`、`Contains secret values` 或类似开关，给这项打开。
3. 不要把真实 Key 写进 GitHub、微信小程序、README 或任何 `.md` 文档。

### 5. 请求超时时间

Key：

```text
QWEN_API_TIMEOUT_MS
```

Value：

```text
12000
```

### 6. 允许请求来源

Key：

```text
MILKTEA_ALLOWED_ORIGINS
```

Value：

```text
*
```

说明：先用 `*` 最容易上线。等你绑定自己的正式域名后，可以改成类似：

```text
https://你的域名,https://你的站点.netlify.app
```

## 添加后一定要重新部署

变量填完后，在 Netlify 里重新部署一次。找类似按钮：

```text
Deploys -> Trigger deploy -> Deploy site
```

如果看不到这个按钮，也可以重新推送一次 GitHub，Netlify 会自动重新部署。

## 部署后怎么检查

拿到 Netlify 公共链接后，在浏览器打开：

```text
https://你的站点.netlify.app/api/estimate-drink
```

应该看到：

```text
ready: true
enabled: true
missing: []
```

然后在 PowerShell 里运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

通过后，才说明公共链接上的 API 真能正常调用 QWEN。

## 常见填错情况

1. `QWEN_API_KEY` 拼错：API 会显示 `missing`。
2. 填了变量但没重新部署：旧部署仍然读不到新变量。
3. 把 `QWEN_API_BASE_URL` 填成带 `/chat/completions` 的完整路径：不要这样填，只填到 `/v2`。
4. 把 `MILKTEA_AI_ENABLED` 填成 `false`：API 会显示未启用。
5. 把真实 Key 写进代码或文档：立刻撤回、删除、重新生成 Key。
