# 效果与安装测试记录

[← 返回合集首页](../README.md)

## 2026-11-18 — 工作台验证

- 海报 Canvas 正确成图：标题、头像、昵称、上上签卡片、二维码占位、斜纹水印、底部解锁条齐全。
- 点「抽一签」后签文变化，seed 实时更新。
- 切换「打工人今日状态」模板成功。
- 点「分享解锁」后导出按钮由禁用变为可用，解锁链路打通。
- 桌面与手机宽度均无横向溢出，代码块在手机宽度下在各自容器内横向滚动。

## 已知限制

- 背景底图在示例 JSON 中为占位 CDN 地址，演示渲染走渐变兜底，这是协议设计的降级路径。
- 小程序码为演示占位图，真码需云函数生成。
- 预览图为 SVG 占位示意，不是最终生成的海报 PNG；最终海报请在 `demo/index.html` 里导出查看。

## 安装测试

```bash
python3 scripts/install_skills.py --list
# 应列出 viral-poster-generator

python3 scripts/install_skills.py --all
# 应输出：已安装 viral-poster-generator → ~/.codex/skills/viral-poster-generator
```
