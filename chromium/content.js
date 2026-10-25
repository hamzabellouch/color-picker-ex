/**
 * Color Picker Extension - Content Script
 * Complete implementation with:
 * 1. Live floating cursor badge (Image 2)
 * 2. Precision Color Picker card with vertical shades bar and format copy rows (Image 1)
 * 3. In-card Settings view for toggling/configuring Color Formats (Image 3)
 * 4. Encapsulated in Shadow DOM for 100% style isolation
 */

(() => {
  // Prevent duplicate injection
  if (window.__COLOR_PICKER_INJECTED__) return;
  window.__COLOR_PICKER_INJECTED__ = true;

  // --- STATE ---
  let isPicking = false;
  let currentActiveColor = { r: 13, g: 17, b: 23 }; // Default sample
  // Default recent history
  const DEFAULT_HISTORY = [
    { r: 13, g: 17, b: 23 },
    { r: 48, g: 54, b: 61 },
    { r: 235, g: 54, b: 76 },
    { r: 118, g: 195, b: 203 },
    { r: 255, g: 255, b: 255 },
  ];
  let recentHistory = [...DEFAULT_HISTORY];

  // Default color formats matching Microsoft PowerToys Color Picker
  const DEFAULT_FORMATS = [
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
  let colorFormats = [...DEFAULT_FORMATS];
  let currentCardView = 'picker'; // 'picker' | 'settings' | 'add_format'

  // Canvas & screenshot for pixel sampling
  let screenshotCanvas = null;
  let screenshotCtx = null;
  let screenshotScaleX = 1;
  let screenshotScaleY = 1;

  // Dragging state for the card
  let isDraggingCard = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let cardPosX = 100;
  let cardPosY = 100;

  // Shadow Root Container
  let shadowHost = null;
  let shadowRoot = null;

  // UI Elements inside Shadow Root
  let pickerOverlayEl = null;
  let cursorBadgeEl = null;
  let cardContainerEl = null;

  // Load preferences from chrome.storage
  chrome.storage.local.get(['recentHistory', 'colorFormats'], (res) => {
    if (res.recentHistory && Array.isArray(res.recentHistory) && res.recentHistory.length > 0) {
      recentHistory = res.recentHistory;
    }
    if (res.colorFormats && Array.isArray(res.colorFormats)) {
      const savedMap = new Map(res.colorFormats.map((f) => [f.id, f.enabled]));
      colorFormats = DEFAULT_FORMATS.map((df) => ({
        ...df,
        enabled: savedMap.has(df.id) ? savedMap.get(df.id) : df.enabled,
      }));
      // Keep any custom user-added formats
      const customFormats = res.colorFormats.filter((f) => f.id.startsWith('CUSTOM_'));
      colorFormats.push(...customFormats);
    }
  });

  // --- COLOR MATH UTILITIES ---
  function rgbToHex(r, g, b, withHash = false) {
    const toH = (n) => {
      const h = Math.max(0, Math.min(255, Math.round(n))).toString(16);
      return h.length === 1 ? '0' + h : h;
    };
    const val = `${toH(r)}${toH(g)}${toH(b)}`;
    return withHash ? `#${val}` : val;
  }

  function rgbToRgbString(r, g, b) {
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }

  function rgbToHsl(r, g, b) {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
        case gN: h = (bN - rN) / d + 2; break;
        case bN: h = (rN - gN) / d + 4; break;
      }
      h /= 6;
    }
    const hDeg = Math.round(h * 360);
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);
    return `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;
  }

  function rgbToHsv(r, g, b) {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
        case gN: h = (bN - rN) / d + 2; break;
        case bN: h = (rN - gN) / d + 4; break;
      }
      h /= 6;
    }
    const hDeg = Math.round(h * 360);
    const sPct = Math.round(s * 100);
    const vPct = Math.round(v * 100);
    return `hsv(${hDeg}, ${sPct}%, ${vPct}%)`;
  }

  function rgbToHsb(r, g, b) {
    const hsv = rgbToHsv(r, g, b);
    return hsv.replace('hsv', 'hsb');
  }

  function rgbToCmyk(r, g, b) {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const k = 1 - Math.max(rN, gN, bN);
    if (k >= 0.999) {
      return 'cmyk(0%, 0%, 0%, 100%)';
    }
    const c = Math.round(((1 - rN - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gN - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bN - k) / (1 - k)) * 100);
    const kPct = Math.round(k * 100);
    return `cmyk(${c}%, ${m}%, ${y}%, ${kPct}%)`;
  }

  function rgbToHsi(r, g, b) {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const i = (rN + gN + bN) / 3;
    if (i === 0) return 'hsi(0, 0%, 0%)';
    const min = Math.min(rN, gN, bN);
    const s = 1 - min / i;
    const hsl = rgbToHsl(r, g, b);
    const hDeg = parseInt(hsl.replace(/hsl\((\d+).*/, '$1'), 10) || 0;
    return `hsi(${hDeg}, ${Math.round(s * 100)}%, ${Math.round(i * 100)}%)`;
  }

  function rgbToHwb(r, g, b) {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN);
    const min = Math.min(rN, gN, bN);
    const w = min;
    const bl = 1 - max;
    const hsl = rgbToHsl(r, g, b);
    const hDeg = parseInt(hsl.replace(/hsl\((\d+).*/, '$1'), 10) || 0;
    return `hwb(${hDeg}, ${Math.round(w * 100)}%, ${Math.round(bl * 100)}%)`;
  }

  function rgbToNcol(r, g, b) {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN);
    const min = Math.min(rN, gN, bN);
    const w = Math.round(min * 100);
    const bl = Math.round((1 - max) * 100);
    const hsl = rgbToHsl(r, g, b);
    const h = parseInt(hsl.replace(/hsl\((\d+).*/, '$1'), 10) || 0;

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

  function rgbToXyz(r, g, b) {
    let rL = r / 255, gL = g / 255, bL = b / 255;
    rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
    gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
    bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

    const x = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) * 100;
    const y = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) * 100;
    const z = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) * 100;
    return { x, y, z };
  }

  function rgbToCielab(r, g, b) {
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

  function rgbToCiexyzString(r, g, b) {
    const { x, y, z } = rgbToXyz(r, g, b);
    return `XYZ(${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)})`;
  }

  function rgbToVec4(r, g, b) {
    const f = (n) => {
      const v = (n / 255).toFixed(2);
      return (v.endsWith('.00') ? Math.round(n / 255) : parseFloat(v)) + 'f';
    };
    return `(${f(r)}, ${f(g)}, ${f(b)}, 1f)`;
  }

  function rgbToDecimal(r, g, b) {
    return ((b << 16) | (g << 8) | r).toString();
  }

  function rgbToHexInt(r, g, b) {
    const toH = (n) => ('0' + Math.round(n).toString(16).toUpperCase()).slice(-2);
    return `0xFF${toH(r)}${toH(g)}${toH(b)}`;
  }

  function formatValueForColor(formatId, color) {
    const { r, g, b } = color;
    switch (formatId) {
      case 'HEX':
        return rgbToHex(r, g, b, false);
      case 'HEX_HASH':
        return rgbToHex(r, g, b, true);
      case 'RGB':
        return rgbToRgbString(r, g, b);
      case 'HSL':
        return rgbToHsl(r, g, b);
      case 'HSV':
        return rgbToHsv(r, g, b);
      case 'CMYK':
        return rgbToCmyk(r, g, b);
      case 'HSB':
        return rgbToHsb(r, g, b);
      case 'HSI':
        return rgbToHsi(r, g, b);
      case 'HWB':
        return rgbToHwb(r, g, b);
      case 'NCol':
        return rgbToNcol(r, g, b);
      case 'CIELAB':
        return rgbToCielab(r, g, b);
      case 'CIEXYZ':
        return rgbToCiexyzString(r, g, b);
      case 'VEC4':
        return rgbToVec4(r, g, b);
      case 'Decimal':
        return rgbToDecimal(r, g, b);
      case 'HEX_INT':
        return rgbToHexInt(r, g, b);
      default:
        // Handle custom format template
        const fmt = colorFormats.find((f) => f.id === formatId);
        if (fmt && fmt.template) {
          return fmt.template
            .replace(/{r}/g, r)
            .replace(/{g}/g, g)
            .replace(/{b}/g, b)
            .replace(/{hex}/g, rgbToHex(r, g, b, false));
        }
        return rgbToHex(r, g, b, false);
    }
  }

  function generateShades(r, g, b) {
    const steps = [];
    // 2 tints (lighter)
    const tintFactors = [0.45, 0.22];
    for (const factor of tintFactors) {
      steps.push({
        r: Math.round(r + (255 - r) * factor),
        g: Math.round(g + (255 - g) * factor),
        b: Math.round(b + (255 - b) * factor),
        isBase: false,
      });
    }

    // Base color
    steps.push({ r, g, b, isBase: true });

    // 3 shades (darker)
    const shadeFactors = [0.72, 0.42, 0.15];
    for (const factor of shadeFactors) {
      steps.push({
        r: Math.round(r * factor),
        g: Math.round(g * factor),
        b: Math.round(b * factor),
        isBase: false,
      });
    }

    return steps;
  }

  // --- SHADOW DOM INITIALIZATION ---
  function initShadowHost() {
    if (shadowHost) return;

    shadowHost = document.createElement('div');
    shadowHost.id = 'crx-color-picker-root';
    shadowHost.style.position = 'fixed';
    shadowHost.style.top = '0';
    shadowHost.style.left = '0';
    shadowHost.style.width = '100vw';
    shadowHost.style.height = '100vh';
    shadowHost.style.zIndex = '2147483647';
    shadowHost.style.pointerEvents = 'none';

    shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = getStyles();
    shadowRoot.appendChild(styleEl);

    // Overlay for picking cursor
    pickerOverlayEl = document.createElement('div');
    pickerOverlayEl.className = 'cp-overlay hidden';
    pickerOverlayEl.innerHTML = `
      <div class="cp-cursor-badge" id="cpCursorBadge">
        <div class="cp-badge-swatch" id="cpBadgeSwatch"></div>
        <div class="cp-badge-text" id="cpBadgeText">000000</div>
      </div>
    `;
    shadowRoot.appendChild(pickerOverlayEl);

    // Card Container (for Color Picker Card & Settings)
    cardContainerEl = document.createElement('div');
    cardContainerEl.className = 'cp-card hidden';
    cardContainerEl.id = 'cpCardContainer';
    shadowRoot.appendChild(cardContainerEl);

    document.documentElement.appendChild(shadowHost);

    // Event listeners for overlay
    pickerOverlayEl.addEventListener('mousemove', onOverlayMouseMove);
    pickerOverlayEl.addEventListener('click', onOverlayClick);
    pickerOverlayEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      stopPicking();
    });

    // Global keydown (Esc to cancel)
    window.addEventListener('keydown', onKeyDown, true);

    // Window mousemove / mouseup for card dragging
    window.addEventListener('mousemove', onCardDragMove);
    window.addEventListener('mouseup', onCardDragEnd);
  }

  // --- STYLES INJECTION (SHADOW DOM) ---
  function getStyles() {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        user-select: none;
        -webkit-user-select: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }

      .hidden {
        display: none !important;
      }

      /* Fullscreen Picker Overlay */
      .cp-overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        cursor: crosshair;
        background: transparent;
        pointer-events: auto;
        z-index: 100;
      }

      /* Floating Cursor Badge (Image 2) */
      .cp-cursor-badge {
        position: fixed;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 12px 6px 7px;
        background: #1b2028;
        border: 1px solid #363d49;
        border-radius: 10px;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.15);
        pointer-events: none;
        z-index: 101;
        opacity: 0;
        transition: opacity 0.12s ease-out;
        will-change: transform, left, top;
      }

      .cp-cursor-badge.visible {
        opacity: 1;
      }

      .cp-badge-swatch {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3);
        flex-shrink: 0;
      }

      .cp-badge-text {
        color: #ffffff;
        font-size: 14.5px;
        font-weight: 600;
        letter-spacing: 0.3px;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      /* Color Picker Window / Card (Image 1 & 3) */
      .cp-card {
        position: fixed;
        width: 360px;
        background: #181b22;
        border: 1px solid #2d333b;
        border-radius: 12px;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
        color: #f0f6fc;
        pointer-events: auto;
        z-index: 102;
        overflow: hidden;
        animation: cpCardFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes cpCardFadeIn {
        from {
          opacity: 0;
          transform: scale(0.96) translateY(6px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      /* Card Header */
      .cp-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-bottom: 1px solid #242931;
        background: #161920;
        cursor: grab;
      }

      .cp-header:active {
        cursor: grabbing;
      }

      .cp-title-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13.5px;
        font-weight: 600;
        color: #e6edf3;
      }

      .cp-title-icon {
        color: #388bfd;
        display: flex;
        align-items: center;
      }

      .cp-title-logo {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        object-fit: cover;
        display: block;
        flex-shrink: 0;
      }

      .cp-close-btn, .cp-icon-btn {
        background: transparent;
        border: none;
        color: #8b949e;
        cursor: pointer;
        padding: 5px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }

      .cp-close-btn:hover, .cp-icon-btn:hover {
        background: #282e38;
        color: #ffffff;
      }

      /* Toolbar Row */
      .cp-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px 10px 14px;
        gap: 10px;
      }

      .cp-pick-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #21262d;
        border: 1px solid #30363d;
        color: #e6edf3;
        font-size: 13px;
        font-weight: 500;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, transform 0.05s;
      }

      .cp-pick-btn:hover {
        background: #2a313c;
        border-color: #484f58;
      }

      .cp-pick-btn:active {
        transform: scale(0.97);
      }

      /* Swatches history */
      .cp-history-swatches {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        justify-content: center;
      }

      .cp-swatch-circle {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        position: relative;
        flex-shrink: 0;
      }

      .cp-swatch-circle:hover {
        transform: scale(1.12);
      }

      .cp-swatch-circle.active {
        box-shadow: 0 0 0 2.5px #181b22, 0 0 0 4.5px #388bfd;
        transform: scale(1.05);
      }

      /* Main Body (Split into Left: Shades, Right: Formats) */
      .cp-body-split {
        display: flex;
        gap: 12px;
        padding: 4px 14px 14px 14px;
      }

      /* Left Vertical Shades Bar */
      .cp-shades-bar {
        width: 26px;
        display: flex;
        flex-direction: column;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #30363d;
        background: #0d1117;
        flex-shrink: 0;
      }

      .cp-shade-item {
        flex: 1;
        cursor: pointer;
        transition: opacity 0.12s;
        position: relative;
        min-height: 28px;
      }

      .cp-shade-item:hover {
        opacity: 0.85;
      }

      .cp-shade-item.is-base::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 1.5px solid rgba(255, 255, 255, 0.4);
      }

      /* Right Formats Column */
      .cp-formats-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 260px;
        overflow-y: auto;
      }

      .cp-format-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #21262d;
        border: 1px solid #2d333b;
        border-radius: 8px;
        padding: 9px 12px;
        transition: background 0.15s, border-color 0.15s;
      }

      .cp-format-row:hover {
        background: #252b34;
        border-color: #3b434f;
      }

      .cp-format-info {
        display: flex;
        align-items: center;
        gap: 16px;
        overflow: hidden;
      }

      .cp-format-label {
        font-size: 12.5px;
        font-weight: 600;
        color: #8b949e;
        min-width: 42px;
      }

      .cp-format-value {
        font-size: 13.5px;
        font-weight: 500;
        color: #f0f6fc;
        word-break: break-all;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      }

      .cp-copy-btn {
        background: transparent;
        border: none;
        color: #8b949e;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s, transform 0.05s;
        flex-shrink: 0;
      }

      .cp-copy-btn:hover {
        background: #30363d;
        color: #ffffff;
      }

      .cp-copy-btn:active {
        transform: scale(0.92);
      }

      .cp-copy-btn.copied {
        color: #3fb950 !important;
      }

      /* Toast notification */
      .cp-toast {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        background: #238636;
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        padding: 5px 12px;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        pointer-events: none;
        animation: cpToastFade 1.6s forwards;
      }

      @keyframes cpToastFade {
        0% { opacity: 0; transform: translate(-50%, 8px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        75% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -4px); }
      }

      /* --- SETTINGS VIEW ("Color formats" - Image 3) --- */
      .cp-settings-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 12px 14px;
        border-bottom: 1px solid #242931;
        background: #161920;
      }

      .cp-settings-title-group {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }

      .cp-settings-title {
        font-size: 14px;
        font-weight: 600;
        color: #e6edf3;
        line-height: 1.2;
      }

      .cp-settings-subtitle {
        font-size: 11px;
        color: #8b949e;
        margin-top: 3px;
      }

      .cp-add-format-btn {
        background: #76c3cb;
        color: #0d1117;
        font-size: 11.5px;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        padding: 6px 10px;
        cursor: pointer;
        transition: background 0.15s, transform 0.05s;
        white-space: nowrap;
      }

      .cp-add-format-btn:hover {
        background: #8dd6df;
      }

      .cp-add-format-btn:active {
        transform: scale(0.96);
      }

      .cp-settings-list {
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: 290px;
        overflow-y: auto;
      }

      .cp-setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        background: #21262d;
        border: 1px solid #2d333b;
        border-radius: 8px;
        transition: background 0.15s;
      }

      .cp-setting-item:hover {
        background: #262c35;
      }

      .cp-setting-item-name {
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
      }

      .cp-setting-item-preview {
        font-size: 11.5px;
        color: #8b949e;
        font-family: monospace;
        margin-top: 2px;
      }

      .cp-setting-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      /* Toggle Switch */
      .cp-switch {
        position: relative;
        display: inline-block;
        width: 38px;
        height: 20px;
        cursor: pointer;
      }

      .cp-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .cp-slider {
        position: absolute;
        inset: 0;
        background-color: #30363d;
        border-radius: 20px;
        transition: background-color 0.2s;
      }

      .cp-slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: #c9d1d9;
        border-radius: 50%;
        transition: transform 0.2s, background-color 0.2s;
      }

      .cp-switch input:checked + .cp-slider {
        background-color: #76c3cb;
      }

      .cp-switch input:checked + .cp-slider:before {
        transform: translateX(18px);
        background-color: #0d1117;
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #30363d;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #484f58;
      }
    `;
  }

  const LOGO_DATA_URL = "data:image/png;base64,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";
  // --- SVG ICONS ---
  const ICONS = {
    dropper: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 7 3 3-9 9-4 1 1-4 9-9z"/><path d="m17 4 3 3"/><path d="m19 2 3 3"/></svg>`,
    copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    check: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    gear: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    close: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    list: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    more: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>`,
  };

  // --- PICKER WORKFLOW ---
  function startPicking(dataUrl) {
    initShadowHost();

    // Hide any open card while picking
    cardContainerEl.classList.add('hidden');

    // Create canvas to sample pixel colors from dataUrl
    const img = new Image();
    img.onload = () => {
      screenshotCanvas = document.createElement('canvas');
      screenshotCanvas.width = img.naturalWidth;
      screenshotCanvas.height = img.naturalHeight;
      screenshotCtx = screenshotCanvas.getContext('2d', { willReadFrequently: true });
      screenshotCtx.drawImage(img, 0, 0);

      screenshotScaleX = img.naturalWidth / window.innerWidth;
      screenshotScaleY = img.naturalHeight / window.innerHeight;

      isPicking = true;
      pickerOverlayEl.classList.remove('hidden');

      // Initialize cursor badge
      cursorBadgeEl = shadowRoot.getElementById('cpCursorBadge');
      if (cursorBadgeEl) {
        cursorBadgeEl.classList.remove('visible');
      }
      updateBadgeColor({ r: 13, g: 17, b: 23 });
    };
    img.src = dataUrl;
  }

  function stopPicking() {
    isPicking = false;
    if (pickerOverlayEl) {
      pickerOverlayEl.classList.add('hidden');
    }
    if (cursorBadgeEl) {
      cursorBadgeEl.classList.remove('visible');
    }
  }

  function onOverlayMouseMove(e) {
    if (!isPicking || !screenshotCtx) return;

    if (cursorBadgeEl && !cursorBadgeEl.classList.contains('visible')) {
      cursorBadgeEl.classList.add('visible');
    }

    const x = Math.min(screenshotCanvas.width - 1, Math.max(0, Math.floor(e.clientX * screenshotScaleX)));
    const y = Math.min(screenshotCanvas.height - 1, Math.max(0, Math.floor(e.clientY * screenshotScaleY)));

    const pixel = screenshotCtx.getImageData(x, y, 1, 1).data;
    const color = { r: pixel[0], g: pixel[1], b: pixel[2] };

    updateBadgePosition(e.clientX, e.clientY);
    updateBadgeColor(color);
  }

  function updateBadgePosition(cursorX, cursorY) {
    if (!cursorBadgeEl) return;
    const badgeWidth = 115;
    const badgeHeight = 44;

    let posX = cursorX + 18;
    let posY = cursorY + 18;

    // Flip horizontally if overflow
    if (posX + badgeWidth > window.innerWidth - 10) {
      posX = cursorX - badgeWidth - 18;
    }
    // Flip vertically if overflow
    if (posY + badgeHeight > window.innerHeight - 10) {
      posY = cursorY - badgeHeight - 18;
    }

    cursorBadgeEl.style.left = `${posX}px`;
    cursorBadgeEl.style.top = `${posY}px`;
  }

  function updateBadgeColor(color) {
    const swatch = shadowRoot.getElementById('cpBadgeSwatch');
    const text = shadowRoot.getElementById('cpBadgeText');
    if (!swatch || !text) return;

    const hex = rgbToHex(color.r, color.g, color.b, false);
    swatch.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    text.textContent = hex;
  }

  function onOverlayClick(e) {
    if (!isPicking || !screenshotCtx) return;

    const x = Math.min(screenshotCanvas.width - 1, Math.max(0, Math.floor(e.clientX * screenshotScaleX)));
    const y = Math.min(screenshotCanvas.height - 1, Math.max(0, Math.floor(e.clientY * screenshotScaleY)));
    const pixel = screenshotCtx.getImageData(x, y, 1, 1).data;

    const pickedColor = { r: pixel[0], g: pixel[1], b: pixel[2] };
    addPickedColorToHistory(pickedColor);

    stopPicking();

    // Position the card near click location with viewport clamping
    cardPosX = Math.min(window.innerWidth - 380, Math.max(20, e.clientX - 20));
    cardPosY = Math.min(window.innerHeight - 380, Math.max(20, e.clientY - 20));

    currentCardView = 'picker';
    renderCard();
    cardContainerEl.classList.remove('hidden');
  }

  /**
   * Called only when picking a NEW color from the screen.
   * Prepends the new color to history.
   */
  function addPickedColorToHistory(color) {
    currentActiveColor = color;

    // Add to recent history (avoid duplicate)
    const hex = rgbToHex(color.r, color.g, color.b);
    recentHistory = recentHistory.filter((c) => rgbToHex(c.r, c.g, c.b) !== hex);
    recentHistory.unshift(color);
    if (recentHistory.length > 5) {
      recentHistory = recentHistory.slice(0, 5);
    }

    chrome.storage.local.set({ recentHistory });
  }

  // --- RENDER CARD (Image 1 & Image 3) ---
  function renderCard() {
    if (!cardContainerEl) return;

    cardContainerEl.style.left = `${cardPosX}px`;
    cardContainerEl.style.top = `${cardPosY}px`;

    if (currentCardView === 'picker') {
      renderPickerView();
    } else if (currentCardView === 'settings') {
      renderSettingsView();
    }
  }

  /**
   * Render the Main Color Picker View (Image 1)
   */
  function renderPickerView() {
    const shades = generateShades(currentActiveColor.r, currentActiveColor.g, currentActiveColor.b);
    const activeHex = rgbToHex(currentActiveColor.r, currentActiveColor.g, currentActiveColor.b);

    // Filter enabled formats
    const activeFormats = colorFormats.filter((f) => f.enabled);

    // Format rows HTML
    const formatRowsHtml = activeFormats
      .map((fmt) => {
        const val = formatValueForColor(fmt.id, currentActiveColor);
        return `
          <div class="cp-format-row" data-format-id="${fmt.id}">
            <div class="cp-format-info">
              <span class="cp-format-label">${fmt.name}</span>
              <span class="cp-format-value" id="val-${fmt.id}">${val}</span>
            </div>
            <button class="cp-copy-btn" data-copy-val="${val}" title="Copy to clipboard">
              ${ICONS.copy}
            </button>
          </div>
        `;
      })
      .join('');

    // History swatches HTML (circle items)
    const historyHtml = recentHistory
      .map((col) => {
        const hHex = rgbToHex(col.r, col.g, col.b);
        const isActive = hHex === activeHex ? 'active' : '';
        return `
          <div class="cp-swatch-circle ${isActive}" 
               style="background-color: rgb(${col.r}, ${col.g}, ${col.b})"
               data-r="${col.r}" data-g="${col.g}" data-b="${col.b}"
               title="${hHex}">
          </div>
        `;
      })
      .join('');

    // Shades bar HTML (vertical segments)
    const shadesHtml = shades
      .map((s) => {
        const isB = s.isBase ? 'is-base' : '';
        return `
          <div class="cp-shade-item ${isB}" 
               style="background-color: rgb(${s.r}, ${s.g}, ${s.b})"
               data-r="${s.r}" data-g="${s.g}" data-b="${s.b}"
               title="${s.hex}">
          </div>
        `;
      })
      .join('');

    cardContainerEl.innerHTML = `
      <!-- Header -->
      <div class="cp-header" id="cpCardHeader">
        <div class="cp-title-wrap">
          <img src="${LOGO_DATA_URL}" class="cp-title-logo" alt="Color Picker" />
          <span>Color Picker</span>
        </div>
        <button class="cp-close-btn" id="cpCloseBtn" title="Close (Esc)">
          ${ICONS.close}
        </button>
      </div>

      <!-- Toolbar -->
      <div class="cp-toolbar">
        <button class="cp-pick-btn" id="cpPickAgainBtn">
          ${ICONS.dropper}
          <span>Pick</span>
        </button>

        <div class="cp-history-swatches">
          ${historyHtml}
        </div>

        <button class="cp-icon-btn" id="cpSettingsBtn" title="Color Formats Settings">
          ${ICONS.gear}
        </button>
      </div>

      <!-- Main Body -->
      <div class="cp-body-split">
        <!-- Vertical Shades Bar -->
        <div class="cp-shades-bar">
          ${shadesHtml}
        </div>

        <!-- Formats Column -->
        <div class="cp-formats-column">
          ${formatRowsHtml.length > 0 ? formatRowsHtml : '<div style="color:#8b949e;font-size:13px;padding:12px;">No formats enabled. Click settings ⚙️ to enable formats.</div>'}
        </div>
      </div>
    `;

    // Attach interactions
    attachPickerViewEvents();
  }

  function attachPickerViewEvents() {
    // Header drag handler
    const header = shadowRoot.getElementById('cpCardHeader');
    header.addEventListener('mousedown', onCardDragStart);

    // Close button
    const closeBtn = shadowRoot.getElementById('cpCloseBtn');
    closeBtn.addEventListener('click', closeCard);

    // Pick again button
    const pickBtn = shadowRoot.getElementById('cpPickAgainBtn');
    pickBtn.addEventListener('click', () => {
      cardContainerEl.classList.add('hidden');
      // Wait for next paint so the card is completely absent from viewport screenshot
      setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'REQUEST_CAPTURE' }, (res) => {
          if (res && res.dataUrl) {
            startPicking(res.dataUrl);
          }
        });
      }, 60);
    });

    // Settings button
    const settingsBtn = shadowRoot.getElementById('cpSettingsBtn');
    settingsBtn.addEventListener('click', () => {
      currentCardView = 'settings';
      renderCard();
    });

    // Swatches click - Move active selection ring to the clicked swatch without reordering
    const swatches = shadowRoot.querySelectorAll('.cp-swatch-circle');
    swatches.forEach((el) => {
      el.addEventListener('click', () => {
        const r = parseInt(el.dataset.r, 10);
        const g = parseInt(el.dataset.g, 10);
        const b = parseInt(el.dataset.b, 10);
        currentActiveColor = { r, g, b };
        renderCard();
      });
    });

    // Shades bar click - Update active color and card details
    const shadeItems = shadowRoot.querySelectorAll('.cp-shade-item');
    shadeItems.forEach((el) => {
      el.addEventListener('click', () => {
        const r = parseInt(el.dataset.r, 10);
        const g = parseInt(el.dataset.g, 10);
        const b = parseInt(el.dataset.b, 10);
        currentActiveColor = { r, g, b };
        renderCard();
      });
    });

    // Copy buttons
    const copyBtns = shadowRoot.querySelectorAll('.cp-copy-btn');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.dataset.copyVal;
        copyToClipboard(textToCopy, btn);
      });
    });
  }

  /**
   * Render the Settings View ("Color formats" - Image 3)
   */
  function renderSettingsView() {
    const formatItemsHtml = colorFormats
      .map((fmt, idx) => {
        const isChecked = fmt.enabled ? 'checked' : '';
        const previewVal = formatValueForColor(fmt.id, currentActiveColor) || fmt.example;
        return `
          <div class="cp-setting-item" data-id="${fmt.id}" data-idx="${idx}">
            <div>
              <div class="cp-setting-item-name">${fmt.name}</div>
              <div class="cp-setting-item-preview">${previewVal}</div>
            </div>
            <div class="cp-setting-controls">
              <label class="cp-switch">
                <input type="checkbox" data-format-id="${fmt.id}" class="cp-format-toggle" ${isChecked}>
                <span class="cp-slider"></span>
              </label>
              <button class="cp-icon-btn cp-format-more-btn" data-format-id="${fmt.id}" data-idx="${idx}" title="Options">
                ${ICONS.more}
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    cardContainerEl.innerHTML = `
      <!-- Header -->
      <div class="cp-settings-header" id="cpCardHeader">
        <div class="cp-settings-title-group">
          <button class="cp-icon-btn" id="cpSettingsBackBtn" title="Back to Picker">
            ${ICONS.back}
          </button>
          <div>
            <div class="cp-settings-title">${ICONS.list} Color formats</div>
            <div class="cp-settings-subtitle">Configure the color formats (edit, delete, hide, reorder them)</div>
          </div>
        </div>
        <button class="cp-add-format-btn" id="cpAddFormatBtn">
          Add new format
        </button>
      </div>

      <!-- Formats List -->
      <div class="cp-settings-list">
        ${formatItemsHtml}
      </div>
    `;

    attachSettingsViewEvents();
  }

  function attachSettingsViewEvents() {
    const header = shadowRoot.getElementById('cpCardHeader');
    header.addEventListener('mousedown', onCardDragStart);

    // Back button
    const backBtn = shadowRoot.getElementById('cpSettingsBackBtn');
    backBtn.addEventListener('click', () => {
      currentCardView = 'picker';
      renderCard();
    });

    // Format toggles
    const toggles = shadowRoot.querySelectorAll('.cp-format-toggle');
    toggles.forEach((toggle) => {
      toggle.addEventListener('change', (e) => {
        const formatId = e.target.dataset.formatId;
        const enabled = e.target.checked;
        const fmt = colorFormats.find((f) => f.id === formatId);
        if (fmt) {
          fmt.enabled = enabled;
          chrome.storage.local.set({ colorFormats });
        }
      });
    });

    // More options button (...)
    const moreBtns = shadowRoot.querySelectorAll('.cp-format-more-btn');
    moreBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const formatId = btn.dataset.formatId;
        const idx = parseInt(btn.dataset.idx, 10);
        const fmt = colorFormats[idx];
        if (!fmt) return;

        const action = prompt(
          `Format: ${fmt.name}\n1. Type "top" to move to top\n${fmt.id.startsWith('CUSTOM_') ? '2. Type "delete" to delete format\n' : ''}3. Type "copy" to copy sample value`,
          'top'
        );

        if (!action) return;

        if (action.toLowerCase() === 'top' && idx > 0) {
          colorFormats.splice(idx, 1);
          colorFormats.unshift(fmt);
          chrome.storage.local.set({ colorFormats });
          renderSettingsView();
        } else if (action.toLowerCase() === 'delete' && fmt.id.startsWith('CUSTOM_')) {
          colorFormats.splice(idx, 1);
          chrome.storage.local.set({ colorFormats });
          renderSettingsView();
        } else if (action.toLowerCase() === 'copy') {
          const val = formatValueForColor(fmt.id, currentActiveColor);
          copyToClipboard(val, null);
        }
      });
    });

    // Add format button
    const addBtn = shadowRoot.getElementById('cpAddFormatBtn');
    addBtn.addEventListener('click', () => {
      const name = prompt('Enter format name (e.g. RGBA Float, Swift UIColor):');
      if (!name) return;
      const template = prompt(
        'Enter format template using {r}, {g}, {b}, or {hex}:\nExample: rgba({r}, {g}, {b}, 1.0)',
        'rgba({r}, {g}, {b}, 1.0)'
      );
      if (!template) return;

      const newId = 'CUSTOM_' + Date.now();
      colorFormats.push({
        id: newId,
        name: name.trim(),
        enabled: true,
        template: template.trim(),
        example: template.replace(/{r}/g, '255').replace(/{g}/g, '228').replace(/{b}/g, '181').replace(/{hex}/g, 'ffe4b5'),
      });

      chrome.storage.local.set({ colorFormats });
      renderSettingsView();
    });
  }

  // --- CARD DRAGGING ---
  function onCardDragStart(e) {
    // Only drag when clicking the header bar, not buttons
    if (e.target.closest('button') || e.target.closest('input')) return;
    isDraggingCard = true;
    dragStartX = e.clientX - cardPosX;
    dragStartY = e.clientY - cardPosY;
  }

  function onCardDragMove(e) {
    if (!isDraggingCard || !cardContainerEl) return;
    cardPosX = Math.max(10, Math.min(window.innerWidth - 370, e.clientX - dragStartX));
    cardPosY = Math.max(10, Math.min(window.innerHeight - 380, e.clientY - dragStartY));
    cardContainerEl.style.left = `${cardPosX}px`;
    cardContainerEl.style.top = `${cardPosY}px`;
  }

  function onCardDragEnd() {
    isDraggingCard = false;
  }

  // --- CLIPBOARD & TOAST ---
  async function copyToClipboard(text, btnElement) {
    try {
      await navigator.clipboard.writeText(text);

      // Visual feedback on button
      if (btnElement) {
        btnElement.innerHTML = ICONS.check;
        btnElement.classList.add('copied');
        setTimeout(() => {
          btnElement.innerHTML = ICONS.copy;
          btnElement.classList.remove('copied');
        }, 1500);
      }

      showToast(`Copied ${text}`);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }

  function showToast(message) {
    if (!cardContainerEl) return;
    const oldToast = cardContainerEl.querySelector('.cp-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'cp-toast';
    toast.textContent = message;
    cardContainerEl.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 1600);
  }

  function closeCard() {
    if (cardContainerEl) {
      cardContainerEl.classList.add('hidden');
    }
    stopPicking();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      if (isPicking) {
        stopPicking();
      } else if (cardContainerEl && !cardContainerEl.classList.contains('hidden')) {
        closeCard();
      }
    }
  }

  // --- RUNTIME MESSAGE LISTENER ---
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'START_PICKER') {
      startPicking(message.dataUrl);
      sendResponse({ status: 'ok' });
    }
    return true;
  });
})();
