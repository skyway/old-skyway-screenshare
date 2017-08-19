// TODO:
/* eslint-disable require-jsdoc */
import Logger from './shared/logger';
import {
  getBrowserName,
  isChromeExtensionInstalled,
} from './shared/util';

class ScreenShare {
  constructor(options = {debug: false}) {
    const isDebugMode = 'debug' in options ? Boolean(options.debug) : false;

    this._logger = new Logger(isDebugMode);
  }

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

    window.addEventListener('message', ev => {
      this.logger(`Received ${ev.data.type} message from Extension.`);

      if (ev.data.type !== 'gotStreamId') {
        return;
      }

      gUMOptions.video.mandatory.chromeMediaSourceId = ev.data.streamid;

      this.logger('Parameter of getUserMedia: ', gUMOptions);

      navigator.mediaDevices.getUserMedia(gUMOptions)
        .then(stream => {
          const [streamTrack] = stream.getVideoTracks();
          streamTrack.onended = ev => {
            this.logger('Stream ended event fired: ', ev);
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

  stopScreenShare() {
    // TODO: implement
    return false;
  }

  isEnabledExtension() {
    if (isChromeExtensionInstalled()) {
      this.logger('ScreenShare Extension available');
      return true;
    }

    this.logger('ScreenShare Extension not available');
    return false;
  }
}

export default ScreenShare;
// for interop exports
module.exports = ScreenShare;
