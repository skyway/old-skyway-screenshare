/**
 * ScreenShare class for Firefox.
 */
class FirefoxAdapter {
  /**
   * Create instance.
   * @param {Logger} logger - Logger instance passed by factory.
   */
  constructor(logger) {
    this._logger = logger;
    this._stream = null;

    this._logger.log('Firefox adapter ready');
  }

  /**
   * Start screen share.
   * For Firefox, you can specify mediaSource to share.
   * @param {Object} [params] - Options for getUserMedia constraints.
   * @param {number} [params.width] - Constraints for width.
   * @param {number} [params.height] - Constraints for height.
   * @param {number} [params.frameRate] - Constraints for frameRate.
   * @param {string} [params.mediaSource] - Constraints for mediaSource.
   * @return {Promise<MediaStream>} - Promise resolved with MediaStream instance.
   */
  start(params = {}) {
    const gUMConstraints = this._paramsToConstraints(params);
    this._logger.log('Parameter of getUserMedia: ', gUMConstraints);

    return navigator.mediaDevices.getUserMedia(gUMConstraints)
      .then(stream => {
        this._stream = stream;

        return Promise.resolve(stream);
      });
  }

  /**
   * Stop screen share.
   */
  stop() {
    if (this._stream instanceof MediaStream === false) {
      return;
    }

    this._stream.getTracks().forEach(track => track.stop());
    this._stream = null;
  }

  /**
   * Returns whether screen sharing is available or NOT.
   * @return {boolean} - Screen sharing is available or NOT.
   */
  isScreenShareAvailable() {
    return true;
  }

  /**
   * Convert from passed user options to MediaStreamConstraints.
   * @param {Object} params - Options for getUserMedia constraints.
   * @param {number} [params.width] - Constraints for width.
   * @param {number} [params.height] - Constraints for height.
   * @param {number} [params.frameRate] - Constraints for frameRate.
   * @param {string} [params.mediaSource] - Constraints for mediaSource.
   * @return {MediaStreamConstraints} - Constraints for getUserMedia.
   * @private
   */
  _paramsToConstraints(params) {
    const gUMConstraints = {
      video: {
        mediaSource: 'window',
      },
      audio: false,
    };

    if ('mediaSource' in params) {
      gUMConstraints.video.mediaSource = params.mediaSource;
    }
    if (isFinite(params.width)) {
      gUMConstraints.video.width = {min: params.width, max: params.width};
    }
    if (isFinite(params.height)) {
      gUMConstraints.video.height = {min: params.height, max: params.height};
    }
    if (isFinite(params.frameRate)) {
      gUMConstraints.video.frameRate = {min: params.frameRate, max: params.frameRate};
    }

    return gUMConstraints;
  }
}

export default FirefoxAdapter;
