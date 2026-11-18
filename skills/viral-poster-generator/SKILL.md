---
name: viral-poster-generator
description: 万能裂变海报生成器 — 配置驱动的 Canvas 海报引擎，一个渲染器 + JSON 模板 = 无限个玩法。新年求签、打工人今日状态、准考证娱乐版，生成 750x1334 海报发朋友圈，朋友扫码就能玩。
---

# 万能裂变海报生成器

## 何时使用

用户想做裂变海报 / 图片生成器、求签、测试类海报、朋友圈海报，或想把一个玩法复制成 1000 个模板时，使用这个 Skill。

## 核心概念

- 一个 Canvas 渲染器 + JSON 模板 = 一个玩法。
- 新玩法只需要一个新 JSON + 一张背景图，不用改代码、不发版。
- 所有合图在客户端 Canvas 完成，服务端只拉配置和打点。

## 模板协议

见 `references/template-dsl.ts`：

- `templateId`、`version`、`background`、`fallbackTheme`、`shareTitle`、`canvas`（750x1334）
- `unlock_mode`: `free` | `ad` | `share`
- 图层：`Avatar`（圆形裁剪）、`Text`（支持 `{{nickname}}`）、`RandomText`（词库 + seed）、`QRCode`（占位图，真码云函数生成）、`StaticText`
- `seed` 决定 `RandomText` 的结果，分享时带上 `seed`，B 用户才能还原 A 的结果。

## 渲染器

见 `references/PosterRenderer.ts`（小程序版）：

1. 先画渐变兜底，再画背景图，失败也不白屏。
2. 按顺序画图层：头像圆形裁剪、文字自动换行、随机签文按 seed 取词、二维码占位。
3. 未解锁水印直接画进 Canvas 像素里。
4. `wx.canvasToTempFilePath` 导出 2-3x 高清 PNG，保存到相册发朋友圈。

Web 版同逻辑见仓库根目录 `demo/index.html`，可直接打开试玩。

## 模板库

`assets/templates/`：

- `new-year-fortune.json` — 新年求签，`unlock_mode: ad`
- `worker-status.json` — 打工人今日状态，`unlock_mode: share`
- `exam-fun.json` — 准考证娱乐版，`unlock_mode: free`

复制一个模板改 `templateId`、`background`、`elements` 就是新玩法。

## 必须遵守的坑

- 头像不能静默获取：用 `chooseAvatar` 自选或上传，带 fallback。
- 小程序码不能纯前端生成：云函数调 `wxacode.getUnlimited`，按 `templateId + sourceUid` 缓存到 OSS。
- JSON 走静态托管 + CDN 带版本号；云函数只做二维码和打点。
- 分享要存随机种子到云数据库，光靠 URL 不够。
- 广告解锁要服务端校验，水印画进像素里。
- 求签、恶搞工资条、准考证注意合规：别用官方 Logo，加“纯属娱乐”声明。

## 朋友圈裂变流程

1. A 生成海报，保存到相册，发朋友圈。
2. 朋友扫海报上的小程序码，进入小程序，先还原 A 的结果。
3. 诱导点“我也要测”，生成自己的海报，再发朋友圈。
4. 小程序内用 `onShareTimeline` 分享到朋友圈，`onShareAppMessage` 分享给好友。

## 复制到 1000 个

见仓库 `docs/replication-1000.md`：先测 10 个模板找爆款公式，再用 AI 批量生成背景图和词库，人工只审文案、图片和合规。
