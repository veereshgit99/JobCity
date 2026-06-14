import * as THREE from "three";

let _cached = null;

/**
 * Build a tileable building-windows texture procedurally with a canvas.
 * Each "window" is a small bright pixel patch on a dark wall. The texture
 * uses RepeatWrapping so it tiles across any face size.
 */
export function getWindowTexture() {
  if (_cached) return _cached;
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  // Dark wall base
  ctx.fillStyle = "#0a0a10";
  ctx.fillRect(0, 0, size, size);
  // Window grid: 8 cols x 12 rows
  const cols = 8;
  const rows = 12;
  const wW = size / cols;
  const wH = size / rows;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const lit = Math.random() > 0.25; // ~75% windows lit
      const warm = Math.random() > 0.5;
      ctx.fillStyle = lit
        ? warm
          ? "rgba(255, 215, 145, 1)"
          : "rgba(220, 240, 255, 1)"
        : "rgba(20, 20, 28, 1)";
      const pad = wW * 0.18;
      ctx.fillRect(x * wW + pad, y * wH + pad, wW - pad * 2, wH * 0.55);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _cached = tex;
  return tex;
}

/**
 * Translate a raw "floors" count (= number of jobs / applications) into a
 * visually-sane world-space height using a square-root curve so that a
 * 167-floor building isn't 167× taller than a 1-floor one.
 *
 *   h(1)   ≈ 3.0
 *   h(8)   ≈ 7.7   (skyscraper threshold)
 *   h(50)  ≈ 16.6
 *   h(167) ≈ 29.4
 */
export function floorsToHeight(floors, { unit = 2.2, base = 1.2 } = {}) {
  return Math.max(base + Math.sqrt(Math.max(floors, 0)) * unit, base);
}
