# 微信小程序上线专项手册

更新时间：2026-07-14

这份文件只讲微信小程序相关操作。你需要先完成 Netlify 部署，并拿到类似下面这样的公共链接：

```text
https://你的站点.netlify.app
```

小程序最终只请求：

```text
https://你的站点.netlify.app/api/estimate-drink
```

不要在小程序里保存 `QWEN_API_KEY`，也不要在小程序里直接请求 QWEN 原始接口。

## 第 1 步：确认 Netlify API 已经可用

在配置微信之前，先确认公共 API 能用。

1. 打开浏览器。
2. 在地址栏输入：

```text
https://你的站点.netlify.app/api/estimate-drink
```

3. 按回车。
4. 页面应该显示 JSON。
5. 重点看这几项：

```text
ready: true
enabled: true
missing: []
```

6. 如果 `ready` 不是 `true`，先回 Netlify 检查环境变量，尤其是 `QWEN_API_KEY`。

也可以在 PowerShell 运行：

```powershell
npm run verify:public-api -- https://你的站点.netlify.app
```

这条通过后，再继续配置微信。

## 第 2 步：登录微信公众平台

1. 打开浏览器。
2. 进入：

```text
https://mp.weixin.qq.com/
```

3. 用你的小程序管理员微信扫码登录。
4. 如果页面让你选择账号，选择你要上线的那个小程序账号。

## 第 3 步：添加 request 合法域名

1. 登录后，看页面左侧菜单。
2. 点击 `开发管理`。
3. 在开发管理页面里点击 `开发设置`。
4. 找到 `服务器域名`。
5. 找到 `request 合法域名`。
6. 点击 `修改`、`开始配置` 或类似按钮。
7. 如果需要管理员扫码确认，就用管理员微信扫码。
8. 在 `request 合法域名` 输入框里添加你的 Netlify 根域名：

```text
https://你的站点.netlify.app
```

9. 保存。

注意：

1. 这里只填根域名。
2. 不要填 `/api/estimate-drink`。
3. 不要填 `http://`，必须是 `https://`。
4. 不要填 QWEN 原始域名。
5. 只有微信后台能保存这个域名，并且真机预览能请求成功，才算小程序域名配置通过。

正确：

```text
https://你的站点.netlify.app
```

错误：

```text
https://你的站点.netlify.app/api/estimate-drink
http://你的站点.netlify.app
https://maas-api.cn-huabei-1.xf-yun.com
```

### 如果微信后台不接受 Netlify 默认域名

如果你点击保存时，微信公众平台提示域名不符合要求、无法校验、无法保存，或者真机预览仍然请求失败，不要把 QWEN Key 放进小程序，也不要改成直接请求 QWEN。

你有三条安全路线：

1. 先继续保留 Netlify 网页版公共链接，用它作为网站发布地址。
2. 给 Netlify 绑定一个微信后台可接受的 HTTPS 自定义域名，然后把这个自定义域名填进 `request 合法域名`。
3. 如果自定义域名仍然不方便，可以把 `/api/estimate-drink` 这层后端迁移或代理到微信后台可接受的云服务域名，例如腾讯云、微信云开发或你自己已配置好的后端域名。

无论选哪条路线，小程序里仍然只填后端根域名：

```text
https://你最终能在微信后台保存的域名
```

对应接口仍然是：

```text
https://你最终能在微信后台保存的域名/api/estimate-drink
```

## 第 4 步：配置小程序代码里的 API 地址

如果你刚从 Netlify 拿到公共链接，最推荐先双击：

```text
after-netlify.cmd
```

它会先验证公共 API，通过后自动更新小程序模板里的后端地址。

如果你已经验证过公共 API，只想单独更新小程序模板，回到本项目文件夹，双击：

```text
set-wechat-api-url.cmd
```

按提示粘贴 Netlify 公共链接，例如：

```text
https://today-no-milktea.netlify.app
```

脚本会自动更新：

```text
templates/wechat-miniprogram/config/api.js
```

如果你想手动改，或者脚本没有运行成功，再打开：

```text
templates/wechat-miniprogram/config/api.js
```

把：

```js
export const API_BASE_URL = "https://你的站点.netlify.app";
```

改成你自己的 Netlify 公共链接，例如：

```js
export const API_BASE_URL = "https://today-no-milktea.netlify.app";
```

注意：

1. 这里也只填根域名。
2. 不要加 `/api/estimate-drink`。
3. `services/aiEstimate.js` 会自动拼接接口路径。

## 第 5 步：用微信开发者工具打开项目

在复制到微信开发者工具前，建议先回到本项目文件夹，双击：

```text
check-wechat-template.cmd
```

它会检查小程序模板里的 `API_BASE_URL`、接口路径、QWEN Key 和 QWEN 原始域名是否安全。
它也会模拟一次小程序 `wx.request`，确认模板实际请求的是 Netlify 后端，并且 API 失败时会回退到本地估算。

