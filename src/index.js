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

    if (isFinite(param.Width)) {
      gUMOptions.video.width = {min: param.Width, max: param.Width};
    }
    if (isFinite(param.Height)) {
      gUMOptions.video.height = {min: param.Height, max: param.Height};
    }
    if (isFinite(param.FrameRate)) {
      gUMOptions.video.frameRate = {min: param.FrameRate, max: param.FrameRate};
    }

    this._logger.log('Parameter of getUserMedia: ', gUMOptions);

    navigator.mediaDevices.getUserMedia(gUMOptions)
      .then(stream => successCallback(stream))
      .catch(err => {
        this._logger.log('Error message of getUserMedia: ', err);
        return errorCallback(err);
      });
  }

  _handleChrome() {
    if (isChromeExtensionInstalled() === false) {
    }
    //     // for Chrome
    //     var _paramChrome: getUserMediaChromeMandatoryObject = {
    //       mandatory: {
    //         chromeMediaSource: 'desktop',
    //         chromeMediaSourceId: ''
    //       },
    //       optional: [{
    //         googTemporalLayeredScreencast: true
    //       }]
    //     };
    //
    //     if(isFinite(param.Width)) {
    //       _paramChrome.mandatory.maxWidth = param.Width;
    //       _paramChrome.mandatory.minWidth = param.Width;
    //     };
    //     if(isFinite(param.Height)) {
    //       _paramChrome.mandatory.maxHeight = param.Height;
    //       _paramChrome.mandatory.minHeight = param.Height;
    //     };
    //     if(isFinite(param.FrameRate)) {
    //       _paramChrome.mandatory.maxFrameRate = param.FrameRate;
    //       _paramChrome.mandatory.minFrameRate = param.FrameRate;
    //     };
    //
    //     window.addEventListener('message',(event:MessageEvent)=>{
    //       this.logger("Received " + '"' + event.data.type + '"' + " message from Extension.");
    //       if(event.data.type != 'gotStreamId') {
    //         return;
    //       }
    //       _paramChrome.mandatory.chromeMediaSourceId = event.data.streamid;
    //       this.logger("Parameter of getUserMedia : " + JSON.stringify(_paramChrome));
    //       navigator.getUserMedia({
    //         audio: false,
    //         video: _paramChrome
    //       }, (stream)=>{
    //         this.logger("Got a stream for screen share");
    //         var streamTrack = stream.getVideoTracks();
    //         streamTrack[0].onended = (event)=>{
    //           this.logger("Stream ended event fired : " + JSON.stringify(event));
    //           if(typeof(onEndedEvent) !== "undefined" && onEndedEvent !== null) onEndedEvent();
    //         };
    //         success(stream);
    //       }, (err)=>{
    //         this.logger("Error message of getUserMedia : " + JSON.stringify(err));
    //         error(err);
    //       });
    //
    //     });
    //
    //     window.postMessage({type:"getStreamId"},"*");
  }

  stopScreenShare() {
    console.error('TODO: implement');
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
