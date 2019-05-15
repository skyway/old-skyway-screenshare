# ⚠️ Deprecated

This project is no longer maintained.

Since Chrome 72 and Firefox 66, `navigator.mediaDevices.getDisplayMedia()` is available.
You can get the screen stream through this API without any dependencies.

> [Screen Capture](https://w3c.github.io/mediacapture-screen-share/)

- - -

# SkyWay ScreenShare Library

This is a library for easy implementation of screen sharing in WebRTC applications.
This repository includes source code for the Chrome extension.

## Installation

### 1. Library

* Using the CDN


	```html
	<script src="https://cdn.webrtc.ecl.ntt.com/screenshare-latest.js"></script>
	```

* Building it yourself

	Clone a copy of the skyway-screenshare git repo:
	```
	git clone git@github.com:skyway/skyway-screenshare.git
	```

	Enter the skyway-screenshare directory and run the build script of JavaScript library:
	```
	cd skyway-screenshare && npm install && npm run build:lib
	```

	Use the generated libraries:
	```
	dist/screenshare.js
	dist/screenshare.min.js
	```

### 2. Chrome extension

Modify the manifest.json <`chrome-extension/manifest.json`>:
```json
{
  "name": "Your extension name here",
  "short_name": "Your extension short_name here",
  "version": "Your extension version number here",
  "manifest_version": 2,
  "description": "Your extension description here",
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "permissions": [
    "desktopCapture",
    "tabs"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "content_scripts": [{
    "matches": [""],
    "js": ["content.js"],
    "all_frames": true,
    "run_at": "document_end"
  }]
}
```
Essential modification items are as follows:

|Item|Comment|
|---|---|
|name|Your extension name here.|
|short_name|Your extension short_name here.|
|version|Your extension version number here.|
|description|Your extension description here.|
|icons|Your extension icon files name here.<BR>Icon files should be located here <`chrome-extension/`>.<BR>|
|matches|The site urls that will use this extension. <BR>Wildcards are accepted.<BR>It is recommended to add `*` at the end of urls because the match type is exact match.<BR>Ex: `"matches": ["https://*.webrtc.ecl.ntt.com/*"]`|


Run the build script for the Chrome extension:
```
mkdir dist
npm install && npm run build:ext
```


Test the extension on Chrome:

1. Access to chrome://extensions/
2. Enable 'Developer mode'
3. Click the 'Load unpacked extension...' and specify the following directory
```
./chrome-extension/
```


Publish the extension:
In order to publish the extension to the Chrome store, upload the following zip file.
```
./dist/screenshare_chrome_extension.zip
```

### 3. Firefox add-on

As of Firefox 52, no installation is needed to use screenshare on firefox.

## API reference

```javascript
var screenshare = ScreenShare.create({ debug: true });
```

- options (This argument is optional)
  - debug (boolean)
    - Output the debug log on the browser developer console.

### start

- Start the screen share.

```javascript
screenshare.start({
  width: <number>,
  height: <number>,
  frameRate: <number>,
  mediaSource: <string>, // Firefox only
})
  .then(function(stream) {
     // success callback
     // Get the media stream for the screen share
  })
  .catch(function(error) {
     // error callback
  });
```

Firefox only, you can specify one of `window`, `application` or `screen` to `mediaSource`.

### stop

- Stop tracks of stream obtained from `start()`

```javascript
screenshare.stop();
```

### isScreenShareAvailable

- Chrome: Check whether the extension is installed or not. `<true or false>`
- Firefox: Returns `true`.
- Others: Returns `false`.

```javascript
var result = screenshare.isScreenShareAvailable();
```

### Event

#### type=ScreenShareInjected

- When using [inline installation](https://developer.chrome.com/webstore/inline_installation) for the Chrome extension, this event is fired when the script finishes loading. By handling this event, you can start ScreenShare feature automatically. Please note that you have to change `config.hostname` in `chrome-extension/background.js`.

```javascript
window.addEventListner('message', function(ev) {
  if(ev.data.type === "ScreenShareInjected") {
    console.log('screen share extension is injected, get ready to start');
    startScreenShare();
  }
}, false);
```

## Sample

### SkyWay ScreenShare Sample App

https://example.webrtc.ecl.ntt.com/screenshare/index.html

  - [Install the Chrome extension](https://chrome.google.com/webstore/detail/skyway-screenshare-sample/gjkihkcdicimhkhmnopjgpohogiggbao)

## Contributing

Make sure you have nodejs installed. Run `npm install` to get started.

After making changes in `src/`, `chrome-extension/` run

- `npm run lint` to validate

then run build commands

- `npm run build:lib` to build `screenshare(.min).js`
- `npm run build:ext` to build `screenshare_chrome_extension.zip`

the files are stored in the `dist` directory!

## LICENSE & Copyright

[LICENSE](./LICENSE)
