let audioContext = null,
  meter = null,
  rafID = null,
  volume = 0,
  micIsOn = false;

const getMicVolume = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

  audioContext = new AudioContext();

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      .then(stream => {
        micIsOn = true;
        onMicrophoneGranted(stream);
      })
      .catch(err => {
        onMicrophoneDenied(err);
      });
  }

}

const onMicrophoneDenied = () => {
  alert('Stream generation failed.');
}

var mediaStreamSource = null;

const onMicrophoneGranted = stream => {
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  onLevelChange();
}

const onLevelChange = time => {
  volume = meter.volume;

  rafID = window.requestAnimationFrame(onLevelChange);
}