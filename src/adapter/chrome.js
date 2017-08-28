/* eslint-disable require-jsdoc */
class ChromeAdapter {
  constructor(logger) {
    this._logger = logger;
    this._stream = null;

    this._logger.log('Chrome adapter ready');
  }

  start(params) {
    const that = this;

    return new Promise((resolve, reject) => {
      window.addEventListener('message', _onMessage, false);
      window.postMessage({type: 'getStreamId'}, '*');

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

  stop() {
    if (this._stream instanceof MediaStream === false) {
      return;
    }

    this._stream.getTracks().forEach(track => track.stop());
    this._stream = null;
  }

  isScreenShareAvailable() {
    if ('__eclWebRTCScreenShareExtensionAvailable__' in window) {
      return true;
    }

    return false;
  }

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
