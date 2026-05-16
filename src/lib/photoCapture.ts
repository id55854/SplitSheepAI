/** Stub video element for demo mode when no camera stream exists. */
export function createDemoVideoStub(): HTMLVideoElement {
  return document.createElement('video');
}

function drawDemoBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1a3a5c');
  grad.addColorStop(0.3, '#2a5c8a');
  grad.addColorStop(0.55, '#4a8ab0');
  grad.addColorStop(0.75, '#7ab865');
  grad.addColorStop(1, '#6a5840');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

export interface PhotoCaptureInput {
  video: HTMLVideoElement;
  avatarCanvas: HTMLCanvasElement | null;
  speechBubbleEl: HTMLElement | null;
  landmarkName: string;
  speechText: string;
  mirrorVideo?: boolean;
  speechVisible?: boolean;
  bubbleOnRight?: boolean;
}

function drawVideoCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  w: number,
  h: number,
  mirror: boolean,
): void {
  const vw = video.videoWidth || w;
  const vh = video.videoHeight || h;
  if (vw <= 0 || vh <= 0) {
    drawDemoBackground(ctx, w, h);
    return;
  }

  const scale = Math.max(w / vw, h / vh);
  const sw = vw * scale;
  const sh = vh * scale;
  const sx = (w - sw) / 2;
  const sy = (h - sh) / 2;

  ctx.save();
  if (mirror) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh);
  } else {
    ctx.drawImage(video, sx, sy, sw, sh);
  }
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(/\s+/);
  let line = '';
  let cy = y;

  for (let n = 0; n < words.length; n++) {
    const test = line ? `${line} ${words[n]}` : words[n];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = words[n] ?? '';
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cy);
    cy += lineHeight;
  }
  return cy;
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  rect: DOMRect,
  scale: number,
  landmarkName: string,
  speechText: string,
  bubbleOnRight: boolean,
): void {
  const x = rect.left * scale;
  const y = rect.top * scale;
  const w = rect.width * scale;
  const h = rect.height * scale;
  const pad = 14 * scale;
  const radius = 16 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = 'rgba(15, 10, 3, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 168, 67, 0.35)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Tail toward soldier
  ctx.beginPath();
  if (bubbleOnRight) {
    ctx.moveTo(x, y + h * 0.55);
    ctx.lineTo(x - 10 * scale, y + h * 0.52);
    ctx.lineTo(x, y + h * 0.48);
  } else {
    ctx.moveTo(x + w, y + h * 0.55);
    ctx.lineTo(x + w + 10 * scale, y + h * 0.52);
    ctx.lineTo(x + w, y + h * 0.48);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(15, 10, 3, 0.88)';
  ctx.fill();

  ctx.fillStyle = '#d4a843';
  ctx.font = `700 ${10 * scale}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText(landmarkName.toUpperCase(), x + pad, y + pad + 10 * scale);

  ctx.fillStyle = '#fff8ec';
  ctx.font = `${13 * scale}px -apple-system, BlinkMacSystemFont, sans-serif`;
  wrapText(ctx, speechText, x + pad, y + pad + 32 * scale, w - pad * 2, 20 * scale);
  ctx.restore();
}

/** Composite camera + 3D avatar + speech bubble onto one canvas (no DOM screenshot). */
export async function captureArPhoto(input: PhotoCaptureInput): Promise<HTMLCanvasElement> {
  const {
    video,
    avatarCanvas,
    speechBubbleEl,
    landmarkName,
    speechText,
    mirrorVideo,
    speechVisible = true,
    bubbleOnRight = true,
  } = input;

  const vw = video.videoWidth || window.innerWidth;
  const vh = video.videoHeight || window.innerHeight;
  const out = document.createElement('canvas');
  out.width = vw;
  out.height = vh;

  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');

  const scaleX = vw / window.innerWidth;
  const scaleY = vh / window.innerHeight;
  const scale = (scaleX + scaleY) / 2;

  drawVideoCover(ctx, video, vw, vh, !!mirrorVideo);

  if (avatarCanvas && avatarCanvas.width > 0) {
    ctx.drawImage(avatarCanvas, 0, 0, vw, vh);
  }

  if (speechVisible && speechBubbleEl) {
    const rect = speechBubbleEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      drawSpeechBubble(ctx, rect, scale, landmarkName, speechText, bubbleOnRight);
    }
  }

  return out;
}

export function downloadCanvasAsJpeg(canvas: HTMLCanvasElement, filename = 'cuvar-palace.jpg'): void {
  canvas.toBlob(
    blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    'image/jpeg',
    0.92,
  );
}
