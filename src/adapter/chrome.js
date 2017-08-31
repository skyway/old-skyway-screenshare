/**
 * ScreenShare class for Chrome.
 */
class ChromeAdapter {
  /**
   * Create instance.
   * @param {Logger} logger - Logger instance passed by factory.
   */
  constructor(logger) {
    this._logger = logger;
    this._stream = null;

    this._logger.log('Chrome adapter ready');
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
  start(params = {}) {
    const that = this;

    return new Promise((resolve, reject) => {
      window.addEventListener('message', _onMessage, false);
      window.postMessage({type: 'getStreamId'}, '*');

      /**
       * @param {Event} ev.data - Event data from extension.
       * @param {string} ev.data.type - Event type strings.
       * @param {string} ev.data.streamId - Screen id to share.
       */
      function _onMessage({data}) {
        that._logger.log(`Received ${data.type} message from Extension.`, data);

        if (data.type !== 'gotStreamId') {
          return;
        }

        const gUMConstraints = that._paramsToConstraints(params, data.streamId);
        that._logger.log('Parameter of getUserMedia: ', gUMConstraints);

        navigator.mediaDevices.getUserMedia(gUMConstraints)
          .then(stream => {
            // remove for retry
            window.removeEventListener('message', _onMessage);

            that._stream = stream;
            resolve(stream);
          })
          .catch(err => {
            // remove for cancel
            window.removeEventListener('message', _onMessage);

            reject(err);
          });
      }
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
    if ('__skywayWebRTCScreenShareExtensionAvailable__' in window) {
      return true;
    }

    return false;
  }

  /**
   * Convert from passed user options to MediaStreamConstraints.
   * @param {Object} params - Options for getUserMedia constraints.
   * @param {number} [params.width] - Constraints for width.
   * @param {number} [params.height] - Constraints for height.
   * @param {number} [params.frameRate] - Constraints for frameRate.
   * @param {string} streamId - Constraints for chromeMediaSourceId gotten from extension.
   * @return {MediaStreamConstraints} - Constraints for getUserMedia.
   * @private
   */
  _paramsToConstraints(params, streamId) {
    const gUMConstraints = {
      video: {
        mandatory: {
          chromeMediaSource:   'desktop',
          chromeMediaSourceId: streamId,
        },
        optional: [{
          googTemporalLayeredScreencast: true,
        }],
      },
      audio: false,
    };

    if (isFinite(params.width)) {
      gUMConstraints.video.mandatory.maxWidth = params.width;
      gUMConstraints.video.mandatory.minWidth = params.width;
    }
    if (isFinite(params.height)) {
      gUMConstraints.video.mandatory.maxHeight = params.height;
      gUMConstraints.video.mandatory.minHeight = params.height;
    }
    if (isFinite(params.frameRate)) {
      gUMConstraints.video.mandatory.maxFrameRate = params.frameRate;
      gUMConstraints.video.mandatory.minFrameRate = params.frameRate;
    }

    return gUMConstraints;
  }
}

export default ChromeAdapter;
