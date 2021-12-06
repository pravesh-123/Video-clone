const socket = io("/https://node-chat-video-app.herokuapp.com/"); //importing socket.io
const myVideo = document.createElement("video"); //to create an HTML video element
const videoBox = $("#video-box");
const rightPane = $(".right-pane");
var myPeer = new Peer(undefined, {
  //id created automatically by peer so undefined
  path: "/peerjs",
  host: "/", //host we're hosting peer on
  port: "443", //peer server runs on port 443
});
const peers = {},
  allPeers = [];
var myUserId = "";
var myVideoStream, myScreenStream;

rightPane.hide();
$(".left-pane").css("flex", "1");

//getting usernames and meet titles of users from local storage
var userName = localStorage.getItem("userName");
var meetTitle = localStorage.getItem("createMeetTitle");

myVideo.muted = true; //to mute my own video for me

//get video and audio output from chrome
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    //if access to video and audio is given, then stream
    myVideoStream = stream;
    addVideo(myVideo, stream, "my-video", "You"); //function call to addVideo
    addMeetingTitle();
    var connectedUsersId;
    myPeer.on("connection", function (conn) {
      conn.on("data", function (id, name) {
        connectedUsersId = id;
      });
    });

    myPeer.on("call", (call) => {
      call.answer(stream); //answer the call recieved from other users
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        //add video stream from user
        addVideo(video, userVideoStream, connectedUsersId);
      });

      allPeers.push(call.peerConnection);
    });

    //wait for my stream and then send it to everyone else
    socket.on("user-connected", (data) => {
      //on when a user connects to the room
      $(".people").append(
        `<li class="ppl ${data.userId}">${data.username}<hr></li>`
      ); //append name to member list
      setTimeout(() => {
        connectToUser(data.userId, stream, data.username); //user joined now, passing our stream
      }, 1000);
      $(".messages").append(
        `<li class="connect"><i>${data.username} has joined.</i></li>`
      );
    });

    //Chat functionality
    $("html").keydown(function (e) {
      //when user presses enter
      if (e.which == 13) {
        sendMessage();
      }
    });

    socket.on("createMessage", (data) => {
      //when server sends back the message
      $(".messages").append(
        `<li class="msg"><b>${data.username}</b><br/><span>${data.msg}</span></li>`
      ); //append msg to the chatbox
      scrollBottom();
    });
  });

socket.on("user-disconnected", (data) => {
  $(".messages").append(
    `<li class="disconnect"><i>${data.username} has left the meeting.</i></li>`
  );
  $(`.${data.userId}`).remove();
  if (peers[data.userId]) {
    peers[data.userId].close();
  }
});

//listen on the peer connection and join room with specific id
myPeer.on("open", (userId) => {
  //when connection is opened by a specific (user) id
  userName = cleanInput(userName);
  myUserId = userId;
  $(".people").append(`<li class="ppl ${userId}">${userName} (You)<hr></li>`); //append name to member list
  socket.emit("join-room", room_id, userId, userName); //emit user id and username of the user connected; sends event to the server
});

//connect a new user when they connect
const connectToUser = (userId, stream, username) => {
  //calls this function for others when a new user connects to the room
  var conn = myPeer.connect(userId);
  conn.on("open", function () {
    conn.send(myUserId, userName);
  });
  const call = myPeer.call(userId, stream); //call that user and send them our stream
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    //call on the user video stream
    addVideo(video, userVideoStream, userId); //when new stream is received, the video is added
  });

  call.on("close", () => {
    video.remove();
  });

  allPeers.push(call.peerConnection);
  peers[userId] = call;
};

const addNameToVideo = (name) => {
  const uname = document.createElement("p");
  uname.classList.add(name);
  uname.append(document.createTextNode(name));
  $("#video-box > div").last().append(uname);
};

//add video to page
const addVideo = (video, stream, id, name) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play(); //play the video
  });
  let div = document.createElement("div");
  videoBox.append(div); //add our video inside the div with id= video-box
  let newDiv = $("#video-box > div").last();
  newDiv.attr("class", id);
  newDiv.append(video);
  if (name) {
    addNameToVideo(name);
  }

  audioVideoSettings();
};

//send message in chat on pressing enter or clicking btn
let text = $(".new-msg");
const sendMessage = () => {
  var txt = text.val().trim();
  if (txt.length !== 0) {
    txt = cleanInput(txt); // prevent markup from being injected into the message
    socket.emit("message", txt); //send message to server
    $(".messages").append(
      `<li class="msg my-text"><b>You</b><br/><span>${txt}</span></li>`
    );
  }
  text.val("");
};

//to scroll to the bottom of chat
const scrollBottom = () => {
  var chat = $(".chat-content");
  chat.scrollTop(chat.prop("scrollHeight"));
};

//to change meeting title as per user's value
const addMeetingTitle = () => {
  $(".meet-title").text(meetTitle);
};

