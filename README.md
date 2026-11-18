# 万能裂变海报生成器 / Viral Poster Generator

配置驱动的裂变海报引擎：一个 Canvas 渲染器 + JSON 模板 = 无限个玩法。

首发微信小程序 / H5，未来可出 App。所有图片拼接、头像裁剪、文字渲染 100% 在客户端 Canvas 完成，服务端只做拉配置和打点，几乎零服务器成本。

## 快速开始

1. 打开 `demo/index.html`，在线试玩工作台：改昵称、传头像、抽签、解锁、导出 750×1334 PNG。
2. 看 `src/template-dsl.ts` 了解模板协议。
3. 看 `templates/new-year-fortune.json`，复制一份改 `templateId`、`background`、`elements` 就是一个新模板，无需发版。

## 目录

- `src/template-dsl.ts` — 模块 1：万能 JSON 配置协议（TypeScript 定义）
- `src/PosterRenderer.ts` — 模块 2：纯前端 Canvas 核心渲染器（小程序版）
- `templates/` — 模板库：新年求签、打工人今日状态、准考证娱乐版
- `demo/index.html` — 可运行的 Web 版工作台（同一套渲染逻辑）
- `docs/replication-1000.md` — 一个方法复制 1000 次的流水线

## 核心规则（已修正 PRD 的坑）

- 头像不能静默获取：用 `chooseAvatar` 让用户自选，或上传，带 fallback。
- 小程序码不能纯前端生成：云函数调 `wxacode.getUnlimited`，按 `templateId + sourceUid` 缓存到 OSS。
- JSON 配置走静态托管 + CDN，带版本号；云函数只做二维码和打点，别每次打开都调云函数。
- 分享要存随机种子：B 用户按 `sourceUid` 查库还原 A 的签文，光靠 URL 不够。
- 广告解锁要服务端校验，水印直接画进 Canvas 像素里。
- 求签、恶搞工资条、准考证等注意合规：别用官方 Logo，加“纯属娱乐”声明。

## 变现与裂变

- `unlock_mode: "ad"`：看激励视频解锁无水印高清图；广告加载失败时用分享解锁兜底。
- 分享带参：`pages/index/index?templateId=xxx&sourceUid=yyy&seed=zzz`，B 进来先还原 A 的结果，再诱导“我也要测”。
