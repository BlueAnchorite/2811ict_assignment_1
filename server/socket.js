module.exports = function(app, io){
    console.log("Server socket initialised");

    io.on('connection', (socket)=>{
        io.emit('message', {type:'message', text: "User has connected!"});
        
        socket.on('disconnect', function(){
            io.emit('message', {type:'message', text: "User has disconnected"});
        });
        
        socket.on('add-message', (message)=>{
            io.emit('message', {type:'message', text: message});
        });
        
        socket.on('join-message', (username)=>{
            io.emit('message', {type:'message', text: username + " has joined!"});
        });
        
        socket.on('left-message', (username)=>{
            io.emit('message', {type:'message', text: username + " has left the channel"});
        });
    });
};