(function(){
	'use strict'


	/* Get User Media */
	navigator.getUserMedia = (
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia
  )

	/* Constantes */
	let localStream, localPeerConnection, remotePeerConnection;
	const configuration = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]}
  const video_stream = document.querySelector("#video-stream")
  const remoteVideo = document.querySelector("#remoteVideo")
	let isInitiator = false
	let pc;

  if(navigator.getUserMedia)
	  navigator.getUserMedia({ video:true, audio:true }, onDone, onFail)
	else
		alert("No sporta tu navegador")

  function onDone(stream) {
  	video_stream.src = window.URL.createObjectURL(stream)
	  localStream = stream;
  	call()
  }

  function getIpAddr(){
  	let ips = {}
  	$.ajax({
  		type:"GET",
  		url:"/ipaddr",
  		dataType:"html"
  	})
  	.done((data)=>{
  		ips["ip"] = data
	  	console.log(ips)
  	})
  	return ips["ip"]
  }

  function onFail(err) {
  	alert("Hay problemas con acceder a la camara.")
  }

  function trace(text) {
  	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
	}

  function call() {
    trace("Starting call");

    if (localStream.getVideoTracks().length > 0) {
      trace('Using video device: ' + localStream.getVideoTracks()[0].label);
    }
    if (localStream.getAudioTracks().length > 0) {
      trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
    }

    var servers = null;

    localPeerConnection = new RTCPeerConnection(servers);
    trace("Created local peer connection object localPeerConnection");
    localPeerConnection.onicecandidate = gotLocalIceCandidate;

    remotePeerConnection = new RTCPeerConnection(servers);
    trace("Created remote peer connection object remotePeerConnection");
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    remotePeerConnection.onaddstream = gotRemoteStream;

    localPeerConnection.addStream(localStream);
    trace("Added localStream to localPeerConnection");
    localPeerConnection.createOffer(gotLocalDescription,handleError);

	}


	function gotLocalDescription(description){
	  localPeerConnection.setLocalDescription(description);
	  trace("Offer from localPeerConnection: \n" + description.sdp);
	  remotePeerConnection.setRemoteDescription(description);
	  remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
	}

	function gotRemoteDescription(description){
	  remotePeerConnection.setLocalDescription(description);
	  trace("Answer from remotePeerConnection: \n" + description.sdp);
	  localPeerConnection.setRemoteDescription(description);
	}

	function hangup() {
	  trace("Ending call");
	  localPeerConnection.close();
	  remotePeerConnection.close();
	  localPeerConnection = null;
	  remotePeerConnection = null;
	  hangupButton.disabled = true;
	  callButton.disabled = false;
	}

	function gotRemoteStream(event){
	  remoteVideo.src = URL.createObjectURL(event.stream);
	  trace("Received remote stream");
	}

	function gotLocalIceCandidate(event){
	  if (event.candidate) {
	    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
	    trace("Local ICE candidate: \n" + event.candidate.candidate);
	  }
	}

	function gotRemoteIceCandidate(event){
	  if (event.candidate) {
	    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
	    trace("Remote ICE candidate: \n " + event.candidate.candidate);
	  }
	}

	function handleError(){}


})()