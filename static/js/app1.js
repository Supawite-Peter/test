let suuid = 'demo1';

let config = {
  iceServers: [{
    urls: ["stun:stun.l.google.com:19302"]
  }]
};

const pc = new RTCPeerConnection(config);
pc.onnegotiationneeded = handleNegotiationNeededEvent;

pc.ontrack = function(event) {
  var el = document.createElement(event.track.kind)
  el.srcObject = event.streams[0]
  el.muted = true
  el.autoplay = true
  el.controls = true
  el.width = 600
  document.getElementById(suuid+'remoteVideos').appendChild(el)
}



async function handleNegotiationNeededEvent() {
  let offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  getRemoteSdp();
}

$(document).ready(function() {
  $('#' + suuid).addClass('active');
  getCodecInfo();
});


function getCodecInfo() {
  $.get("/codec/" + suuid, function(data) {
    try {
      data = JSON.parse(data);
      if (data.length > 1) {
        pc.addTransceiver('audio', {
          'direction': 'sendrecv'
        })
      }
    } catch (e) {
      console.log(e);
    } finally {

      pc.addTransceiver('video', {
        'direction': 'sendrecv'
      });
      //send ping becouse PION not handle RTCSessionDescription.close()
      sendChannel = pc.createDataChannel('foo');
      sendChannel.onclose = () => console.log('sendChannel has closed');
      sendChannel.onopen = () => {
        console.log('sendChannel has opened');
        sendChannel.send('ping');
        setInterval(() => {
          sendChannel.send('ping');
        }, 1000)
      }
    }
  });
}

let sendChannel = null;

function getRemoteSdp() {
  $.post("/recive", {
    suuid: suuid,
    data: btoa(pc.localDescription.sdp)
  }, function(data) {
    try {

      pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: atob(data)
      }))



    } catch (e) {
      console.warn(e);
    }

  });
}