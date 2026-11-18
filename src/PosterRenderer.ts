// 模块 2：纯前端 Canvas 核心渲染器（微信小程序版）
// 原则：不做服务端渲染，所有合图在客户端完成。
// 用原生 Canvas 2D + createOffscreenCanvas，dpr=2~3 导出高清图。

import type { PosterTemplate, RenderInput } from "./template-dsl";

function pickFromPool(pool: string[], seed: number): string {
  // 确定性随机：同一 seed 永远抽到同一条，B 用户才能还原 A 的结果
  let s = seed >>> 0;
  s = (s * 1664525 + 1013904223) >>> 0;
  return pool[s % pool.length];
}

function wrapText(
  ctx: WechatMiniprogram.CanvasContext,
  text: string,
  maxWidth: number,
  maxLines = 3
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth && line) {
      lines.push(line);
      line = ch;
      if (lines.length >= maxLines) break;
    } else {
      line += ch;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

async function loadImage(
  canvas: WechatMiniprogram.Canvas,
  src: string
): Promise<WechatMiniprogram.Image> {
  // 小程序里网络图要先 wx.getImageInfo 下载到本地再画，避免跨域 / 失败
  const info = await new Promise<WechatMiniprogram.GetImageInfoSuccessCallbackResult>(
    (resolve, reject) => {
      wx.getImageInfo({
        src,
        success: resolve,
        fail: reject,
      });
    }
  );
  const img = canvas.createImage();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("image load failed: " + src));
    img.src = info.path;
  });
  return img;
}

export async function renderPoster(
  template: PosterTemplate,
  input: RenderInput
): Promise<string> {
  const dpr = Math.min(wx.getSystemInfoSync().pixelRatio || 2, 3);
  const { width, height } = template.canvas;
  const canvas = wx.createOffscreenCanvas({
    type: "2d",
    width: width * dpr,
    height: height * dpr,
  });
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // 1. 背景：先画渐变兜底，再画网络图，失败也不白屏
  const g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, template.fallbackTheme.from);
  g.addColorStop(1, template.fallbackTheme.to);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
  try {
    const bg = await loadImage(canvas, template.background);
    ctx.drawImage(bg, 0, 0, width, height);
  } catch {
    // 降级：只用渐变 + 标题，保证业务不中断
  }

  // 2. 按顺序画图层
  for (const el of template.elements) {
    if (el.type === "Avatar") {
      const src = input.avatarUrl || el.fallback;
      if (!src) continue;
      try {
        const img = await loadImage(canvas, src);
        ctx.save();
        ctx.beginPath();
        ctx.arc(el.x + el.size / 2, el.y + el.size / 2, el.size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, el.x, el.y, el.size, el.size);
        ctx.restore();
      } catch { /* 头像失败就跳过，不阻塞整张图 */ }
    }

    if (el.type === "Text" || el.type === "StaticText") {
      const raw = el.type === "Text"
        ? el.text.replace("{{nickname}}", input.nickname || "朋友").replace("{{input}}", input.inputText || "")
        : el.text;
      ctx.fillStyle = el.color;
      ctx.font = `${el.bold ? "bold " : ""}${el.fontSize}px sans-serif`;
      ctx.textAlign = el.align || "left";
      const lines = wrapText(ctx, raw, el.maxWidth || 600, el.maxLines || 3);
      lines.forEach((line, i) => {
        ctx.fillText(line, el.x, el.y + i * (el.lineHeight || el.fontSize * 1.4));
      });
    }

    if (el.type === "RandomText") {
      const text = pickFromPool(el.pool, input.seed);
      ctx.fillStyle = el.color;
      ctx.font = `${el.fontSize}px sans-serif`;
      ctx.textAlign = el.align || "center";
      const lines = wrapText(ctx, text, el.maxWidth || 600, el.maxLines || 3);
      lines.forEach((line, i) => {
        ctx.fillText(line, el.x, el.y + i * (el.lineHeight || el.fontSize * 1.4));
      });
    }

    if (el.type === "QRCode") {
      // 注意：真码由云函数生成并缓存到 OSS，这里先画占位图
      try {
        const img = await loadImage(canvas, el.placeholder);
        ctx.drawImage(img, el.x, el.y, el.size, el.size);
      } catch { /* ignore */ }
    }
  }

  // 3. 未解锁水印：直接画进像素里，不是浮层，防简单绕过
  if (!input.unlocked && template.watermarkText) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = "center";
    ctx.fillText(template.watermarkText, 0, 0);
    ctx.restore();
  }

  // 4. 导出高清 PNG
  const res = await new Promise<WechatMiniprogram.CanvasToTempFilePathSuccessCallbackResult>(
    (resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas,
        destWidth: width * dpr,
        destHeight: height * dpr,
        fileType: "png",
        success: resolve,
        fail: reject,
      });
    }
  );
  return res.tempFilePath;
}
