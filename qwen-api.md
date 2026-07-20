# QWEN API 后端接入

当前项目已经把 QWEN 接到后端估算接口：

```text
/api/estimate-drink
```

前端只调用这个后端接口，不保存 API Key。接口失败、超时、未配置或关闭时，页面会自动回退到本地估算规则。

## 本地环境变量

在项目根目录新建或编辑：

```text
.env.local
```

复制 `.env.example` 的内容，然后按需修改：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY=这里填你的 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

关闭 API 时改成：

```text
MILKTEA_AI_ENABLED=false
```

关闭后不影响记录功能，页面会继续使用本地规则估算价格、热量和糖分。

## 本地查看后端状态

Next 开发版后端：

```powershell
npm run dev
```

打开：

```text
http://localhost:3000/api/estimate-drink
```

静态预览后端：

```powershell
npm run preview
```

打开：

```text
http://127.0.0.1:4173/api/estimate-drink
```

返回内容会显示 API 是否开启、模型名、接口地址、缺少哪些配置，但不会返回 API Key。

如果 `.env.local` 已经填好真实密钥，可以跑一次 live 检查：

```powershell
npm run check:qwen-env
npm run verify:qwen-direct
npm run verify:api-live
```

`check:qwen-env` 不会打印 API Key。`verify:qwen-direct` 会真实调用 QWEN 上游，但不需要启动本地端口。`verify:api-live` 会启动本地临时后端并真实调用 QWEN API。没有密钥或不想消耗额度时不要运行 direct 或 live 检查。

## Netlify 公开部署

Netlify 部署后，公共接口会变成：

```text
https://你的站点.netlify.app/api/estimate-drink
```

部署成功后可以运行公共 API 检查：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

它会检查 HTTPS、预检请求、运行状态和一次真实 AI 估算。

Netlify 环境变量必须设置：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY=你的 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

`QWEN_API_KEY` 只放在 Netlify，不放进 GitHub。

## 小程序调用方式

微信小程序不调用 QWEN 原始接口，也不保存 API Key。它只调用你的 Netlify 后端：

```text
https://你的站点.netlify.app/api/estimate-drink
```

请求体和 Web 端一致：

```json
{
  "form": {},
  "localEstimate": {}
}
```

上线前需要在微信公众平台把你的 Netlify 域名加入 `request 合法域名`。详细步骤见：

```text
docs/deployment-runbook.md
```

## 接口安全边界

- API Key 只在服务端环境变量中读取。
- `GET /api/estimate-drink` 只返回运行状态，不返回 API Key。
- `POST /api/estimate-drink` 返回规范化后的估算结果。
- `OPTIONS /api/estimate-drink` 用于跨端预检。
- `MILKTEA_ALLOWED_ORIGINS` 可限制允许跨域访问的来源。
- 单次请求体限制为 16 KB，超出会返回 `payload-too-large`。
- 服务端会截断过长的饮品名、自定义小料和小料列表，避免异常输入直接进入模型 prompt。

如果你之后绑定自己的域名，建议把：

```text
MILKTEA_ALLOWED_ORIGINS=*
```

改成：

```text
MILKTEA_ALLOWED_ORIGINS=https://你的域名,https://你的站点.netlify.app
```
