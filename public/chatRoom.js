$(document).ready(function(){
    var socket = io("http://localhost:3000");

    $("#btnCreateRoom").click(function(){
        socket.emit("Client-send-create-room", $("#txtRoom").val());
    });
    
    socket.on("Server-send-rooms", function(data){
        console.log(data)
        $("#rooms").html("");
        data.forEach(room => {
            $("#rooms").append(`<div class="room">${room}</div>`)
        });
    });
    
    socket.on("Server-send-current-room", function(data){
        $("#currentRoom").html(data);
    });

    $("#btnChat").click(function(){
        socket.emit("Client-send-chat", $("#txtChat").val());
    });
    
    socket.on("Server-send-chat", function(data){
        console.log("Client: " + data);
        //$("#chats").html(data)
        $("#chats").append(`<div class='message'>${data}</div>`);
    });
})