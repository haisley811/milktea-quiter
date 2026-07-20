# 手机测试和公开上线

## 在手机上测试本地预览

手机和电脑需要连接同一个 Wi-Fi。

1. 在电脑 PowerShell 进入项目目录：

```powershell
cd "D:\文档\I‘ll quit milktea"
```

2. 启动局域网预览：

```powershell
npm run preview:lan
```

3. 查看电脑 IPv4 地址：

```powershell
ipconfig
```

找到当前 Wi-Fi 或以太网下面的 `IPv4 地址`，通常像这样：

```text
192.168.1.23
```

4. 手机浏览器打开：

```text
http://你的电脑IPv4地址:4173/
```

例如：

```text
http://192.168.1.23:4173/
```

如果打不开，优先检查：

- 手机和电脑是否在同一个 Wi-Fi。
- Windows 防火墙是否拦截了 Node.js。
- PowerShell 里的预览窗口是否还开着。
- 如果端口被占用，终端会提示实际端口，把手机地址里的 `4173` 换成提示的端口。

## 公开上线推荐路线

这次主线使用 GitHub + Netlify。当前项目是 Next.js，并且已经有后端接口：

```text
/api/estimate-drink
```

Netlify 会部署网页，也会运行这个 Next.js API。QWEN API Key 只放在 Netlify 环境变量里，不放进 GitHub。

## 你需要准备

- 一个 GitHub 账号。
- 一个 Netlify 账号。
- QWEN API Key。
- 可选：自己的域名。

## 上线前本地检查

```powershell
npm install
npm run verify
npm run build
```

如果 `npm run build` 因依赖没装失败，先运行 `npm install`。

## 上线步骤

完整逐步操作见：

```text
docs/deployment-runbook.md
```

核心流程是：

1. 把项目上传到 GitHub。
2. 在 Netlify 导入 GitHub 仓库。
3. Build command 使用 `npm run build`。
4. Publish directory 使用 `.next`。
5. 在 Netlify 添加 QWEN 相关环境变量。
6. 部署成功后打开：

```text
https://你的站点.netlify.app/api/estimate-drink
```

确认返回 `ready: true`。

## 重要安全点

- 不要把 `.env.local` 上传到 GitHub。
- 不要把 `QWEN_API_KEY` 写进 `public/preview.html`、小程序代码或任何前端代码。
- 公开上线后，前端和小程序都只调用你的后端接口 `/api/estimate-drink`。
- 如果 API 临时不可用，网页和小程序都应该保留本地估算兜底。
