/**
 * SkyWay Screenshare Sample App
 * @author NTT Communications(skyway@ntt.com)
 * @link https://github.com/nttcom/SkyWay-ScreenShare
 * @license MIT License
 */

$(document).ready(function () {

    //APIキー（6165842a-5c0d-11e3-b514-75d3313b9d05はlocalhostのみ利用可能）
    var APIKEY = '6165842a-5c0d-11e3-b514-75d3313b9d05';

    //ユーザーリスト
    var userList = [];

    //Callオブジェクト
    var existingCall;

    //localStream
    var localStream;

    // Compatibility
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // PeerJSオブジェクトを生成
    var peer = new Peer({ key: APIKEY, debug: 3 });

    // スクリーンキャプチャの準備
    var screen = new SkyWay.ScreenShare({debug: true});

    // PeerIDを生成
    peer.on('open', function () {
        $('#my-id').text(peer.id);
    });

    // 相手からのコールを受信したら自身のメディアストリームをセットして返答
    peer.on('call', function (call) {
        call.answer(localStream);
        step3(call);
        console.log('event:recall');
    });

    // エラーハンドラー
    peer.on('error', function (err) {
        alert(err.message);
        step2();
    });

    // イベントハンドラー
    $(function () {
        // 相手に接続
        $('#make-call').click(function () {
            var call = peer.call($('#otherpeerid').val(), localStream);
            step3(call);
        });

        // 切断
        $('#end-call').click(function () {
            existingCall.close();
            step2();
        });

        // メディアストリームを再取得
        $('#step1-retry').click(function () {
            $('#step1-error').hide();
            step1();
        });

        //スクリーンシェアを開始
        $('#start-screen').click(function () {
            if(screen.isEnabledExtension()){
                screen.startScreenShare({
                    Width: $('#Width').val(),
                    Height: $('#Height').val(),
                    FrameRate: $('#FrameRate').val()
                },function (stream){
                    attachMediaStream_($('#my-video')[0],stream);
                    if(existingCall != null){
                        var _peerid = existingCall.peer;
                        existingCall.close();
                        var call = peer.call(_peerid, stream);
                        step3(call);
                    }
                    localStream = stream;

                },function(error){
                    console.log(error);
                },function(){
                    alert('ScreenShareを終了しました');
                });
            }else{
                alert('ExtensionまたはAddonをインストールして下さい');
            }

        });

        //スクリーンシェアを終了
        $('#stop-screen').click(function () {
            //sc.stopScreenShare();
            localStream.stop();
        });

        //カメラ
        $('#start-camera').click(function () {
            getUM(function(stream){
                attachMediaStream_($('#my-video')[0],stream);
                if(existingCall != null){
                    var _peerid = existingCall.peer;
                    existingCall.close();
                    var call = peer.call(_peerid, stream);
                    step3(call);
                }
                localStream = stream;

            },function(error){
                $('#step1-error').show();
            });
        });

        // ステップ１実行
        step1();

    });

    function step1() {
        // メディアストリームを取得する
        getUM(function(stream){
            attachMediaStream_($('#my-video')[0],stream);
            localStream = stream;
            step2();
        },function(error){
            $('#step1-error').show();
        })

    }

    function step2() {
        //UIコントロール
        $('#step1, #step3').hide();
        $('#step2').show();
    }

    function step3(call) {
        // すでに接続中の場合はクローズする
        if (existingCall) {
            existingCall.close();
        }

        // 相手からのメディアストリームを待ち受ける
        call.on('stream', function (stream) {
            attachMediaStream_($('#their-video')[0],stream);
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

    function getUM(success,error){
        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
            success(stream);
        }, function (err) {
            error(err);
        });
    }

    function attachMediaStream_(videoDom,stream){
        // Adapter.jsをインクルードしている場合はそちらのFunctionを利用する
        if(typeof (attachMediaStream) !== 'undefined' && attachMediaStream){
            attachMediaStream(videoDom,stream);
        }else{
            videoDom.setAttribute('src', URL.createObjectURL(stream));
        }

    }
});