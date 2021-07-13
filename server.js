//imports
const express= require("express");
const app= express();
const http = require("http");
const server= http.Server(app);
const io=  require("socket.io")(server);
const { v4: uuidv4}= require("uuid");           //using version 4 of uuid
const { ExpressPeerServer }= require("peer");   //import peer.js
const { response } = require("express");
const peer= ExpressPeerServer(server, {         //peer server is working with express to give us the functionality
    debug: true
});
const routes = require('./routes');
var memberNames= [], memberIds= []; 

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peer);       //url that peer.js is going to use
app.use("/", routes);


//joining a room for multiple users
io.on("connection", socket =>{        //when user has made a connection
    socket.on("join-room", (roomId, userId, username)=>{            //when url is visited, enter the room
        memberIds.push(userId);
        memberNames.push(username);
        
        socket.username = username;             // we store the username in the socket session for this client
        socket.join(roomId);                    //join the room of the emitted id

        socket.broadcast.to(roomId).emit("user-connected", {
            username: socket.username,
            userId: userId
        });     //broadcasts "user connected" for user so that everyone else knows that another user has connected so that they can be added to the stream, the user who is connected doesn't recieve this message
        
        //chat
        socket.on("message", (msg) => {     //receives the chat message on hitting enter
            socket.broadcast.to(roomId).emit("createMessage", {
                username: socket.username,
                msg: msg
              })    //send message back to client to the same room with username
        }); 

        socket.emit("all-users", memberNames, memberIds);

        socket.on("disconnect", () => {
            var index= memberIds.indexOf(userId);
            memberNames.splice(index, 1);
            memberIds.splice(index, 1);

            socket.broadcast.to(roomId).emit("user-disconnected", {
                username: socket.username,
                userId: userId
            });
        })
    })

})







//start the server
server.listen(process.env.PORT || 3002);