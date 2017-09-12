# SkyWay ScreenShare Library

WebRTCのWebアプリケーションでスクリーンシェア機能を簡単に実装できるライブラリです。
Chrome向けのextension用ソースコードも含まれています。

## Installation

### 1. Library

* CDNを利用する場合

	```html
	<script src="https://cdn.webrtc.ecl.ntt.com/screenshare-latest.js"></script>
	```

* 自分でビルドする場合

	ライブラリをcloneします。
	```
	git clone git@github.com:skyway/skyway-screenshare.git
	```

	ライブラリをビルドします。
	```
	cd skyway-screenshare && npm install && npm run build:lib
	```

	生成されたライブラリを利用します。
	```
	dist/screenshare.js
	dist/screenshare.min.js
	```

### 2. Chrome Extension

マニフェストファイル `chrome-extension/manifest.json` を修正します。
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
必須の修正箇所は以下の通りです。

|修正項目|コメント|
|---|---|
|name|extensionのnameを指定して下さい。|
|short_name|extensionのshort_nameを指定して下さい。|
|version|extensionのversion番号を指定して下さい。|
|description|extensionのdescriptionを指定して下さい。|
|icons|extensionのiconファイル名（３種類）を指定して下さい。<BR>iconファイルは `./chrome-extension/` に配置して下さい。<BR>|
|matches|extensionを利用するサイトのドメインを指定して下さい。<BR>ドメイン指定には `*`（ワイルドカード）が利用可能です。<BR>ドメインは完全一致する必要があるため末尾に `*`をつけることを推奨します。<BR>例：`"matches": ["https://*.webrtc.ecl.ntt.com/*"]`|


ECLRTC-ScreenShareディレクトリに入り、Chrome extension用のビルドスクリプトを実行します。

```
mkdir dist
npm install && npm run build:ext
```


Chromeでextensionのテストを行います。

1. chrome://extensions/ にアクセス
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック、以下のディレクトリを指定
```
./chrome-extension/
```


extensionを公開します。
Chrome Web Storeに公開する場合は以下のZipファイルを利用して下さい。
```
./dist/screenshare_chrome_extension.zip
```

### 3. Firefox add-on

Firefox 52から拡張なしでスクリーンシェア機能を使えるようになりました。

## API reference

```javascript
var screenshare = ScreenShare.create({ debug: true });
```

- options (この引数は任意です)
  - debug (boolean)
    - ブラウザの開発者コンソールにデバッグログを出力します.

### start

- スクリーンシェアを開始します

```javascript
screenshare.start({
  width: <number>,
  height: <number>,
  frameRate: <number>,
  mediaSource: <string>, // Firefox only
})
  .then(function(stream) {
     // success callback
     // 成功するとstreamオブジェクトを取得できます
  })
  .catch(function(error) {
     // error callback
  });
```

Firefoxのみ、 `mediaSource`には、`window`、`application`、`screen` のいずれかが指定できます。

### stop

- `start()` で取得したstreamオブジェクトを停止します

```javascript
screenshare.stop();
```

### isScreenShareAvailable

- Chrome: extensionsがインストールされているかを確認する`<true or false>`
- Firefox: `true`
- その他のブラウザ: `false`

```javascript
var result = screenshare.isScreenShareAvailable();
```

### Event

#### type=ScreenShareInjected

- Chromeでextension scriptのloadが完了した時に発火するイベント。[Inline Installation](https://developer.chrome.com/webstore/inline_installation) の際、このイベントをハンドルすることで、自動でScreenShare 機能を実行することができる。なお、Inline Installationを使う場合は、chrome-extension/src/background.js の config.hostname を利用されるWebサイトの hostname に変更してください。

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
