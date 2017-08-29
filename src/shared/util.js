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
