/**
 * Color manipulation and conversion utilities for Color Picker extension
 * Complete suite matching Microsoft PowerToys Color Picker
 */

export function rgbToHex(r, g, b, withHash = false) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  const val = `${toHex(r)}${toHex(g)}${toHex(b)}`;
  return withHash ? `#${val}` : val;
}

export function hexToRgb(hex) {
  let cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToRgbString(r, g, b) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return {
    h: hDeg,
    s: sPct,
    l: lPct,
    string: `hsl(${hDeg}, ${sPct}%, ${lPct}%)`,
  };
}

export function rgbToHsv(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const vPct = Math.round(v * 100);

  return {
    h: hDeg,
    s: sPct,
    v: vPct,
    string: `hsv(${hDeg}, ${sPct}%, ${vPct}%)`,
  };
}

export function rgbToHsb(r, g, b) {
  const hsv = rgbToHsv(r, g, b);
  return {
    ...hsv,
    string: `hsb(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
  };
}

export function rgbToCmyk(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k >= 0.999) {
    return {
      c: 0,
      m: 0,
      y: 0,
      k: 100,
      string: 'cmyk(0%, 0%, 0%, 100%)',
    };
  }

  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  const kPct = Math.round(k * 100);

  return {
    c,
    m,
    y,
    k: kPct,
    string: `cmyk(${c}%, ${m}%, ${y}%, ${kPct}%)`,
  };
}

export function rgbToHsi(r, g, b) {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const i = (rN + gN + bN) / 3;
  if (i === 0) return 'hsi(0, 0%, 0%)';
  const min = Math.min(rN, gN, bN);
  const s = 1 - min / i;
  const hsl = rgbToHsl(r, g, b);
  return `hsi(${hsl.h}, ${Math.round(s * 100)}%, ${Math.round(i * 100)}%)`;
}

export function rgbToHwb(r, g, b) {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const w = min;
  const bl = 1 - max;
  const hsl = rgbToHsl(r, g, b);
  return `hwb(${hsl.h}, ${Math.round(w * 100)}%, ${Math.round(bl * 100)}%)`;
}

export function rgbToNcol(r, g, b) {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const w = Math.round(min * 100);
  const bl = Math.round((1 - max) * 100);
  const hsl = rgbToHsl(r, g, b);
  const h = hsl.h;

  let prefix = 'R';
  let pct = 0;
  if (h <= 60) { prefix = 'R'; pct = Math.round((h / 60) * 100); }
  else if (h <= 120) { prefix = 'Y'; pct = Math.round(((h - 60) / 60) * 100); }
  else if (h <= 180) { prefix = 'G'; pct = Math.round(((h - 120) / 60) * 100); }
  else if (h <= 240) { prefix = 'C'; pct = Math.round(((h - 180) / 60) * 100); }
  else if (h <= 300) { prefix = 'B'; pct = Math.round(((h - 240) / 60) * 100); }
  else { prefix = 'M'; pct = Math.round(((h - 300) / 60) * 100); }

  return `${prefix}${pct}, ${w}%, ${bl}%`;
}

export function rgbToXyz(r, g, b) {
  let rL = r / 255, gL = g / 255, bL = b / 255;
  rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
  gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
  bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

  const x = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) * 100;
  const y = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) * 100;
  const z = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) * 100;
  return { x, y, z };
}

export function rgbToCielab(r, g, b) {
  const { x, y, z } = rgbToXyz(r, g, b);
  const xN = 95.047, yN = 100.0, zN = 108.883;

  const fx = x / xN > 0.008856 ? Math.cbrt(x / xN) : (7.787 * (x / xN)) + (16 / 116);
  const fy = y / yN > 0.008856 ? Math.cbrt(y / yN) : (7.787 * (y / yN)) + (16 / 116);
  const fz = z / zN > 0.008856 ? Math.cbrt(z / zN) : (7.787 * (z / zN)) + (16 / 116);

  const L = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return `CIELab(${L.toFixed(2)}, ${a.toFixed(2)}, ${bVal.toFixed(2)})`;
}

export function rgbToCiexyzString(r, g, b) {
  const { x, y, z } = rgbToXyz(r, g, b);
  return `XYZ(${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)})`;
}

export function rgbToVec4(r, g, b) {
  const f = (n) => {
    const v = (n / 255).toFixed(2);
    return (v.endsWith('.00') ? Math.round(n / 255) : parseFloat(v)) + 'f';
  };
  return `(${f(r)}, ${f(g)}, ${f(b)}, 1f)`;
}

export function rgbToDecimal(r, g, b) {
  return ((b << 16) | (g << 8) | r).toString();
}

export function rgbToHexInt(r, g, b) {
  const toH = (n) => ('0' + Math.round(n).toString(16).toUpperCase()).slice(-2);
  return `0xFF${toH(r)}${toH(g)}${toH(b)}`;
}

/**
 * Generates vertical shades & tints for the color.
 */
export function generateShades(r, g, b) {
  const steps = [];
  const tintFactors = [0.45, 0.22];
  for (const factor of tintFactors) {
    steps.push({
      r: Math.round(r + (255 - r) * factor),
      g: Math.round(g + (255 - g) * factor),
      b: Math.round(b + (255 - b) * factor),
      isBase: false,
    });
  }

  steps.push({ r, g, b, isBase: true });

  const shadeFactors = [0.72, 0.42, 0.15];
  for (const factor of shadeFactors) {
    steps.push({
      r: Math.round(r * factor),
      g: Math.round(g * factor),
      b: Math.round(b * factor),
      isBase: false,
    });
  }

  return steps.map((s) => ({
    ...s,
    hex: rgbToHex(s.r, s.g, s.b),
    hexWithHash: rgbToHex(s.r, s.g, s.b, true),
    rgbString: rgbToRgbString(s.r, s.g, s.b),
  }));
}

/**
 * Default formats configuration matching PowerToys Color Picker
 */
export const DEFAULT_FORMATS = [
  { id: 'HEX', name: 'HEX', enabled: true, example: 'ffe4b5' },
  { id: 'RGB', name: 'RGB', enabled: true, example: 'rgb(255, 228, 181)' },
  { id: 'HSL', name: 'HSL', enabled: true, example: 'hsl(38, 100%, 85%)' },
  { id: 'HSV', name: 'HSV', enabled: false, example: 'hsv(38, 29%, 100%)' },
  { id: 'CMYK', name: 'CMYK', enabled: false, example: 'cmyk(0%, 11%, 29%, 0%)' },
  { id: 'HSB', name: 'HSB', enabled: false, example: 'hsb(38, 29%, 100%)' },
  { id: 'HSI', name: 'HSI', enabled: false, example: 'hsi(38, 18%, 87%)' },
  { id: 'HWB', name: 'HWB', enabled: false, example: 'hwb(38, 71%, 0%)' },
  { id: 'NCol', name: 'NCol', enabled: false, example: 'R64, 71%, 0%' },
  { id: 'CIELAB', name: 'CIELAB', enabled: false, example: 'CIELab(91.72, 2.44, 26.36)' },
  { id: 'CIEXYZ', name: 'CIEXYZ', enabled: false, example: 'XYZ(77.3209, 80.0841, 55.1024)' },
  { id: 'VEC4', name: 'VEC4', enabled: false, example: '(1f, 0.89f, 0.71f, 1f)' },
  { id: 'Decimal', name: 'Decimal', enabled: false, example: '11920639' },
  { id: 'HEX_INT', name: 'HEX Int', enabled: false, example: '0xFFFFE4B5' },
  { id: 'HEX_HASH', name: 'HEX with #', enabled: false, example: '#ffe4b5' },
];
