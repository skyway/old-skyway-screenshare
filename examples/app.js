/* eslint-disable require-jsdoc */
/**
 * SkyWay Screenshare Sample App
 * @author NTT Communications(skyway@ntt.com)
 * @link https://github.com/nttcom/SkyWay-ScreenShare
 * @license MIT License
 */

$(function() {
    // APIキー（6165842a-5c0d-11e3-b514-75d3313b9d05はlocalhostのみ利用可能）
    const APIKEY = '6165842a-5c0d-11e3-b514-75d3313b9d05';
    const browser = _getBrowserName();

    // Callオブジェクト
    let existingCall = null;

    // localStream
    let localStream = null;

    // PeerJSオブジェクトを生成
    const peer = new Peer({key: APIKEY, debug: 3});

    // スクリーンキャプチャの準備
    const ss = new ScreenShare({debug: true});

    // PeerIDを生成
    peer.on('open', () => {
      $('#my-id').text(peer.id);
    });

    // 相手からのコールを受信したら自身のメディアストリームをセットして返答
    peer.on('call', call => {
      call.answer(localStream);
      step3(call);
      console.log('event:recall');
    });

    // エラーハンドラー
    peer.on('error', err => {
      alert(err.message);
      step2();
    });

  // 相手に接続
  $('#make-call').on('click', () => {
    const call = peer.call($('#otherpeerid').val(), localStream);
    step3(call);
  });

  // 切断
  $('#end-call').on('click', () => {
    existingCall.close();
    step2();
  });

  // メディアストリームを再取得
  $('#step1-retry').on('click', () => {
    $('#step1-error').hide();
    step1();
  });

  // スクリーンシェアを開始
  $('#start-screen').on('click', () => {
    if (!(ss.isEnabledExtension() && browser === 'chrome'
    || browser === 'firefox')) {
      alert('スクリーンシェアが利用できません。Chromeの場合は、拡張をインストールしてください。');
      return;
    }

    ss.startScreenShare(
      {
        Width:     $('#Width').val(),
        Height:    $('#Height').val(),
        FrameRate: $('#FrameRate').val(),
      },
      stream => {
        $('#my-video')[0].srcObject = stream;

        if (existingCall !== null) {
          const peerid = existingCall.peer;
          existingCall.close();
          const call = peer.call(peerid, stream);
          step3(call);
        }
        localStream = stream;
      },
      error => {
        console.log(error);
      },
      () => {
        alert('ScreenShareを終了しました');
      }
    );
  });

  // スクリーンシェアを終了
  $('#stop-screen').on('click', () => {
    ss.stopScreenShare();
    localStream.getTracks().forEach(track => track.stop());
  });

  // カメラ
  $('#start-camera').on('click', () => {
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
      .then(stream => {
        $('#my-video')[0].srcObject = stream;

        if (existingCall !== null) {
          const peerid = existingCall.peer;
          existingCall.close();
          const call = peer.call(peerid, stream);
          step3(call);
        }
        localStream = stream;
      })
      .catch(err => {
        $('#step1-error').show();
      });
  });

  // ステップ１実行
  step1();

  function step1() {
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
      .then(stream => {
        $('#my-video')[0].srcObject = stream;
        localStream = stream;
        step2();
      })
      .catch(err => {
        $('#step1-error').show();
      });
  }

  function step2() {
    // UIコントロール
    $('#step1, #step3').hide();
    $('#step2').show();
  }

  function step3(call) {
    // すでに接続中の場合はクローズする
    if (existingCall) {
      existingCall.close();
    }

    // 相手からのメディアストリームを待ち受ける
    call.on('stream', stream => {
      $('#their-video')[0].srcObject = stream;
      $('#step1, #step2').hide();
      $('#step3').show();
    });

    // 相手がクローズした場合
    call.on('close', step2);

    // Callオブジェクトを保存
    existingCall = call;

    // UIコントロール
    $('#their-id').text(call.peer);
    $('#step1, #step2').hide();
    $('#step3').show();
  }

  function _getBrowserName() {
    const ua = navigator.userAgent.toLowerCase();

    // Firefox
    if (ua.indexOf('firefox') !== -1) {
      return 'firefox';
    }

    // Chrome
    if (ua.indexOf('chrome') !== -1 && ua.indexOf('edge') === -1) {
      return 'chrome';
    }

    return 'N/A';
  }
});
