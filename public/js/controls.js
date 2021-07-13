//contains js for all control buttons in room.ejs and settings.ejs


//to mute and unmute audio
const muteUnmute= () =>{
  let enabled= myVideoStream.getAudioTracks()[0].enabled;       //get current enabled version of our video stream's audio
  if (enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } 
  else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

//change audio button
const setMuteButton= () =>{
  $(".mic-button").html(`<i class="fas fa-microphone"></i>`);
}

const setUnmuteButton= () =>{
  $(".mic-button").html(`<i class="unmute fas fa-microphone-slash"></i>`);
}

//to play and stop video
const playStop= () =>{
  let enabled= myVideoStream.getVideoTracks()[0].enabled;     //get current enabled version of our video stream
  if(enabled) {
    myVideoStream.getVideoTracks()[0].enabled= false;
    setPlayVideo();
  } 
  else{
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled= true;
  }
}

//change video button
function setStopVideo(){
  $(".video-button").html(`<i class="fas fa-video"></i>`);
}

function setPlayVideo(){
  $(".video-button").html(`<i class="stop fas fa-video-slash"></i>`);
}