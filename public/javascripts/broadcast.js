const client = IVSBroadcastClient.create({
  streamConfig: IVSBroadcastClient.BASIC_LANDSCAPE,
  ingestEndpoint:
    "rtmps://548ea801f896.global-contribute.live-video.net:443/app/",
});
const previewEl = document.getElementById("preview");
const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE;
const streamKey = "sk_eu-west-1_bXiIXRjTFqc6_pDJz8LEfLrjEE9zQAlnF0GBgCK5916";

async function retrieveMediaStream() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  window.videoDevices = devices.filter((d) => d.kind === "videoinput");
  window.audioDevices = devices.filter((d) => d.kind === "audioinput");

  window.cameraStream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: window.videoDevices[0].deviceId,
      width: {
        ideal: streamConfig.maxResolution.width,
      },
      height: {
        ideal: streamConfig.maxResolution.height,
      },
    },
  });
  window.microphoneStream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: window.audioDevices[0].deviceId },
  });
  client.addVideoInputDevice(window.cameraStream, "camera1", { index: 0 }); // only 'index' is required for the position parameter
  client.addAudioInputDevice(window.microphoneStream, "mic1");
}
function startBroadcast() {
  client
    .startBroadcast(streamKey)
    .then((result) => {
      console.log("I am successfully broadcasting!");
    })
    .catch((error) => {
      console.error("Something drastically failed while broadcasting!", error);
    });
}
function stopBroadcast() {
  client.stopBroadcast();
}
client.attachPreview(previewEl);
retrieveMediaStream();
