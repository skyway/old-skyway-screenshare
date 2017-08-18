// TODO:
/* eslint-disable require-jsdoc */
class Logger {
  constructor(isDebugMode) {
    this._enable = isDebugMode;
  }

  _log(message) {
    if (this._enable) {
      console.log('SkyWay-ScreenShare: ', message);
    }
  }
}

export default Logger;
