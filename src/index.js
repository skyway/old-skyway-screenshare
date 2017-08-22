import Logger from './shared/logger';
import {
  getBrowserName,
  isChromeExtensionInstalled,
} from './shared/util';

/**
 * Class for ScreenShare.
 * Currently, only Chrome and Firefox are supported.
 */
class ScreenShare {
  /**
   * Create ScreenShare instance.
   * @param {Object} [options] - Options for ScreenShare.
   * @param {boolean} [options.debug=false] - If true, print logs.
   */
  constructor(options = {debug: false}) {
    const isDebugMode = 'debug' in options ? Boolean(options.debug) : false;

    this._logger = new Logger(isDebugMode);
  }

  /**
   * Start screen share.
   * @param {Object} [params] - Options for getUserMedia constraints.
   * @param {number} [params.Width] - Constraints for width.
   * @param {number} [params.Height] - Constraints for height.
   * @param {number} [params.FrameRate] - Constraints for frameRate.
   * @param {function} [successCallback] - Callback on getUserMedia resolved.
   * @param {function} [errorCallback] - Callback on getUserMedia rejected.
   * @param {function} [onEndedCallback] - Callback on stream ended.
   */
  startScreenShare(
    params = {},
    successCallback = () => {},
    errorCallback = () => {},
    onEndedCallback = () => {}
  ) {
    switch (getBrowserName()) {
      case 'firefox':
        this._handleFirefox(params, successCallback, errorCallback);
        break;
      case 'chrome':
        this._handleChrome(params, successCallback, errorCallback, onEndedCallback);
        break;
      default:
        this._logger.log('This browser does not support screen share.');
        break;
    }
  }

  /**
   * Start Firefox screen share.
   * @param {Object} params - Options for getUserMedia constraints.
   * @param {number} [params.Width] - Constraints for width.
   * @param {number} [params.Height] - Constraints for height.
   * @param {number} [params.FrameRate] - Constraints for frameRate.
   * @param {function} successCallback - Callback on getUserMedia resolved.
   * @param {function} errorCallback - Callback on getUserMedia rejected.
   */
  _handleFirefox(params, successCallback, errorCallback) {
    const gUMOptions = {
      video: {
        mediaSource: 'window',
      },
      audio: false,
    };

    if (isFinite(params.Width)) {
      gUMOptions.video.width = {min: params.Width, max: params.Width};
    }
    if (isFinite(params.Height)) {
      gUMOptions.video.height = {min: params.Height, max: params.Height};
    }
    if (isFinite(params.FrameRate)) {
      gUMOptions.video.frameRate = {min: params.FrameRate, max: params.FrameRate};
    }

    this._logger.log('Parameter of getUserMedia: ', gUMOptions);

    navigator.mediaDevices.getUserMedia(gUMOptions)
      .then(stream => successCallback(stream))
      .catch(err => {
        this._logger.log('Error message of getUserMedia: ', err);
        return errorCallback(err);
      });
  }

  /**
   * Start Chrome screen share with extension.
   * @param {Object} params - Options for getUserMedia constraints.
   * @param {number} [params.Width] - Constraints for width.
   * @param {number} [params.Height] - Constraints for height.
   * @param {number} [params.FrameRate] - Constraints for frameRate.
   * @param {function} successCallback - Callback on getUserMedia resolved.
   * @param {function} errorCallback - Callback on getUserMedia rejected.
   * @param {function} onEndedCallback - Callback on stream ended.
   */
  _handleChrome(params, successCallback, errorCallback, onEndedCallback) {
    const gUMOptions = {
      video: {
        mandatory: {
          chromeMediaSource:   'desktop',
          chromeMediaSourceId: '',
        },
        optional: [{
          googTemporalLayeredScreencast: true,
        }],
      },
      audio: false,
    };

    if (isFinite(params.Width)) {
      gUMOptions.video.mandatory.maxWidth = params.Width;
      gUMOptions.video.mandatory.minWidth = params.Width;
    }
    if (isFinite(params.Height)) {
      gUMOptions.video.mandatory.maxHeight = params.Height;
      gUMOptions.video.mandatory.minHeight = params.Height;
    }
    if (isFinite(params.FrameRate)) {
      gUMOptions.video.mandatory.maxFrameRate = params.FrameRate;
      gUMOptions.video.mandatory.minFrameRate = params.FrameRate;
    }

    window.addEventListener('message', ({data}) => {
      this._logger.log(`Received ${data.type} message from Extension.`, data);

      if (data.type !== 'gotStreamId') {
        return;
      }

      gUMOptions.video.mandatory.chromeMediaSourceId = data.streamId;

      this._logger.log('Parameter of getUserMedia: ', gUMOptions);

      navigator.mediaDevices.getUserMedia(gUMOptions)
        .then(stream => {
          const [streamTrack] = stream.getVideoTracks();
          streamTrack.onended = ev => {
            this._logger.log('Stream ended event fired: ', ev);
            onEndedCallback();
          };
          return successCallback(stream);
        })
        .catch(err => {
          this._logger.log('Error message of getUserMedia: ', err);
          return errorCallback(err);
        });
    });

    window.postMessage({type: 'getStreamId'}, '*');
  }

  /**
   * Stop screen share.
   * @return {boolean} TODO: Implement
   */
  stopScreenShare() {
    return false;
  }

  /**
   * Returns true if Chrome extension installed.
   * @return {boolean} Chrome extension installed propery or NOT.
   */
  isEnabledExtension() {
    if (isChromeExtensionInstalled()) {
      this._logger.log('ScreenShare Extension available');
      return true;
    }

    this._logger.log('ScreenShare Extension not available');
    return false;
  }
}

export default ScreenShare;
// for interop exports
module.exports = ScreenShare;
