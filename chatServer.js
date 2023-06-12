var express = require('express');
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

    socket.on("Client-send-username", function(data){
        console.log(socket.id + " nhan user name: " + data);
        if(memberChats.indexOf(data)>=0){
            // Có trong ds chat rồi
            // Tạo thất bại
            // Báo lỗi cho người vừa đăng ký
            socket.emit("Server-send-register-fail", `${data} đã tồn tại trên boxchat. Vui lòng điền tên khác`);
        } else {
            // Đăng ký Thành công
            // Thêm thành viên vào boxchat
            // Báo thành viên mới cho mọi người trong boxchat
            memberChats.push(data);
            socket.UserName = data;
            socket.emit("Server-send-register-success", data);
            io.sockets.emit("Server-send-user-boxchat", memberChats);

        }
    });

    socket.on("Client-send-logout", function(){
        // Tim User can xoa tu username luu trong socket
        let index = memberChats.indexOf(socket.UserName);
        memberChats.slice(index, 1);

        // Phát tín hiệu cho các user trong boxchat
        socket.broadcast.emit("Server-send-user-boxchat");
    });
    socket.on("Client-send-message", function(data){
        // Phát tín hiệu cho các user trong boxchat
        io.sockets.emit("Server-send-message", {
            userName: socket.UserName,
            content: data
        });
    });

    socket.on("Client-send-typing-message", function(){
        // Phát tín hiệu cho các user trong boxchat
        console.log(`${socket.UserName} dang go chu`)
        var msg = `${socket.UserName} đang chat ...`;
        io.sockets.emit("Server-send-typing-message", msg);
    });
    
    socket.on("Client-send-stop-typing-message", function(){
        // Phát tín hiệu cho các user trong boxchat
        io.sockets.emit("Server-send-stop-typing-message")
    });

    
})

app.get("/", function(req, res){
    res.render("home");
})
