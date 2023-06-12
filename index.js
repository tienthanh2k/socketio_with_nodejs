var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);

var io = require("socket.io")(server);
server.listen(3000);

io.on("connection", function(socket){
    console.log("Co nguoi dang ket noi: " + socket.id);

    socket.on("disconnect", function(){
        console.log(socket.id + " da ngat ket noi");
    });

    socket.on("Client-send-data", function(data){
        console.log(socket.id + " has data: " + data)
        
        // Send cho socket thuc hien emit
        //socket.emit("Server-send-data", data+"888");

        // Send cho tat ca socket lang nghe
        //io.sockets.emit("Server-send-data", data+"888");

        // Send cho 1 anh
        //io.to(socket.id).emit("Server-send-data", data+"888");

        // Gui cho nhung nguoi xung quanh
        socket.broadcast.emit("Server-send-data", data+"888")
    })

})

app.get("/", function(req, res){
    res.render("trangchu");
})
