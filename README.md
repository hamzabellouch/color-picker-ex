# Color Picker

A modern, precision-engineered eyedropper browser extension inspired by **Microsoft PowerToys Color Picker**. Seamlessly inspect, sample, and convert any pixel color on any webpage—featuring a live cursor badge, an interactive vertical shades bar, 15 comprehensive color formats, draggable card interface, and an isolated Shadow DOM architecture.

Compatible with all major modern browsers: **Google Chrome, Brave, Microsoft Edge, Opera, Vivaldi (Chromium-based)** and **Mozilla Firefox**.



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
│   ├── manifest.json  # Chromium Manifest V3 configuration
│   └── README.md      # Chromium setup and usage instructions
│
├── firefox/           # Extension build directory for Mozilla Firefox
│   ├── icons/         # Extension toolbar and store icons (16px, 48px, 128px)
│   ├── utils/         # Mathematical color conversion utilities
│   ├── background.js  # Background script handling action clicks, commands, and captures
│   ├── content.js     # Floating cursor badge, pixel sampling, card UI, and settings
│   ├── demo.html      # Local interactive test page
│   ├── manifest.json  # Firefox Manifest V3 configuration (with Gecko ID)
│   └── README.md      # Firefox setup and usage instructions
│
├── PRIVACY_POLICY.md  # Privacy policy and local data handling guidelines
├── README.md          # Project documentation and setup guide
└── SECURITY.md        # Security policy and vulnerability disclosure guide
```



### <a name="InstallationUsage"></a> ⚙️ Installation & Usage

### <a name="ForChromiumBasedBrowsers"></a> 🌐 For Chromium-Based Browsers (Chrome, Brave, Edge, Opera)

1. Open your Chromium-based browser and navigate to:
   - **Google Chrome / Brave / Opera:** `chrome://extensions/`
   - **Microsoft Edge:** `edge://extensions/`

2. Enable **Developer mode** (toggle located in the top-right corner).

3. Click **Load unpacked**.

4. Select the `chromium` directory:

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
├── manifest.json
└── README.md
```

5. The extension will be installed and ready to use in your browser toolbar.

### <a name="ForMozillaFirefox"></a> 🦊 For Mozilla Firefox

1. Open **Mozilla Firefox** and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file inside the `firefox` folder:

```text
firefox/
└── manifest.json
```

4. The extension is now loaded as a temporary add-on.

> [!NOTE]
> For permanent installation in Firefox, the extension can be packaged and signed through [addons.mozilla.org](https://addons.mozilla.org) (e.g. submitted as a self-distributed/unlisted add-on to generate a signed `.xpi`).



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



### <a name="Privacy & Safety"></a> 🛡️ Privacy & Safety

- **Local Processing:** All screen capture, canvas rendering, and color sampling operations occur strictly within your browser's local memory. No screenshot data or sampled colors are ever transmitted to external servers.
- **Safe & Isolated:** Rendered using open Shadow DOM technology to prevent website scripts from interacting with or inspecting sampled colors.
- **Zero Telemetry:** No user analytics, tracking SDKs, or background telemetry.



### <a name="Copyright©2026"></a> Copyright © 2026

Thank you for engaging with us. For inquiries or collaboration, please contact:  
hamzabellouchcontact@gmail.com

Stay connected and follow us on:  
[WhatsApp](https://whatsapp.com/channel/0029Vb7MArw0LKZMpjjqOk2P) | [Facebook](https://facebook.com/hamzabellouch1) | [Instagram](https://instagram.com/hamzabellouch0) | [Twitter](https://twitter.com/hamzabellouch0) | [Telegram](https://t.me/hammzabellouch) | [LinkedIn](https://www.linkedin.com/in/hamzabellouch)
