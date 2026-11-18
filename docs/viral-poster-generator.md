# 万能裂变海报生成器 — 使用教程

[← 返回合集首页](../README.md)

## 1. 先看效果

打开仓库里的 `demo/index.html`，不用装小程序就能试：

1. 改昵称，传一张头像（圆形裁剪）。
2. 点「抽一签」，seed 变化，签文跟着变。
3. 切换模板：新年求签 / 打工人今日状态 / 准考证娱乐版。
4. 点「分享解锁」后导出按钮可用，导出 750×1334 PNG。

## 2. 三个模板

| 模板 | templateId | 解锁方式 | 适合发到 |
| --- | --- | --- | --- |
| 新年求签 | new-year-fortune-2026 | 看广告 | 朋友圈、群聊 |
| 打工人今日状态 | worker-status-2026 | 分享解锁 | 朋友圈 |
| 准考证娱乐版 | exam-fun-2026 | 免费 | 朋友圈、群聊 |

模板文件在 `templates/` 和 `skills/viral-poster-generator/assets/templates/`，改 JSON 就能改文案、颜色、位置。

## 3. 新建一个模板

复制 `templates/new-year-fortune.json`，改 4 处：

1. `templateId`：全局唯一。
2. `version`：+1。
3. `background`：新背景图 CDN 链接。
4. `elements` 里 `RandomText.pool`：换成新词库。

不用改代码，不用发版，JSON 上 CDN 就生效。

## 4. 发朋友圈

1. 小程序里生成海报，保存到相册。
2. 打开微信朋友圈，选这张图，配一句文案发出去。
3. 朋友扫海报上的小程序码，进来先看到你的结果，再点“我也要测”。

小程序内分享到朋友圈用 `onShareTimeline`，分享给好友用 `onShareAppMessage`，分享路径要带 `templateId`、`sourceUid`、`seed`。

## 5. 变现

- `unlock_mode: "ad"`：看激励视频解锁无水印高清图，广告加载失败时用分享解锁兜底。
- 水印要画进 Canvas 像素里，解锁要服务端校验，别只靠前端回调。

## 6. 合规提醒

求签、恶搞工资条、准考证娱乐版：别用官方 Logo，加“纯属娱乐”声明，别冒充真实证件。
