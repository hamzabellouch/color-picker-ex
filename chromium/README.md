# Color Picker - Chromium Edition

A modern, high-precision eyedropper browser extension built for **Chromium-based browsers** (Google Chrome, Brave, Microsoft Edge, Opera, Vivaldi), powered by Manifest V3 and background service workers.



### ⭐ Features

- **Live Floating Cursor Badge:** Hover over any pixel on screen to inspect live colors with a live swatch and HEX code.
- **Precision Pixel Color Sampling:** Maps page coordinates to native screenshot pixels based on `devicePixelRatio` to sample exact sub-pixel color values (`getImageData`) with 100% accuracy.
- **Draggable Color Picker Window:** Left-click on any pixel to freeze and open the full Color Picker modal. Drag it across your screen via its top title bar.
- **15 Comprehensive Color Formats:** Instant mathematical conversion and one-click clipboard copying for:
  - **HEX** (`ffe4b5`)
  - **RGB** (`rgb(255, 228, 181)`)
  - **HSL** (`hsl(38, 100%, 85%)`)
  - **HSV** (`hsv(38, 29%, 100%)`)
  - **CMYK** (`cmyk(0%, 11%, 29%, 0%)`)
  - **HSB** (`hsb(38, 29%, 100%)`)
  - **HSI** (`hsi(38, 18%, 87%)`)
  - **HWB** (`hwb(38, 71%, 0%)`)
  - **NCol** (`R64, 71%, 0%`)
  - **CIELAB** (`CIELab(91.72, 2.44, 26.36)`)
  - **CIEXYZ** (`XYZ(77.3209, 80.0841, 55.1024)`)
  - **VEC4** (`(1f, 0.89f, 0.71f, 1f)`)
  - **Decimal** (`11920639`)
  - **HEX Int** (`0xFFFFE4B5`)
  - **HEX with #** (`#ffe4b5`)
- **Interactive Vertical Shades & Tints Bar:** 6-tier monochrome palette ranging from light tints to deep dark shades. Click any tier to adopt and convert that shade.
- **Recent Swatches History Row:** Displays recently picked color circles. Click any swatch to inspect its values while the active blue selection ring smoothly highlights your selection.
- **Color Formats Settings Manager:** Click the gear icon (⚙️) to toggle any format on or off, reorder formats, or create custom templated formats (e.g. `rgba({r}, {g}, {b}, 1.0)`).
- **Isolated Shadow DOM Architecture:** Enforces complete style isolation, preventing website CSS from conflicting with the extension UI.
- **Keyboard Shortcuts & Fast Controls:** Activate the eyedropper instantly with `Alt + Shift + C`, cancel picking with `Esc` or right-click, and dismiss the card with `Esc`.
- **100% Local & Zero External Dependencies:** Operates completely client-side with zero tracking, telemetry, or server communication.



### 📁 Directory Structure

```text
chromium/
├── icons/         # Extension toolbar and management icons (16px, 48px, 128px)
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── utils/         # Mathematical color conversion utilities
│   └── color.js
├── background.js  # Manifest V3 service worker handling actions and tab captures
├── content.js     # Floating badge, pixel sampling, modal UI, and settings
├── demo.html      # Local interactive test page
├── manifest.json  # Chromium Manifest V3 configuration
└── README.md      # Documentation and setup guide
```



### ⚙️ Installation & Setup

1. Open your Chromium-based browser (Google Chrome, Brave, Microsoft Edge, Opera).
2. Navigate to:
   - **Google Chrome / Brave / Opera:** `chrome://extensions/`
   - **Microsoft Edge:** `edge://extensions/`
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click **Load unpacked**.
5. Select this `chromium` folder:
   ```text
   e:\AI Projects\Extensions\Color\chromium
   ```
6. The extension is now loaded and available in your browser toolbar!



### 🖱️ How to Use

1. Click the **Color Picker** icon in your browser toolbar or press `Alt + Shift + C`.
2. Move your cursor over any element on the page. The floating badge displays the live color swatch and HEX code.
3. Left-click to freeze and open the **Color Picker** card.
4. In the resulting modal:
   - Click the **Copy** icon next to any color format to copy it to your clipboard.
   - Click any shade in the **Vertical Shades Bar** on the left to inspect lighter or darker shades.
   - Click any circle in the **Recent History** row to revisit previously picked colors.
   - Click **Pick** to sample another color immediately.
   - Click **Settings (⚙️)** to configure enabled formats or add custom format templates.
   - Press `Esc` or click **✕** to close the window.



### 🧪 Testing

Open the included [demo.html](file:///e:/AI%20Projects/Extensions/Color/chromium/demo.html) directly in your browser to test the color picker across varied palettes, continuous gradients, and high-contrast color cards.



### Copyright © 2026

For inquiries or collaboration, please contact:  
hamzabellouchcontact@gmail.com
