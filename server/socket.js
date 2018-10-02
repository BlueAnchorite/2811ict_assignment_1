module.exports = function(app, io){
    console.log("Server socket initialised");

    io.on('connection', (socket)=>{
        socket.on('join-channel', (data)=>{
            //console.log(data.channel.name + " joined to socket");
            socket.join(data.channel.name);
        });
        
        socket.on('leave-channel', (data)=>{
            //console.log(data.channel.name + " left the socket");
            socket.leave(data.channel.name);
        });
        
        socket.on('disconnect', function(){
            //io.emit('message', {type:'message', text: "User has disconnected"});
        });
        
        socket.on('add-message', (data)=>{
            io.to(data.channel.name).emit('message', {type:'message', text: data.message});
        });
        
        socket.on('join-message', (data)=>{
            io.to(data.channel.name).emit('message', {type:'message', text: data.username + " has joined!"});
        });
        
        socket.on('left-message', (data)=>{
            io.to(data.channel.name).emit('message', {type:'message', text: data.username + " has left the channel"});
        });
    });
};