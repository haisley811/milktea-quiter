# API 接入状态说明

更新时间：2026-07-14

## 结论

网站已经接入 API。

当前接入的是服务端代理接口：

```text
/api/estimate-drink
```

这个接口会在服务端读取 QWEN 配置，调用 QWEN 模型来估算饮品的价格、热量和糖分。前端页面和未来微信小程序都只调用这个站内接口，不直接调用 QWEN 原始接口，也不会保存或暴露 `QWEN_API_KEY`。

## 现在已经完成了什么

1. 网站已有 Next.js API 路由：`app/api/estimate-drink/route.ts`。
2. API 支持 `GET`、`POST` 和 `OPTIONS`。
3. `GET /api/estimate-drink` 用来查看后端 AI 是否开启、模型名、接口地址、缺少哪些配置，不返回 API Key。
4. `POST /api/estimate-drink` 用来提交饮品表单和本地估算结果，并返回 AI 估算后的价格、热量、糖分、来源和解释。
5. API 已做请求体大小限制，单次请求最大 16 KB。
6. API 已加跨域响应头，方便 Netlify 公共链接和微信小程序请求。
7. API 路由已显式设置为 `force-dynamic` 和 `nodejs` 运行时，避免部署后被静态化或误放到不合适的运行环境。
8. QWEN API Key 只从服务端环境变量读取，不写入前端代码、小程序模板或 GitHub。
9. AI 不可用、超时、未配置或关闭时，页面会回退到本地估算规则，记录功能不会中断。

## 当前本机配置状态

本轮检查已经运行：

```powershell
npm run check:qwen-env
```

检查结果显示：

```text
enabled: true
ready: true
apiKeyConfigured: true
missing: []
```

这说明本机 `.env.local` 里已经有可读取的 QWEN 配置。为保护密钥，检查命令不会打印真实 API Key。

## 还没有完成的外部状态

目前还没有公共 Netlify 链接，所以公网 API 地址还不存在。

上线后，公共 API 地址会变成：

```text
https://你的站点.netlify.app/api/estimate-drink
```

上线后必须在 Netlify 里填写同样的环境变量，尤其是：

```text
MILKTEA_AI_ENABLED=true
QWEN_API_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
QWEN_MODEL=xopqwen36v35b
QWEN_API_KEY=你的真实 QWEN API Key
QWEN_API_TIMEOUT_MS=12000
MILKTEA_ALLOWED_ORIGINS=*
```

## 上线后怎么确认 API 真能用

拿到 Netlify 公共链接后，在 PowerShell 里运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

通过后代表：

1. 公共 HTTPS 地址能访问。
2. `GET /api/estimate-drink` 返回 `ready: true`。
3. `OPTIONS /api/estimate-drink` 预检请求正常。
4. `POST /api/estimate-drink` 能完成一次真实 AI 估算。

## 微信小程序怎么调用

微信小程序不要调用 QWEN 原始接口。小程序只调用：

```text
https://你的站点.netlify.app/api/estimate-drink
```

上线前必须在微信公众平台添加 request 合法域名，只填根域名：

```text
https://你的站点.netlify.app
```

不要把 `/api/estimate-drink` 填进合法域名，也不要把 `QWEN_API_KEY` 放进小程序代码包。

可复制的小程序服务层模板在：

```text
templates/wechat-miniprogram/
```

## 相关文档

- 0 代码上线手册：`docs/zero-code-launch-manual.md`
- QWEN API 详细说明：`docs/qwen-api.md`
- 上线验收清单：`docs/launch-acceptance-checklist.md`
- 小程序 API 服务层模板说明：`docs/wechat-api-service-template.md`
- 部署问题排查：`docs/deployment-troubleshooting.md`