//get and set audio and video from user's defined settings
var audioSettings = localStorage.getItem("setAudio");
var videoSettings = localStorage.getItem("setVideo");

const audioVideoSettings = () => {
  myVideoStream.getAudioTracks()[0].enabled = convertBool(audioSettings);
  myVideoStream.getVideoTracks()[0].enabled = convertBool(videoSettings);
  $("video").attr("controls", true);

  //change button accordingly in the room
  if (!myVideoStream.getAudioTracks()[0].enabled) {
    $(".mic-button").html(`<i class="unmute fas fa-microphone-slash"></i>`);
  }

  if (!myVideoStream.getVideoTracks()[0].enabled) {
    $(".video-button").html(`<i class="stop fas fa-video-slash"></i>`);
  }
};

//prevents input from having injected markup
const cleanInput = (input) => {
  return $("<div/>").text(input).html();
};

//convert string value to boolean
const convertBool = (el) => {
  if (el == "false") {
    el = false;
  } else {
    el = true;
  }
  return el;
};

//to mute and unmute audio
const muteUnmute = () => {
  let enabled = myVideoStream.getAudioTracks()[0].enabled; //get current enabled version of our video stream's audio
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

//change audio button
const setMuteButton = () => {
  $(".mic-button").html(`<i class="fas fa-microphone"></i>`);
};

const setUnmuteButton = () => {
  $(".mic-button").html(`<i class="unmute fas fa-microphone-slash"></i>`);
};

//to play and stop video
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled; //get current enabled version of our video stream
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

//change video button
function setStopVideo() {
  $(".video-button").html(`<i class="fas fa-video"></i>`);
  $(".my-video > p").css("display", "none");
}

function setPlayVideo() {
  $(".video-button").html(`<i class="stop fas fa-video-slash"></i>`);
  $(".my-video > p").css("display", "block");
}

//for screen sharing
const shareScreen = () => {
  navigator.mediaDevices
    .getDisplayMedia({
      video: {
        cursor: "always",
      },
      audio: false,
    })
    .then((stream) => {
      myScreenStream = stream;
      let streamTrack = stream.getVideoTracks()[0];

      $(".screen-button").html(`<i class="far fa-window-close"></i>`);
      $(".screen-button").attr("onclick", "stopShare()");

      for (let x = 0; x < allPeers.length; x++) {
        let sender = allPeers[x].getSenders().find(function (s) {
          return s.track.kind == streamTrack.kind;
        });
        sender.replaceTrack(streamTrack);
      }

      streamTrack.onended = function () {
        //when user clicks on 'Stop Sharing' button on browser
        stopShare();
      };
    });
};

//when user clicks on stop sharing control button
const stopShare = () => {
  myScreenStream.getVideoTracks()[0].stop();
  let videoTrack = myVideoStream.getVideoTracks()[0];
  for (let x = 0; x < allPeers.length; x++) {
    let sender = allPeers[x].getSenders().find(function (s) {
      return s.track.kind == videoTrack.kind;
    });
    sender.replaceTrack(videoTrack);
  }

  $(".screen-button").html(`<i class="fas fa-desktop"></i>`);
  $(".screen-button").attr("onclick", "shareScreen()");
};

//show and hide chat and people pane
const showMembers = () => {
  rightPane.show();
  $(".left-pane").css("flex", "0.75");
  $(".chat").hide();
  $(".members").show();
};

socket.on("all-users", (memberNames, memberIds) => {
  for (let i = 0; i < memberNames.length; i++) {
    if (memberIds[i] !== myUserId) {
      $(".people").append(
        `<li class="ppl ${memberIds[i]}">${memberNames[i]}<hr></li>`
      ); //append name to member list
    }
  }
});

const showChat = () => {
  rightPane.show();
  $(".left-pane").css("flex", "0.75");
  $(".members").hide();
  $(".chat").show();
};

$(".hide").click(function () {
  rightPane.hide();
  $(".left-pane").css("flex", "1");
});

//invite box
let invite = $(".invite-box");
const inviteOpen = () => {
  invite.css("display", "block");
};

$(".close").click(function () {
  invite.css("display", "none");
});

$(".copy").click(function () {
  $(".invite-text").select();
  document.execCommand("copy");
});

//emoji picker for chat
let emoji = $(".add-emoji");
var picker;
const showEmojis = () => {
  emoji.before("<emoji-picker></emoji-picker>");
  emoji.removeClass("fa-smile");
  emoji.addClass("fa-times-circle");
  emoji.attr("onclick", "hideEmojis()");
  emoji.attr("title", "Close");

  picker = $("emoji-picker");
  picker.on("emoji-click", (e) => {
    text.val(text.val() + e.detail.unicode);
    hideEmojis();
  });
};

const hideEmojis = () => {
  picker.remove();
  emoji.removeClass("fa-times-circle");
  emoji.addClass("fa-smile");
  emoji.attr("onclick", "showEmojis()");
  emoji.attr("title", "Add emojis");
};
