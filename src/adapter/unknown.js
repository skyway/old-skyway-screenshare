/**
 * ScreenShare class for unknown(not supported browser).
 */
class UnknownAdapter {
  /**
   * Create instance.
   * @param {Logger} logger - Logger instance passed by factory.
   */
  constructor(logger) {
    this._logger = logger;
    this._logger.log('This browser does not support screen share.');
  }

  /**
   * Start screen share.
   * Just rejects for not supported browser.
   * @return {Promise<MediaStream>} - Always returns rejected Promise with error.
   */
  start() {
    const err = new Error('This browser does not support screen share.');
    return Promise.reject(err);
  }

  /**
   * Stop screen share.
   */
  stop() {
    // nothing to do
  }

  /**
   * Returns whether screen sharing is available or NOT.
   * @return {boolean} - Screen sharing is available or NOT.
   */
  isScreenShareAvailable() {
    return false;
  }
}

export default UnknownAdapter;
