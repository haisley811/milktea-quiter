# GitHub 上传专项手册

更新时间：2026-07-14

这份文件只讲第一步：把本地项目上传到 GitHub。

完成后，`npm run check:goal-status` 里的这一项会从 `false` 变成 `true`：

```text
github-remote-configured
```

## 第 0 步：先确认你在项目文件夹

项目文件夹是：

```text
D:\文档\I‘ll quit milktea
```

你可以双击：

```text
check-status.cmd
```

先查看当前状态。如果看到 `gitRemoteConfigured: false`，说明还没连接 GitHub 仓库。

## 第 1 步：登录 GitHub

1. 打开浏览器。
2. 进入：

```text
https://github.com/
```

3. 点击右上角 `Sign in`。
4. 输入账号和密码。
5. 如果出现验证码或手机验证，按页面提示完成。

## 第 2 步：创建空仓库

1. 登录 GitHub 后，看页面右上角。
2. 点击右上角的 `+`。
3. 点击 `New repository`。
4. 找到 `Repository name`。
5. 输入：

```text
ill-quit-milktea
```

6. `Description` 可以填：

```text
今天不喝：奶茶记录与轻体习惯养成网站
```

7. `Public / Private` 自己选：
   - 想让别人看到代码：选 `Public`
   - 不想别人看到代码：选 `Private`
8. 下面这些不要勾选：

```text
Add a README file
Add .gitignore
Choose a license
```

9. 点击 `Create repository`。

一定要创建空仓库。这个项目本地已经有 README 和 `.gitignore`，GitHub 不要再自动生成一份。

## 第 3 步：复制仓库 HTTPS 地址

创建成功后，GitHub 会显示 `Quick setup`。

1. 确认选中的是 `HTTPS`。
2. 复制类似这样的地址：

```text
https://github.com/你的用户名/ill-quit-milktea.git
```

后面命令里的 `你的 GitHub 仓库地址` 都要替换成这个地址。

## 第 4 步：打开 PowerShell

如果你不想手动输入 Git 命令，可以先跳到第 6 步里的：

```text
最简单方式：双击 connect-github.cmd
```

1. 打开 Windows 文件资源管理器。
2. 进入项目文件夹：

```text
D:\文档\I‘ll quit milktea
```

3. 在文件夹空白处按住 `Shift`，同时点击鼠标右键。
4. 点击 `在终端中打开` 或 `Open in Terminal`。
5. 如果打开的是 PowerShell，就可以继续。

如果你不确定位置是否正确，输入：

```powershell
pwd
```

看到 `I‘ll quit milktea` 就说明位置正确。

## 第 5 步：上传前检查

先运行：

```powershell
npm run check:github-ready
```

如果输出里有：

```text
"ok": true
```

就可以继续。

## 第 6 步：连接 GitHub 仓库

### 最简单方式：双击 connect-github.cmd

1. 回到项目文件夹：

```text
D:\文档\I‘ll quit milktea
```

2. 双击：

```text
connect-github.cmd
```

3. 粘贴第 3 步复制的 GitHub HTTPS 仓库地址。
4. 按回车。
5. 如果弹出 GitHub 登录授权窗口，选择用浏览器登录并授权。
6. 等待窗口里出现推送完成提示。

如果这个方式成功，可以直接跳到第 8 步确认上传结果。

如果窗口显示 `GitHub connection or push failed`，先检查这几件事：

1. GitHub 仓库必须是空仓库，不能提前添加 README、`.gitignore` 或 license。
2. 粘贴的地址必须类似 `https://github.com/你的用户名/ill-quit-milktea.git`。
3. 如果 GitHub 要求登录，用浏览器授权，不要输入 GitHub 登录密码。
4. 如果提示本地还有未提交改动，先让 Codex 提交最新工作后再重新双击。

更多排障看：

```text
docs/deployment-troubleshooting.md
```

### 手动方式：自己输入命令

把下面命令里的地址换成你自己的 GitHub 地址：

```powershell
git remote add origin 你的 GitHub 仓库地址
```

例子：

```powershell
git remote add origin https://github.com/yourname/ill-quit-milktea.git
```

如果提示：

```text
remote origin already exists
```

改用：

```powershell
git remote set-url origin 你的 GitHub 仓库地址
```

## 第 7 步：推送代码

运行：

```powershell
git push -u origin main
```

第一次上传时，GitHub 可能会弹出登录授权：

1. 点击 `Sign in with your browser`。
2. 浏览器打开 GitHub 后点击授权。
3. 回到 PowerShell，等待上传完成。

如果提示输入密码，不要输入 GitHub 登录密码。现代 GitHub 通常需要浏览器授权或 token。

## 第 8 步：确认上传成功

1. 回到浏览器里的 GitHub 仓库页面。
2. 刷新页面。
3. 应该能看到这些文件或文件夹：

```text
app/
components/
docs/
lib/
public/
scripts/
templates/
package.json
netlify.toml
README.md
```

4. 确认 GitHub 页面里不要出现：

```text
.env.local
node_modules/
.next/
```

## 第 9 步：再次检查状态

回到 PowerShell 运行：

```powershell
npm run check:goal-status
```

这时应该看到：

```text
gitRemoteConfigured: true
```

如果还是 `false`，说明 remote 没设置成功，重新检查第 6 步。

## 完成后下一步

GitHub 上传完成后，继续 Netlify 部署。看：

```text
docs/start-here-after-sleep.md
```

或者直接看 Netlify 环境变量模板：

```text
docs/netlify-env-copy-paste.md
```

## 当前这台电脑遇到 `getaddrinfo() thread failed to start` 时怎么办

如果 `upload-to-github.cmd` 的窗口里显示下面这一句：

```text
fatal: unable to access 'https://github.com/...': getaddrinfo() thread failed to start
```

这不是仓库地址、GitHub 密码或本项目代码的问题。它表示 Windows 当前会话无法让命令行程序启动 DNS 解析线程；浏览器可以打开 GitHub，并不代表 Git 命令也能联网。

按下面顺序操作：

1. 先保存你正在编辑的其他文件。
2. 双击项目文件夹里的 `repair-github-network.cmd`。
3. Windows 弹出“是否允许此应用对你的设备进行更改”时，点击 `是`。
4. 黑色窗口显示 `Repair complete` 后，按任意键关闭它。
5. 点击 Windows 左下角的 `开始`，点击电源图标，再点击 `重启`。
6. 等电脑重新进入桌面后，暂时不要先打开很多软件。
7. 打开 GitHub Desktop，点击 `Publish branch`。
8. 窗口显示上传完成或按钮变成 `Fetch origin`，才算上传成功。

如果重启后仍是同一句错误，不要反复重试。请改用 GitHub Desktop 上传，或把错误截图发给我继续检查网络软件/防火墙。GitHub Desktop 的逐步操作见 `docs/deployment-troubleshooting.md` 中的同名小节。
