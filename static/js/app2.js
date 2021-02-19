let suuid2 = 'demo2';

const pc2 = new RTCPeerConnection(config);
pc2.onnegotiationneeded = handleNegotiationNeededEvent2;

pc2.ontrack = function(event) {
  var el2 = document.createElement(event.track.kind)
  el2.srcObject = event.streams[0]
  el2.muted = true
  el2.autoplay = true
  el2.controls = true
  el2.width = 600
  document.getElementById(suuid2 +'remoteVideos').appendChild(el2)
}



async function handleNegotiationNeededEvent2() {
  let offer2 = await pc2.createOffer();
  await pc2.setLocalDescription(offer2);
  getRemoteSdp2();
}

$(document).ready(function() {
  $('#' + suuid2).addClass('active');
  getCodecInfo2();
});


function getCodecInfo2() {
  $.get("/codec/" + suuid2, function(data2) {
    try {
      data2 = JSON.parse(data2);
      if (data2.length > 1) {
        pc2.addTransceiver('audio', {
          'direction': 'sendrecv'
        })
      }
    } catch (e) {
      console.log(e);
    } finally {

      pc2.addTransceiver('video', {
        'direction': 'sendrecv'
      });
      //send ping becouse PION not handle RTCSessionDescription.close()
      sendChannel2 = pc2.createDataChannel('foo');
      sendChannel2.onclose = () => console.log('sendChannel has closed');
      sendChannel2.onopen = () => {
        console.log('sendChannel has opened');
        sendChannel2.send('ping');
        setInterval(() => {
          sendChannel2.send('ping');
        }, 1000)
      }
    }
  });
}

let sendChannel2 = null;

function getRemoteSdp2() {
  $.post("/recive", {
    suuid: suuid2,
    data: btoa(pc2.localDescription.sdp)
  }, function(data) {
    try {

      pc2.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: atob(data)
      }))



    } catch (e) {
      console.warn(e);
    }

  });
}