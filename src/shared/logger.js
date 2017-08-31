/**
 * Class for logging.
 */
class Logger {
  /**
   * Create Logger instance.
   * @param {boolean} [isDebugMode=false] - If true, print logs.
   */
  constructor(isDebugMode = false) {
    this._enable = isDebugMode;
  }

  /**
   * Log with prefix.
   * @param {...*} message - Arguments to log.
   */
  log(...message) {
    if (this._enable) {
      console.log('SkyWay-ScreenShare: ', ...message);
    }
  }
}

export default Logger;
