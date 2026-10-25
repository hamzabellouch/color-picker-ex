# Color Picker

A modern, precision-engineered eyedropper browser extension inspired by **Microsoft PowerToys Color Picker**. Seamlessly inspect, sample, and convert any pixel color on any webpage—featuring a live cursor badge, an interactive vertical shades bar, 15 comprehensive color formats, draggable card interface, and an isolated Shadow DOM architecture.

<img width="2752" height="1536" alt="color-picker" src="https://github.com/user-attachments/assets/d16addfd-d4ab-4cf7-811e-2a7b421887f2" />


Compatible with all major modern browsers: **Google Chrome, Brave, Microsoft Edge, Opera, Vivaldi (Chromium-based)** and **Mozilla Firefox**.

</p>
<h3 align="center">Version 1.0.0</h3>
<p align="center">
</p>

> Changes — October 25, 2026

- Initial project release and core architecture setup for Color Picker, a precision-engineered eyedropper extension inspired by **Microsoft PowerToys Color Picker**
- Sub-pixel precision color sampling capturing active tab viewports via `chrome.tabs.captureVisibleTab` and scaling page coordinates against `window.devicePixelRatio` for exact native-resolution pixel extraction (`getImageData`)
- Real-time floating cursor badge tracking pointer coordinates with dynamic color swatch preview, instant HEX readout, and intelligent viewport boundary collision detection
- Draggable color inspection card modal freezing the sampled pixel upon click, relocatable across the screen via title bar mouse dragging, and dismissible with `Esc` or close button
- Comprehensive mathematical color conversion engine supporting 15 distinct formats (`HEX`, `RGB`, `HSL`, `HSV`, `CMYK`, `HSB`, `HSI`, `HWB`, `NCol`, `CIELAB`, `CIEXYZ`, `VEC4`, `Decimal`, `HEX Int`, and `HEX with #`)
- Instant one-click clipboard copying for all 15 color representations with responsive checkmark visual feedback badges and native Clipboard API integration
- Interactive 6-tier vertical monochrome palette generator calculating dynamic tints and shades from pure white highlights down to deep dark undertones with instant one-click swatch adoption
- Persistent recent color history row tracking sampled swatches across browsing sessions via `chrome.storage.local`, complete with smooth active blue selection ring indicators
- In-card Color Formats Settings manager (`⚙️`) enabling dynamic toggling, custom reordering, and template-based user format creation (e.g., `rgba({r}, {g}, {b}, 1.0)`)
- Zero-leakage UI architecture encapsulated entirely inside an open Shadow DOM root (`attachShadow({ mode: 'open' })`), guaranteeing complete style isolation from host webpage CSS and DOM collisions
- Global keyboard shortcut workflows: `Alt + Shift + C` (configurable) for instant eyedropper activation, `Esc` or right-click to safely cancel picking, and `Esc` to dismiss the modal card
- Intelligent page safety verification detecting restricted browser URLs (`chrome://`, `edge://`, DevTools, Web Store) with visual badge alert warnings (`ERR`) and automated fallback script injection
- 100% local client-side execution running strictly in browser memory with zero network tracking, analytics, remote telemetry, or external server communication
- Dedicated standalone build packages and tailored Manifest V3 configurations for Chromium-based browsers (`chromium/`) and Mozilla Firefox (`firefox/` with Gecko ID `color-picker@tkno`)

> Build Status

```bash
BUILD SUCCESSFUL
```



### <a name="Features"></a> ⭐ Features

- **Live Floating Cursor Badge:** Hover over any pixel on screen to inspect live colors. A sleek, compact badge follows your cursor with a color preview square and real-time HEX code display, featuring intelligent viewport edge collision detection.
- **Precision Pixel Color Sampling:** Automatically scales page coordinates to native screenshot dimensions based on `devicePixelRatio` to sample exact sub-pixel color values (`getImageData`) with 100% accuracy.
- **Draggable Color Picker Window:** Left-click on any pixel to freeze and open the full Color Picker modal right where you clicked. Drag it anywhere across the screen via its top title bar.
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
- **Interactive Vertical Shades & Tints Bar:** Generates a 6-tier vertical monochrome palette ranging from light tints to base color down to deep dark shades. Click any tier to instantly adopt and convert that shade.
- **Recent Swatches History Row:** Displays recently picked color circles. Click any swatch to inspect its values while the active blue selection ring smoothly highlights your selection.
- **Color Formats Settings Manager:** Click the gear icon (⚙️) inside the card to toggle any format on or off, reorder formats, or create custom templated formats (e.g. `rgba({r}, {g}, {b}, 1.0)`).
- **Isolated Shadow DOM Interface:** Injects the entire UI inside an encapsulated Shadow DOM root, guaranteeing zero CSS interference or style contamination with host websites.
- **Keyboard Shortcuts & Fast Controls:** Activate the eyedropper instantly with `Alt + Shift + C`, cancel picking with `Esc` or right-click, and dismiss the card with `Esc`.
- **100% Local & Zero External Dependencies:** Operates completely client-side in local browser memory with zero tracking, telemetry, or server communication.



