# npm install 超时兜底手册

更新时间：2026-07-14

当前机器多次尝试联网安装依赖失败，所以项目里还没有：

```text
node_modules/
package-lock.json
```

这会导致本机暂时不能运行：

```powershell
npm run build
```

常见报错是：

```text
next is not recognized
```

这不代表网站代码一定坏了，只代表 Next.js 依赖还没有下载到本机。

项目现在已经加入 `.npmrc`，让本机、GitHub Actions 和 Netlify 安装依赖时默认使用更长的下载超时和更多重试，并关闭 `audit`、`fund` 这类与构建无关的输出噪音。

## 我已经尝试过什么

已经尝试过：

```powershell
npm install
npm install --package-lock-only --ignore-scripts --prefer-offline
npm install --package-lock-only --ignore-scripts --fetch-timeout=600000 --fetch-retries=5 --fetch-retry-maxtimeout=120000
npm install --package-lock-only --ignore-scripts --cache .npm-cache --fetch-timeout=600000 --fetch-retries=5 --fetch-retry-maxtimeout=120000
```

最后一次给了 10 分钟超时窗口，仍然没有生成 `package-lock.json`。

结果都是联网下载超时，没有生成 `package-lock.json`。

2026-07-14 凌晨又追加尝试过：

```powershell
npm install --package-lock-only --ignore-scripts --cache .npm-cache
npm install --package-lock-only --ignore-scripts --cache .npm-cache --registry=https://registry.npmjs.org/ --fetch-retries=2 --fetch-timeout=60000
```

第一条在普通沙箱和提权联网环境里都超时；第二条改用官方 npm registry 后仍然超时。旧 npm 日志里能看到 `ECONNRESET`，说明这更像当前机器网络、代理或 npm registry 连接问题，不是项目依赖声明写错。

## 你醒来后优先怎么做

如果你想重试本机安装，最简单方式是双击项目文件夹里的：

```text
install-local-deps.cmd
```

它会自动做三件事：

1. 运行 `npm install`。
2. 安装成功后运行 `npm run verify`。
3. 验证通过后运行 `npm run build`。

如果你想先确认本机 npm 到底能不能联网，双击：

```text
check-npm-network.cmd
```

它会显示当前 npm registry，并分别 ping 当前 registry 和官方 npm registry。这个脚本不会安装依赖，也不会修改项目文件。

如果你只想先生成锁文件，不想完整安装 `node_modules/`，双击：

```text
generate-package-lock.cmd
```

它只会尝试生成：

```text
package-lock.json
```

不会完整安装 `node_modules/`，也不会运行构建。它适合在上传 GitHub 前先补齐锁文件；如果它仍然超时，不要继续卡住，直接让 Netlify 云端安装依赖。

如果你想手动操作，先在项目文件夹里打开 PowerShell，然后运行：

```powershell
npm install
```

因为项目已有 `.npmrc`，这条命令会自动使用较长超时和重试设置，不需要你额外输入一长串参数。

如果成功，再运行：

```powershell
npm run verify
npm run build
```

成功后会出现：

```text
package-lock.json
node_modules/
```

`package-lock.json` 可以提交到 GitHub，`node_modules/` 不要提交。

## 如果 npm install 仍然卡住

不要一直卡在本机安装。如果 `install-local-deps.cmd` 或 `npm install` 继续超时，直接继续上线主线。

你可以继续按上线手册走：

```text
docs/start-here-after-sleep.md
```

也就是：

1. 创建 GitHub 空仓库。
2. 推送本地代码到 GitHub。
3. 在 Netlify 里导入 GitHub 仓库。
4. 让 Netlify 云端安装依赖和构建。

Netlify 云端网络环境通常和本机不同，所以本机 npm 超时不一定代表 Netlify 也会失败。

## Netlify 构建时重点看哪里

在 Netlify 里：

```text
Deploys -> 最新一次 deploy -> Deploy log
```

重点找：

```text
npm install
npm run build
next build
Published
```

如果看到 `Published`，说明部署成功。

如果失败，看错误里是否有：

```text
Cannot find module
next: command not found
npm ERR!
```

遇到这些再看：

```text
docs/deployment-troubleshooting.md
```

## 本机可选排查

如果你想继续修本机 npm 下载，可以尝试：

1. 换一个网络。
2. 关闭或切换代理/VPN。
3. 重启 PowerShell。
4. 重启电脑后再运行 `npm install`。
5. 确认电脑能打开：

```text
https://registry.npmjs.org/
```

如果网页都打不开，本机 npm 也大概率会超时。

## 不要做什么

1. 不要把 `node_modules/` 手动复制进 GitHub。
2. 不要为了生成锁文件手写 `package-lock.json`。
3. 不要把 `.env.local` 或真实 `QWEN_API_KEY` 提交到 GitHub。
4. 不要因为本机 `npm install` 超时就删除已完成的 UI、API 或小程序模板代码。
