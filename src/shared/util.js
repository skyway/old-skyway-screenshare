/**
 * Get browser name.
 * @return {string} `firefox` OR `chrome` OR `N/A`.
 */
export function getBrowserName() {
  const ua = navigator.userAgent.toLowerCase();

  // Firefox
  if (ua.indexOf('firefox') !== -1) {
    return 'firefox';
  }

  // Chrome
  if (ua.indexOf('chrome') !== -1 && ua.indexOf('edge') === -1) {
    return 'chrome';
  }

  return 'N/A';
}

/**
 * Returns true if extension installed.
 * @return {boolean} Chrome extension is installed or NOT.
 */
export function isChromeExtensionInstalled() {
  if ('ScreenShareExtentionExists' in window) {
    return true;
  }

  return false;
}
