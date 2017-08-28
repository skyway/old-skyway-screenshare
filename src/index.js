/* eslint-disable require-jsdoc, valid-jsdoc */
import Logger from './shared/logger';
import {
  getBrowserName,
} from './shared/util';
import ChromeAdapter from './adapter/chrome';
import FirefoxAdapter from './adapter/firefox';

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
  static create(options = {debug: false}) {
    const logger = new Logger(options.debug);

    switch (getBrowserName()) {
      case 'firefox':
        return new FirefoxAdapter(logger);
      case 'chrome':
        return new ChromeAdapter(logger);
      default:
        this._logger.log('This browser does not support screen share.');
        return null;
    }
  }
}

export default ScreenShare;
// for interop exports
module.exports = ScreenShare;
