// TODO:
/* eslint-disable require-jsdoc */

class ScreenShare {
  constructor(options = {debug: false}) {
    this._debug = 'debug' in options ? Boolean(options.debug) : false;
  }

  startScreenShare() {
    console.error('TODO: implement');
    // public startScreenShare(param:gUMParamObject,success:{(stream:MediaStream)}, error:{(error:Error)}, onEndedEvent = null):void{
    //
    //   if(!!navigator.mozGetUserMedia) {
    //
    //     // for FF
    //     var _paramFirefox: getUserMediaFirefoxOptionsObject = {
    //       video: {
    //         mozMediaSource: 'window',
    //         mediaSource: 'window'
    //       },
    //       audio: false
    //     };
    //
    //     if(isFinite(param.Width)) _paramFirefox.video.width = {min: param.Width,max: param.Width};
    //     if(isFinite(param.Height)) _paramFirefox.video.height = {min: param.Height,max: param.Height};
    //     if(isFinite(param.FrameRate)) _paramFirefox.video.frameRate = {min: param.FrameRate,max: param.FrameRate};
    //
    //     this.logger("Parameter of getUserMedia : " + JSON.stringify(_paramFirefox));
    //
    //     navigator.mozGetUserMedia(_paramFirefox, (stream)=>{
    //       success(stream);
    //     }, (err)=>{
    //       this.logger("Error message of getUserMedia : " + JSON.stringify(err));
    //       error(err);
    //     });
    //
    //   }else if(!!navigator.webkitGetUserMedia){
    //
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
    //   }
    // }
  }

  stopScreenShare() {
    console.error('TODO: implement');
  }

  isEnabledExtension() {
    if ('ScreenShareExtentionExists' in window) {
      this.logger('ScreenShare Extension available');
      return true;
    }

    this.logger('ScreenShare Extension not available');
    return false;
  }

  _log(message) {
    if (this._debug) {
      console.log('SkyWay-ScreenShare: ', message);
    }
  }
}

export default ScreenShare;
