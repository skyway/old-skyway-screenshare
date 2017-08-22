// background script

// change hostname of your own.
const config = {hostname: 'test.example.com'};

// Execute screen share feature when requested from content.js (content script)
chrome.runtime.onConnect.addListener(port => {
  // attach event listener from content.js
  port.onMessage.addListener(message => {
    // If message equal getStreamId, execute picker. After selected window, callback function executes and transfer streamid to content.js
    if (message === 'getStreamId') {
      chrome.desktopCapture.chooseDesktopMedia(
        ['screen', 'window'],
        port.sender.tab,
        streamId => {
          port.postMessage({streamId});
        }
      );
    }
  });
});

// inject content script to existing tabs, for inline install extensions
// this type of code is required to execute it when installed.
// Otherwise, after inline install, user has to reload web pages (this is quite annoying)
// obtain target tabs to inject content script
chrome.tabs.query({
  status: 'complete',
  url:    `*://${config.hostname}/*`,
}, tabs => {
  tabs.forEach(tab => {
    // inject script
    chrome.tabs.executeScript(tab.id, {
      file:  'content.js',
      runAt: 'document_start',
    });
  });
});
