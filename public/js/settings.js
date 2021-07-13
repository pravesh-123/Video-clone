const myVideo= document.createElement("video");     //create an HTML video element
const videoShow= $('#video-show');
const joinButton= $(".join-btn");
var meetTitle = localStorage.getItem("createMeetTitle"); 

$(".meet-title").text(meetTitle);   //set meet title taken from user
// myVideo.muted= true;

var myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{      //if access to video and audio is given, then stream
    myVideoStream = stream;
    addVideo(myVideo, stream);
})

//add video to page
const addVideo = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () =>{
        video.play();       //play the video
    })
    videoShow.append(video);     //add our video inside the div with id= video-box
}

var joinCode = localStorage.getItem("joinExistingRoomCode");  
$("a").attr("href", joinCode);

var createCode = localStorage.getItem("createdRoomCode");  
$("a").attr("href", createCode);

joinButton.click(function(){
    let setAudio= myVideoStream.getAudioTracks()[0].enabled;
    let setVideo= myVideoStream.getVideoTracks()[0].enabled;

    localStorage.setItem("setAudio", setAudio);
    localStorage.setItem("setVideo", setVideo);
})