### <a name="RepositoryStructure"></a> 📁 Repository Structure

```text
├── chromium/          # Extension build directory for Chrome, Brave, Edge, Opera, Vivaldi, etc.
│   ├── icons/         # Extension toolbar and store icons (16px, 48px, 128px)
│   ├── utils/         # Mathematical color conversion utilities
│   ├── background.js  # Service worker handling action clicks, commands, and captures
│   ├── content.js     # Floating cursor badge, pixel sampling, card UI, and settings
│   ├── demo.html      # Local interactive test page
│   └── manifest.json  # Chromium Manifest V3 configuration
│
├── firefox/           # Extension build directory for Mozilla Firefox
│   ├── icons/         # Extension toolbar and store icons (16px, 48px, 128px)
│   ├── utils/         # Mathematical color conversion utilities
│   ├── background.js  # Background script handling action clicks, commands, and captures
│   ├── content.js     # Floating cursor badge, pixel sampling, card UI, and settings
│   ├── demo.html      # Local interactive test page
│   └── manifest.json  # Firefox Manifest V3 configuration (with Gecko ID)
│
├── PRIVACY_POLICY.md  # Privacy policy and local data handling guidelines
├── README.md          # Unified project documentation and setup guide
└── SECURITY.md        # Security policy and vulnerability disclosure guide
```



### <a name="InstallationUsage"></a> ⚙️ Installation & Usage

#### 🌐 For Chromium-Based Browsers (Chrome, Brave, Edge, Opera, Vivaldi)

1. Open your Chromium-based browser and navigate to:
   - **Google Chrome / Brave / Opera:** `chrome://extensions/`
   - **Microsoft Edge:** `edge://extensions/`

2. Enable **Developer mode** (toggle switch in the top-right corner).

3. Click **Load unpacked**.

4. Select the `chromium` directory in this project root:
   ```text
   chromium/
   ├── icons/
   │   ├── icon-16.png
   │   ├── icon-48.png
   │   └── icon-128.png
   ├── utils/
   │   └── color.js
   ├── background.js
   ├── content.js
   ├── demo.html
   └── manifest.json
   ```

5. The extension is installed and ready to use in your browser toolbar.

#### 🦊 For Mozilla Firefox

1. Open **Mozilla Firefox** and navigate to:
   ```text
   about:debugging#/runtime/this-firefox
   ```
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file inside the `firefox` folder:
   ```text
   firefox/manifest.json
   ```
4. The extension is loaded as a temporary add-on.

> [!NOTE]
> For permanent installation in Firefox, the extension can be packaged into a `.zip`/`.xpi` file and signed through [addons.mozilla.org](https://addons.mozilla.org) (as a self-distributed/unlisted add-on).



### <a name="HowToUse"></a> 🖱️ How to Use

1. Click the **Color Picker** icon in your browser toolbar or press `Alt + Shift + C`.
2. Move your cursor across the page. The floating badge displays a live color swatch and HEX code.
3. Left-click on any pixel to freeze and open the **Color Picker** card.
4. In the resulting modal card:
   - Click the **Copy** icon next to any format to copy its value directly to your clipboard.
   - Click any shade in the **Vertical Shades Bar** on the left to inspect lighter tints or darker shades.
   - Click any circle in the **Recent History** row to revisit previously sampled colors.
   - Click the **Pick** button to sample another color immediately.
   - Click the **Settings (⚙️)** icon to toggle color formats on/off or create custom format templates.
   - Press `Esc` or click the **✕** button to close the card.



### <a name="Testing"></a> 🧪 Local Testing

Open `demo.html` located in either `chromium/demo.html` or `firefox/demo.html` directly in your browser. This interactive test page contains varied color swatches, smooth CSS gradients, complex multi-color cards, and high-contrast elements designed to test live sampling accuracy.



### <a name="Privacy & Safety"></a> 🛡️ Privacy & Safety

- **Local Processing:** All screen capture, canvas rendering, and color sampling operations occur strictly within your browser's local memory. No screenshot data or sampled colors are ever transmitted to external servers.
- **Safe & Isolated:** Rendered using open Shadow DOM technology to prevent website scripts from interacting with or inspecting sampled colors.
- **Zero Telemetry:** No user analytics, tracking SDKs, or background telemetry.



### <a name="Copyright©2026"></a> Copyright © 2026

Thank you for engaging with us. For inquiries or collaboration, please contact:  
hamzabellouchcontact@gmail.com

Stay connected and follow us on:  
[WhatsApp](https://whatsapp.com/channel/0029Vb7MArw0LKZMpjjqOk2P) | [Facebook](https://facebook.com/hamzabellouch1) | [Instagram](https://instagram.com/hamzabellouch0) | [Twitter](https://twitter.com/hamzabellouch0) | [Telegram](https://t.me/hammzabellouch) | [LinkedIn](https://www.linkedin.com/in/hamzabellouch)
