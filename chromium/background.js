/**
 * Background Service Worker for Color Picker Extension
 * Manifest V3 compliant
 */

// Handle extension action icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) return;
  await initiatePicker(tab.id, tab.url);
});

// Handle keyboard shortcut command (Alt+Shift+C)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'pick_color') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      await initiatePicker(tab.id, tab.url);
    }
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'REQUEST_CAPTURE') {
    (async () => {
      try {
        const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
        sendResponse({ success: true, dataUrl });
      } catch (err) {
        console.error('Failed to capture visible tab:', err);
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true; // Keep message channel open for async response
  }
});

/**
 * Initiates the eyedropper picker on a given tab
 */
async function initiatePicker(tabId, url) {
  // Check for restricted URLs where content scripts cannot execute
  if (
    !url ||
    url.startsWith('chrome://') ||
    url.startsWith('edge://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('devtools://') ||
    url.startsWith('view-source:') ||
    url.includes('chrome.google.com/webstore') ||
    url.includes('chromewebstore.google.com')
  ) {
    try {
      await chrome.action.setBadgeText({ tabId, text: 'ERR' });
      await chrome.action.setBadgeBackgroundColor({ tabId, color: '#e06c75' });
      setTimeout(async () => {
        try {
          await chrome.action.setBadgeText({ tabId, text: '' });
        } catch (_) {}
      }, 3000);
    } catch (_) {}
    return;
  }

  try {
    // 1. Capture current viewport screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });

    // 2. Try sending message to content script
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'START_PICKER', dataUrl });
    } catch (_) {
      // Content script is not injected yet; inject it dynamically
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js'],
      });

      // Small delay to let script initialize listener
      await new Promise((resolve) => setTimeout(resolve, 50));

      await chrome.tabs.sendMessage(tabId, { action: 'START_PICKER', dataUrl });
    }
  } catch (err) {
    console.error('Failed to initiate color picker:', err);
  }
}
