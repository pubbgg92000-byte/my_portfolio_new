/**
 * Project and portrait images ship as three WebP widths: `name-800.webp`,
 * `name-1200.webp` and `name.webp` (≤1600px). Build a srcSet so each device
 * downloads the smallest file that still looks sharp.
 */
export function responsiveImage(src: string) {
  if (!src.endsWith(".webp") || /-(800|1200)\.webp$/.test(src)) return { src };
  // srcset splits candidates on whitespace, so the URL must never contain a raw space.
  const base = encodeURI(src.replace(/\.webp$/, ""));
  return { src, srcSet: `${base}-800.webp 800w, ${base}-1200.webp 1200w, ${encodeURI(src)} 1600w` };
}
