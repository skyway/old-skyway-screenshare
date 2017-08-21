// background script
//

// change hostname of your own.
var config = {"hostname": "test.example.com"}

// Execute screen share feature when requested from content.js (content script)
chrome.runtime.onConnect.addListener(function(port){
    // attach event listener from content.js
    port.onMessage.addListener(function(message){
        // If message equal getStreamId, execute picker. After selected window, callback function executes and transfer streamid to content.js
        if(message == 'getStreamId'){
            chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'],port.sender.tab, function(streamId){
                console.log(streamId);
                port.postMessage({streamid:streamId});
            });
        }
    });
});

// inject content script to existing tabs, for inline install extensions
// this type of code is required to execute it when installed.
// Otherwise, after inline install, user has to reload web pages (this is quite annoying)
var injectContentScriptToExistingTabs = function() {
  // obtain target tabs to inject content script
  chrome.tabs.query({
    "status": "complete",
    "url": "*://" + config.hostname + "/*",
  }, function(tabs) {
    console.dir(tabs);
    tabs.forEach(function(tab){
      console.log(tab);
      // inject script
      chrome.tabs.executeScript(tab.id, {
        "file": "content.js",
        "runAt": "document_start"
      });
      console.log("content.js executed");
    });
  });
}

injectContentScriptToExistingTabs();
