// contents script
const port = chrome.runtime.connect();

window.addEventListener('message', ev => {
  if (ev.source !== window) return;
  if (ev.data.type !== 'getStreamId') return;

  port.postMessage('getStreamId');
}, false);

port.onMessage.addListener(({streamId}, sender, sendResponse) => {
  window.postMessage({type: 'gotStreamId', streamId}, '*');
});

// To notice ScreenShareExtention is installed, set global variable of
// window.ScreenShareExtentionExists in front side.
const elt = document.createElement('script');
elt.innerHTML = 'window.__skywayWebRTCScreenShareExtensionAvailable__ = true;';
document.head.appendChild(elt);

// To notice ScreenShareExtention is get ready, we send message to
// front side with type = ScreenShareInjected. For inline install pattern,
// by handling this event, you can do automatic start of ScreenShare feature.
//
// front side code snipet:
// window.addEventListener('message', function(ev) {
//   if(ev.data.type === "ScreenShareInjected") {
//     console.log('screen share extension is injected, get ready to use');
//     startScreenShare();
//   }
// }, false);
//
window.postMessage({type: 'ScreenShareInjected'}, '*');
