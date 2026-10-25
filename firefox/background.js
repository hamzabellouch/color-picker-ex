/**
 * Background Script for Color Picker Extension (Firefox Edition)
 * Compatible with Firefox Manifest V3
 */

const extAPI = typeof browser !== 'undefined' ? browser : chrome;

// Handle extension action icon click
extAPI.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) return;
  await initiatePicker(tab.id, tab.url);
});

// Handle keyboard shortcut command (Alt+Shift+C)
extAPI.commands.onCommand.addListener(async (command) => {
  if (command === 'pick_color') {
    const [tab] = await extAPI.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      await initiatePicker(tab.id, tab.url);
    }
  }
});

// Handle messages from content script
extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'REQUEST_CAPTURE') {
    (async () => {
      try {
        const dataUrl = await extAPI.tabs.captureVisibleTab(null, { format: 'png' });
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
  // Check for restricted URLs in Firefox where content scripts cannot execute
  if (
    !url ||
    url.startsWith('about:') ||
    url.startsWith('moz-extension:') ||
    url.startsWith('chrome:') ||
    url.startsWith('view-source:') ||
    url.includes('addons.mozilla.org')
  ) {
    try {
      await extAPI.action.setBadgeText({ tabId, text: 'ERR' });
      await extAPI.action.setBadgeBackgroundColor({ tabId, color: '#e06c75' });
      setTimeout(async () => {
        try {
          await extAPI.action.setBadgeText({ tabId, text: '' });
        } catch (_) {}
      }, 3000);
    } catch (_) {}
    return;
  }

  try {
    // 1. Capture current viewport screenshot
    const dataUrl = await extAPI.tabs.captureVisibleTab(null, { format: 'png' });

    // 2. Try sending message to content script
    try {
      await extAPI.tabs.sendMessage(tabId, { action: 'START_PICKER', dataUrl });
    } catch (_) {
      // Content script is not injected yet; inject it dynamically
      await extAPI.scripting.executeScript({
        target: { tabId },
        files: ['content.js'],
      });

      // Small delay to let script initialize listener
      await new Promise((resolve) => setTimeout(resolve, 60));

      await extAPI.tabs.sendMessage(tabId, { action: 'START_PICKER', dataUrl });
    }
  } catch (err) {
    console.error('Failed to initiate color picker:', err);
  }
}
