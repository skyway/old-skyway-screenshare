/* eslint-disable require-jsdoc */
class FirefoxAdapter {
  constructor(logger) {
    this._logger = logger;
    this._stream = null;

    this._logger.log('Firefox adapter ready');
  }

  start(params = {}) {
    const gUMConstraints = this._paramsToConstraints(params);
    this._logger.log('Parameter of getUserMedia: ', gUMConstraints);

    return navigator.mediaDevices.getUserMedia(gUMConstraints)
      .then(stream => {
        this._stream = stream;

        return Promise.resolve(stream);
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
    return true;
  }

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
