var express = require('express');
const { stringify } = require('querystring');
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);

var io = require("socket.io")(server);
server.listen(3000, function(){
    console.log("Listening on http://localhost:3000/");
});

var memberChats = [];

io.on("connection", function(socket){
    console.log("Co nguoi dang ket noi: " + socket.id);

    socket.on("disconnect", function(){
        console.log(socket.id + " da ngat ket noi");
    });

    socket.on("Client-send-create-room", function(data){
        // join socket to room 
        socket.join(data);
        socket.Phong = data;

        console.log(socket.adapter.rooms);

        var roomArray = [];
        socket.adapter.rooms.forEach((value, key) => {
            //console.log(`map.get('${key}') = ${value}`)
            roomArray.push(key);
        });
        io.sockets.emit("Server-send-rooms", roomArray);
        
        socket.emit("Server-send-current-room", data);
    });

    socket.on("Client-send-chat", function(data){
        console.log("Content chat: " + data)
        io.sockets.in(socket.Phong).emit("Server-send-chat", data);
    });
})

app.get("/", function(req, res){
    res.render("chatRoom");
})
