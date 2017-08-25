/* eslint-disable require-jsdoc */
/**
 * SkyWay Screenshare Sample App
 * @author NTT Communications(skyway@ntt.com)
 * @link https://github.com/nttcom/SkyWay-ScreenShare
 * @license MIT License
 */

$(function() {
    // API key (bc26d227-0bf2-460a-b2cb-129a0dfafdc2 can only be used on localhost)
    const APIKEY = 'bc26d227-0bf2-460a-b2cb-129a0dfafdc2';
    const browser = _getBrowserName();

    // Call object
    let existingCall = null;

    // localStream
    let localStream = null;

    // Create Peer object
    const peer = new Peer({key: APIKEY, debug: 3});

    // Prepare screen share object
    const ss = new ScreenShare({debug: true});

    // Get peer id from server
    peer.on('open', () => {
      $('#my-id').text(peer.id);
    });

    // Set your own stream and answer if you get a call
    peer.on('call', call => {
      call.answer(localStream);
      step3(call);
      console.log('event:recall');
    });

    // Error handler
    peer.on('error', err => {
      alert(err.message);
      step2();
    });

  // Call peer
  $('#make-call').on('click', () => {
    const call = peer.call($('#otherpeerid').val(), localStream);
    step3(call);
  });

  // Finish call
  $('#end-call').on('click', () => {
    existingCall.close();
    step2();
  });

  // Get media stream again
  $('#step1-retry').on('click', () => {
    $('#step1-error').hide();
    step1();
  });

  // Start screenshare
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

  // End screenshare
  $('#stop-screen').on('click', () => {
    ss.stopScreenShare();
    localStream.getTracks().forEach(track => track.stop());
  });

  // Camera
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

  // Start step 1
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
    // Update UI
    $('#step1, #step3').hide();
    $('#step2').show();
  }

  function step3(call) {
    // Close any existing calls
    if (existingCall) {
      existingCall.close();
    }

    // Wait for peer's media stream
    call.on('stream', stream => {
      $('#their-video')[0].srcObject = stream;
      $('#step1, #step2').hide();
      $('#step3').show();
    });

    // If the peer closes their connection
    call.on('close', step2);

    // Save call object
    existingCall = call;

    // Update UI
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
