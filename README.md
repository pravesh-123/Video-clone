### myvideoconferencingapp

A video and audio conferencing web appliation with chatting and screen sharing functionality for multiple users.

### Technology stack used
HTML, CSS, Javascript, EJS, Node.js, Express.js, WebRTC, Socket.io

# Features
1. Create a new meeting and share code
2. Join an existing meeting
3. Add your username and meeting title
4. Settings to set your audio and video before meeting
5. Peer-to-peer audio/video chatting for multiple users
6. Stop/play audio and video
7. Screen share and full screen mode
8. Chat through text and add emoticons
9. Show meeting participants
10. Share invite

# Steps to run the app locally
1. Open command line in your source code downloaded folder
2. Install all the dependencies for the project using `npm install`
3. Start the application using `npm start`
4. In a second terminal, type `peerjs --port 443` to start peerjs server 
5. Open Browser and type `localhost:3002`

## Live Demo
Link: <a href="https://ms-teams-clone-nikita.azurewebsites.net">https://ms-teams-clone-nikita.azurewebsites.net</a>

### Note
If the peer server doesn't work even after following all the steps above, then please follow these additional steps:
1. Go to `public/js/script.js`
2. Comment out line number 8 `path: "/peerjs",`
3. Change peer server port to `3001` at line number 10
4. Run peer server again on command line by typing `peerjs --port 3001`
