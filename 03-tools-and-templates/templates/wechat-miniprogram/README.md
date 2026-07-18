# 微信小程序 API 接入模板

这个目录现在是一个可以直接导入微信开发者工具的最小完整小程序模板，也可以把里面的 API 接入文件复制到你已有的小程序项目里。
它的目标是让小程序只调用你自己的 Netlify 后端：

```text
https://你的网站名.netlify.app/api/estimate-drink
```

不要在小程序里直接调用 QWEN 原始接口，也不要把 QWEN API Key 放进小程序代码。

## 如果你想直接导入这个模板

1. 打开微信开发者工具。
2. 点击左上角 `+` 或 `导入项目`。
3. 项目目录选择：
```text
templates/wechat-miniprogram
```

4. AppID 先用你自己的小程序 AppID；如果只是临时预览，可以选择测试号或游客模式。
5. 导入后先打开 `config/api.js`，确认里面是你的 Netlify 公共链接。
6. 点击微信开发者工具顶部的 `编译`。
7. 打开 `pages/record/record` 页面，点击饮品选项和 `估算价格、热量、糖分` 按钮，确认能出现估算结果。

注意：模板里的 `project.config.json` 默认写的是：

```json
"appid": "touristappid"
```

这只适合临时预览。准备上传审核前，必须在微信开发者工具导入项目时填写你自己的小程序 AppID，或者在开发者工具里进入 `详情 -> 基本信息` 修改 AppID。否则只能本地预览，不能作为你的正式小程序上传。

你也可以回到本项目文件夹，双击：

```text
set-wechat-appid.cmd
```

然后粘贴你的正式小程序 AppID，例如：

```text
wx1234567890abcdef
```

脚本会自动更新 `project.config.json` 里的 `appid`。

模板已经包含：
```text
app.js
app.json
app.wxss
project.config.json
sitemap.json
pages/record/record.js
pages/record/record.wxml
pages/record/record.wxss
pages/record/record.json
```

## 如果你想复制到已有小程序

在微信开发者工具里打开你的小程序项目后，把这些文件复制进去：

```text
config/api.js
services/drinkRules.js
services/aiEstimate.js
pages/record/record.js
```

如果你的项目已经有同名文件，不要直接覆盖，先把里面的函数合并进去。

## 必改项

如果你刚拿到 Netlify 公共链接，最推荐先回到本项目文件夹，双击：

```text
after-netlify.cmd
```

它会先验证公共 API，通过后自动更新小程序模板里的后端地址。

如果你已经验证过公共 API，只想单独更新小程序模板，双击：

```text
set-wechat-api-url.cmd
```

粘贴你的 Netlify 公共链接，它会自动更新：

```text
config/api.js
```

如果你想手动改，打开：

```text
config/api.js
```

把：

```js
export const API_BASE_URL = "https://你的站点.netlify.app";
```

改成你的 Netlify 公共链接，例如：

```js
export const API_BASE_URL = "https://today-no-milktea.netlify.app";
```

注意：这里只填域名，不要加 `/api/estimate-drink`。

改完后，回到本项目文件夹，双击：

```text
check-wechat-template.cmd
```

确认模板里没有 QWEN Key、没有 QWEN 原始域名，且 `API_BASE_URL` 没有带 `/api/estimate-drink`。
这个检查还会模拟一次 `wx.request` 成功和一次失败，确认模板会请求 Netlify 后端，并且失败时会回退到本地估算。

## 微信后台必须配置

在微信公众平台里进入：

```text
开发 -> 开发管理 -> 开发设置 -> 服务器域名 -> request 合法域名
```

添加：

```text
https://你的站点.netlify.app
```

不要填：

```text
https://你的站点.netlify.app/api/estimate-drink
```

## 怎么调用

页面里调用：

```js
import { estimateDrinkSmart } from "../../services/aiEstimate.js";

estimateDrinkSmart(form).then((estimate) => {
  console.log(estimate);
});
```

接口失败时会自动返回本地估算，不会让页面卡死。

## 上线前检查

```text
[ ] API_BASE_URL 是 https:// 开头
[ ] API_BASE_URL 不包含 /api/estimate-drink
[ ] 小程序代码里没有 QWEN_API_KEY
[ ] 小程序代码里没有 maas-api.cn-huabei-1.xf-yun.com
[ ] 微信后台 request 合法域名已添加 Netlify 域名
[ ] 真机预览能拿到 AI智能估算 或 本地兜底估算
```
