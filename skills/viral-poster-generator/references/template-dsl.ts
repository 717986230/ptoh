// 模块 1：万能 JSON 配置协议 (Template DSL) v1
// 设计稿：750 x 1334，单位 px（设计稿像素），渲染时按 dpr 缩放。
// 所有坐标以左上角为原点。JSON 走 CDN + 版本号，云函数不参与每次拉取。

export type UnlockMode = "free" | "ad" | "share";

export interface TemplateMeta {
  templateId: string; // 全局唯一，如 new-year-fortune-2026
  version: number; // 每次改模板 +1，CDN 缓存靠它失效
  title: string; // 模板名
  background: string; // 背景图 CDN 链接，失败时走 fallbackTheme
  fallbackTheme: { from: string; to: string }; // 渐变兜底
  shareTitle: string; // 分享卡片默认标题
  shareImage?: string;
  canvas: { width: number; height: number }; // 默认 750 x 1334
  unlock_mode: UnlockMode;
  watermarkText?: string; // 未解锁时画进 Canvas 的斜纹水印
  disclaimer?: string; // 如“纯属娱乐”
}

export type Layer =
  | {
      type: "Avatar";
      x: number; y: number; size: number; // 圆形裁剪，直径
      fallback?: string; // 拿不到头像时的默认图
    }
  | {
      type: "Text";
      x: number; y: number;
      text: string; // 支持 {{nickname}}、{{input}} 占位
      fontSize: number; color: string;
      maxWidth?: number; lineHeight?: number; maxLines?: number;
      bold?: boolean; align?: "left" | "center" | "right";
    }
  | {
      type: "RandomText";
      x: number; y: number;
      pool: string[]; // 签文 / 测试结果词库
      seedKey?: string; // 默认用 seed 决定结果，B 用户可还原
      fontSize: number; color: string;
      maxWidth?: number; lineHeight?: number; maxLines?: number;
      align?: "left" | "center" | "right";
    }
  | {
      type: "QRCode";
      x: number; y: number; size: number;
      // 真码由云函数生成并缓存到 OSS，这里只放占位图 URL，渲染时替换
      placeholder: string;
    }
  | {
      type: "StaticText";
      x: number; y: number;
      text: string;
      fontSize: number; color: string;
      align?: "left" | "center" | "right";
    };

export interface PosterTemplate extends TemplateMeta {
  elements: Layer[];
}

export interface RenderInput {
  nickname: string;
  avatarUrl?: string; // chooseAvatar 返回的临时路径
  inputText?: string; // 用户自定义输入
  seed: number; // 随机种子，决定 RandomText，分享时带上可还原
  unlocked: boolean; // 是否已解锁（看广告 / 分享后）
}