1. 打开微信开发者工具。
2. 点击 `导入项目`。
3. 选择你的小程序项目文件夹。
4. 填入小程序 `AppID`。
5. 点击 `导入` 或 `确定`。
6. 等待开发者工具编译。

如果你只是临时预览，可以选择测试号或游客模式。
如果你准备上传审核，一定要填你自己的正式小程序 AppID，不要一直使用模板默认的 `touristappid`。

如果你想先在项目模板里改好 AppID，可以回到本项目文件夹，双击：

```text
set-wechat-appid.cmd
```

按提示粘贴你的正式小程序 AppID，例如：

```text
wx1234567890abcdef
```

脚本会自动更新：

```text
templates/wechat-miniprogram/project.config.json
```

如果已经导入后才发现 AppID 不对：

1. 在微信开发者工具右上角点击 `详情`。
2. 点击 `基本信息`。
3. 找到 `AppID`。
4. 改成你的小程序正式 AppID。
5. 重新编译一次。

如果你还没有完整小程序项目，可以先把这些模板文件交给开发者合并：

```text
templates/wechat-miniprogram/
```

模板里包括：

```text
config/api.js
services/drinkRules.js
services/aiEstimate.js
pages/record/record.js
```

现在 `templates/wechat-miniprogram/` 也可以作为最小完整小程序直接导入微信开发者工具。目录里还包括：

```text
app.js
app.json
app.wxss
project.config.json
sitemap.json
pages/record/record.wxml
pages/record/record.wxss
pages/record/record.json
```

如果你没有现成小程序项目，导入项目时直接选择 `templates/wechat-miniprogram/`，编译后打开 `pages/record/record`，就能用自带页面测试 Netlify API。

## 第 6 步：关闭“不校验合法域名”再测试

开发阶段有些项目会勾选 `不校验合法域名`。正式测试前要取消依赖这个选项。

在微信开发者工具里找类似位置：

```text
详情 -> 本地设置 -> 不校验合法域名、web-view 域名、TLS 版本以及 HTTPS 证书
```

测试正式能力时：

```text
[ ] 不要依赖这个选项
[ ] 微信后台 request 合法域名必须已经配置
[ ] 真机预览也要能请求
```

## 第 7 步：在开发者工具里测试 API

1. 打开会触发饮品估算的页面。
2. 输入或选择一杯饮品。
3. 点击提交或估算按钮。
4. 打开开发者工具里的调试器。
5. 看 `Network` 或 `Console`。
6. 确认请求地址是：

```text
https://你的站点.netlify.app/api/estimate-drink
```

7. 确认没有请求：

```text
https://maas-api.cn-huabei-1.xf-yun.com
```

8. 确认代码里搜不到：

```text
QWEN_API_KEY
```

## 第 8 步：真机预览测试

1. 在微信开发者工具顶部点击 `预览`。
2. 工具会生成二维码。
3. 用手机微信扫码。
4. 在手机上打开小程序预览版。
5. 操作一遍饮品估算。
6. 确认能得到 AI 估算结果，或在 API 失败时能回退本地估算。

真机失败时优先检查：

1. 微信后台 `request 合法域名` 是否填了 Netlify 根域名。
2. 小程序 `API_BASE_URL` 是否只填根域名。
3. Netlify API 浏览器打开是否 `ready: true`。
4. Netlify 是否已经重新部署过。

## 第 9 步：上传小程序版本

真机预览通过后，在微信开发者工具里：

1. 点击顶部 `上传`。
2. 填写版本号，例如：

```text
1.0.0
```

3. 填写项目备注，例如：

```text
首次提交：奶茶记录、AI 饮品估算、多 UI 风格切换
```

4. 点击确认上传。
5. 等待上传完成。

## 第 10 步：提交审核

回到微信公众平台：

1. 打开小程序后台。
2. 点击左侧 `版本管理`。
3. 找到刚上传的开发版本。
4. 点击 `提交审核`。
5. 按页面要求填写功能页面、服务类目、隐私说明等。
6. 提交后等待微信审核。
7. 审核通过后，在版本管理里点击 `发布`。

## 上线前最终核对

```text
[ ] Netlify 公共链接可以打开
[ ] https://你的站点.netlify.app/api/estimate-drink 返回 ready: true
[ ] npm run verify:public-api -- https://你的站点.netlify.app 通过
[ ] 微信公众平台 request 合法域名已添加 Netlify 根域名
[ ] 小程序 API_BASE_URL 只包含 Netlify 根域名
[ ] 小程序代码里没有 QWEN_API_KEY
[ ] 小程序代码里没有 maas-api.cn-huabei-1.xf-yun.com
[ ] 开发者工具里能估算饮品
[ ] 真机预览里能估算饮品
[ ] 上传版本成功
[ ] 已提交审核或准备提交审核
```

注意：`check-status.cmd` 里的 `wechat-domain-verified` 需要你手动确认。脚本不能登录微信公众平台，也不能替你真机扫码，所以它会一直提示需要微信后台和真机证据。完成后把合法域名保存时间、真机预览测试时间和请求结果写进：

```text
docs/launch-acceptance-checklist.md
```
