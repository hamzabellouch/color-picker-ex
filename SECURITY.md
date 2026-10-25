# Security Policy

## Supported Versions

The following versions of **Color Picker** are currently supported with security and stability updates.

| Version | Supported |
| -------- | --------- |
| 1.0.x (latest release) | ✅ |
| < 1.0.0 | ❌ |

---

## Reporting a Vulnerability

If you discover a security vulnerability, privacy issue, or behavior that could negatively impact users or the extension, please report it responsibly.

### Before Reporting

Please ensure that:

- The issue is reproducible.
- You are using the latest supported version of **Color Picker**.
- The issue is not caused by modified builds, unsupported browser forks, or conflicting third-party extensions.

### How to Report

You can report vulnerabilities through:

- **GitHub Issues:** [hamzabellouch/color-picker-ex/issues](https://github.com/hamzabellouch/color-picker-ex/issues) (for general non-sensitive bugs or security queries)
- **Email Contact:** `hamzabellouchcontact@gmail.com` (for sensitive vulnerabilities, security disclosures, or exploit details)

When submitting a report, please include:

- Browser name and version (e.g., Chrome 130, Firefox 132, Edge 130)
- Operating system and version (e.g., Windows 11, macOS Sequoia, Ubuntu 24.04)
- **Color Picker** version (e.g., v1.0.0)
- Steps to reproduce the issue
- Target webpage URL where the issue occurred (if applicable)
- Screenshots, logs, or console error messages (if available)
- A clear description of the potential security impact

### Response Policy

Security reports are reviewed as quickly as possible.

If a report is confirmed:

- The vulnerability will be investigated and patched promptly.
- A fix will be included in the next update release.
- Credit may be given to the reporter upon request.

If a report cannot be reproduced, lacks sufficient information, or is determined not to be a security issue, it will be closed with a clear explanation.

---

## Security & Architecture Notes

**Color Picker** runs locally within your browser and is designed with strict security principles:

- **Local Client-Side Execution:** All script logic runs locally using Manifest V3 service workers (Chromium) and background scripts (Firefox). No remote code execution (`eval`, external script injection, or remote CDN loading) is used, fully complying with modern browser extension store security standards.
- **On-Demand Minimal Script Injection:** The interactive color picker overlay and modal interface (`content.js`) are injected into the active tab via `chrome.scripting.executeScript` only when you explicitly activate the eyedropper tool.
- **Isolated Shadow DOM Architecture:** The floating cursor badge and Color Picker card are created inside an isolated Shadow DOM root (`shadowHost.attachShadow({ mode: 'open' })`). This guarantees complete CSS style containment and prevents host webpage scripts from intercepting, modifying, or reading sampled color values.
- **In-Memory Viewport & Pixel Sampling:** Viewport screenshots requested via `chrome.tabs.captureVisibleTab` are rendered strictly onto an offscreen `<canvas>` in local memory. Real-time cursor coordinates are mapped to canvas pixels to extract exact RGBA values via `ctx.getImageData()`. Screenshot data URLs and canvas contexts are discarded immediately from memory when the picker mode is completed or closed.
- **Local Storage Security:** Persistent data stored in `chrome.storage.local` is strictly restricted to user UI preferences (enabled color format IDs and the last 5 color swatches in recent history). No URLs, webpage content, or personal identifiers are stored.
- **Zero Background Telemetry:** The extension contains zero tracking SDKs, analytics beacons, telemetry collectors, or background network calls.

Users are encouraged to:

- Keep **Color Picker** updated to the latest release.
- Install the extension only from the official verified sources or direct repository releases.
- Avoid installing modified, repackaged, or unofficial third-party builds.
- Report any unexpected behavior that could affect security or privacy.

Security and user privacy are foundational priorities for this project.
