var socket = io("http://localhost:3000");

$(document).ready(function(){
    $("#loginForm").show();
    $("#chatForm").hide();
    // var socket = io("http://localhost:3000");

    $("#btnRegister").click(function(){
        socket.emit("Client-send-username", $("#txtUserName").val());
    });

    $("#btnSendMessage").click(function(){
        var message = $("#txtMessage").val();
        if(message == null || message == ""){
            return;
        }
        socket.emit("Client-send-message", message);
    });

    $("#btnLogout").click(function(){
        socket.emit("Client-send-logout");
        $("#loginForm").show();
        $("#chatForm").hide();
    });

    $("#txtMessage").focusin(function(){
        //console.log("Typping")
        socket.emit("Client-send-typing-message");
    });
    // $("#txtMessage").on( "focusin", function() {
    //     console.log("Typping")
    //     socket.emit("Client-send-typing-message");
    //   } );

    $("#txtMessage").focusout(function(){
        socket.emit("Client-send-stop-typing-message");
    });

    socket.on("Server-send-register-fail", function(data){
        alert(data);
    });

    socket.on("Server-send-register-success", function(data){
        
        $("#currentUser").html(data);
        $("#loginForm").hide();
        $("#chatForm").show();
    });
    socket.on("Server-send-user-boxchat", function(data){
        $("#boxContent").html("");

        data.forEach(user => {
            $("#boxContent").append(`<div class='useronline'>${user}</div>`)
        });
    });
    socket.on("Server-send-message", function(data){
        $("#listMessages").append(`<div class='message'>${data.userName} : ${data.content}</div>`);
    });
    
    socket.on("Server-send-typing-message", function(data){
        $("#notify-typing").html(data);
    });

    socket.on("Server-send-stop-typing-message", function(){
        $("#notify-typing").html("");
    });
    
    // //alert("abc")

    // socket.on("Server-send-data", function(data){
    //     $("#noidung").append(data + ", ");
    //     console.log("data")
    // })
})