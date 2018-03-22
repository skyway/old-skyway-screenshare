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
   * For Chrome, you can specify mediaSource to share via dialog called by Extension.
   * @param {Object} [params] - Options for getUserMedia constraints.
   * @param {number} [params.width] - Constraints for width.
   * @param {number} [params.height] - Constraints for height.
   * @param {number} [params.frameRate] - Constraints for frameRate.
   * @return {Promise<MediaStream>} - Promise resolved with MediaStream instance.
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
