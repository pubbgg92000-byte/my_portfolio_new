// Small procedural textures drawn on canvas so the world needs no extra image downloads.
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

const fontFamily = (variable: string, fallback: string) => {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.body).getPropertyValue(variable).trim() || fallback;
};

export const displayFont = () => fontFamily("--font-geist", "system-ui, sans-serif");
export const bodyFont = () => fontFamily("--font-inter", "system-ui, sans-serif");

type SignOptions = {
  width: number;
  height: number;
  background: string;
  draw: (context: CanvasRenderingContext2D, width: number, height: number) => void;
};

export function canvasTexture({ width, height, background, draw }: SignOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  draw(context, width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Centred lines of text: [text, sizePx, colour, weight, letterSpacingPx?]. */
export function textTexture(width: number, height: number, background: string, lines: [string, number, string, number, number?][]) {
  return canvasTexture({
    width, height, background,
    draw: (context) => {
      const total = lines.reduce((sum, [, size]) => sum + size * 1.25, 0);
      let y = (height - total) / 2;
      context.textAlign = "center";
      context.textBaseline = "top";
      for (const [text, size, color, weight, spacing = 0] of lines) {
        const family = weight >= 600 ? displayFont() : bodyFont();
        context.letterSpacing = `${spacing}px`;
        context.font = `${weight} ${size}px ${family}`;
        const fit = Math.min(1, (width * 0.92) / context.measureText(text).width);
        context.font = `${weight} ${Math.floor(size * fit)}px ${family}`;
        context.letterSpacing = `${spacing * fit}px`;
        context.fillStyle = color;
        context.fillText(text, width / 2, y);
        y += size * 1.25;
      }
    },
  });
}

/** Repeating facade: lit and dark windows on a wall colour. */
export function facadeTexture() {
  const texture = canvasTexture({
    width: 256, height: 256, background: "#ffffff",
    draw: (context) => {
      for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 4; column++) {
          const lit = (row * 7 + column * 3) % 5 === 0;
          context.fillStyle = lit ? "#fff3c9" : row % 2 ? "#3e5566" : "#4b6475";
          context.fillRect(column * 64 + 12, row * 32 + 7, 40, 20);
        }
      }
    },
  });
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
}

/** Soft noise used as a normal-ish ripple map for water. */
export function rippleTexture() {
  const texture = canvasTexture({
    width: 256, height: 256, background: "#8080ff",
    draw: (context) => {
      for (let i = 0; i < 900; i++) {
        const x = (i * 97) % 256;
        const y = (i * 61 + (i % 7) * 13) % 256;
        context.fillStyle = i % 2 ? "rgba(150,150,255,.35)" : "rgba(105,105,255,.35)";
        context.beginPath();
        context.ellipse(x, y, 10 + (i % 5) * 3, 3 + (i % 3), (i % 9) / 3, 0, Math.PI * 2);
        context.fill();
      }
    },
  });
  texture.colorSpace = "";
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
}

/** Stone paving slabs with subtle tone variation. */
export function pavingTexture(repeat: number) {
  const texture = canvasTexture({
    width: 256, height: 256, background: "#bdb3a1",
    draw: (context) => {
      for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
          const shade = 222 + ((row * 5 + column * 3) % 4) * 6;
          context.fillStyle = `rgb(${shade},${shade - 6},${shade - 18})`;
          context.fillRect(column * 64 + 2 + (row % 2) * 32, row * 64 + 2, 60, 60);
          context.fillRect(column * 64 + 2 + (row % 2) * 32 - 256, row * 64 + 2, 60, 60);
        }
      }
    },
  });
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  return texture;
}
