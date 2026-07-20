# GitHub 网页手动上传手册

当 GitHub Desktop 或 Git 命令行显示 `getaddrinfo() thread failed to start` 时，可以使用浏览器把项目上传到 GitHub。这个方式不会使用电脑里的 Git 网络组件。

项目根目录中已经准备了以下三个本地上传批次：

```text
github-web-upload-batches\01-core
github-web-upload-batches\02a-docs
github-web-upload-batches\02b-character-images-1
github-web-upload-batches\02c-character-images-2
github-web-upload-batches\02d-outfits-and-preview
github-web-upload-batches\03-tools-and-templates
```

每一批都少于 GitHub 网页一次最多 100 个文件的限制；批次中不包含 `.git`、`node_modules`、`.next` 或 `.env.local`。

## 第 1 批：核心代码

1. 浏览器打开 `https://github.com/haisley811/milktea-quiter`。
2. 点击 `Add file`，再点击 `Upload files`。
3. 打开 Windows 文件资源管理器，进入：

```text
D:\文档\I‘ll quit milktea\github-web-upload-batches\01-core
```

4. 在空白处点击一下，按 `Ctrl + A`。
5. 用鼠标把已选内容拖到 GitHub 网页中央的上传区域。
6. 等待所有文件完成上传。
7. 页面底部选择 `Commit directly to the main branch`。
8. 点击 `Commit changes`。

## 第 2 批：文档

回到仓库首页，重复以上操作，文件夹改为：

```text
D:\文档\I‘ll quit milktea\github-web-upload-batches\02a-docs
```

## 第 3 批：角色图片（第 1 部分）

回到仓库首页，重复以上操作，文件夹改为：

```text
D:\文档\I‘ll quit milktea\github-web-upload-batches\02b-character-images-1
```

## 第 4 批：角色图片（第 2 部分）

回到仓库首页，重复以上操作，文件夹改为：

```text
D:\文档\I‘ll quit milktea\github-web-upload-batches\02c-character-images-2
```

## 第 5 批：服装图片与预览页

回到仓库首页，重复以上操作，文件夹改为：

```text
D:\文档\I‘ll quit milktea\github-web-upload-batches\02d-outfits-and-preview
```

## 第 6 批：验证工具与小程序模板

回到仓库首页，重复以上操作，文件夹改为：

```text
D:\文档\I‘ll quit milktea\github-web-upload-batches\03-tools-and-templates
```

## 上传完成后的检查

刷新仓库首页。必须看到：

```text
app
components
docs
lib
public
scripts
templates
package.json
netlify.toml
README.md
```

如果这十项都能看到，就可以继续 `docs/netlify-deploy-manual.md` 的 Netlify 部署步骤。
