# 微信验收登记说明

更新时间：2026-07-14

这份文件只说明一件事：当微信后台和真机预览都通过后，怎样把这个结果登记到本地检查系统里。

## 什么时候可以登记

只有下面两件事都完成后，才运行登记脚本：

```text
[ ] 微信公众平台已经保存 request 合法域名
[ ] 手机微信真机预览已经触发过饮品估算，并且请求的是你的后端 API
```

后端根域名示例：

```text
https://你的站点.netlify.app
```

完整 API 示例：

```text
https://你的站点.netlify.app/api/estimate-drink
```

登记时推荐只粘贴根域名，也就是不带 `/api/estimate-drink` 的地址。

## 怎么登记

回到项目文件夹，双击：

```text
mark-wechat-verified.cmd
```

或者双击：

```text
launch-control.cmd
```

然后按：

```text
W
```

脚本会让你输入两项：

```text
WeChat backend root URL
Evidence note
```

`WeChat backend root URL` 填微信后台已经保存成功、真机也能请求成功的后端根域名，例如：

```text
https://你的站点.netlify.app
```

`Evidence note` 可以写一小句证据，例如：

```text
2026-07-14 21:30 已保存 request 合法域名，iPhone 微信预览请求成功
```

## 登记后会写入什么

脚本会写入本地文件：

```text
.launch-state.json
```

里面会新增或更新这些字段：

```text
wechatDomainVerified
wechatDomainVerifiedAt
wechatApiBaseUrl
wechatApiUrl
wechatUsesSeparateBackendDomain
wechatVerificationNote
```

之后双击：

```text
check-status.cmd
```

你应该能在结果里看到：

```text
wechatDomainVerified: true
```

如果还没看到，说明 URL 不合法、没有以 `https://` 开头，或者还没有成功写入 `.launch-state.json`。

## 不要填写这些

```text
QWEN_API_KEY
https://maas-api.cn-huabei-1.xf-yun.com
http:// 开头的地址
和这次微信真机测试无关的页面路径
```

真实 `QWEN_API_KEY` 只放在 Netlify 环境变量里，不写进 GitHub、不写进微信小程序、不写进这份登记记录。
