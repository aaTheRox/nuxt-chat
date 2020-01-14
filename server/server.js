var express = require('express');
var bodyParser = require('body-parser')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var path = require('path');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db/data.json')
const db = low(adapter)

// CONFIG
db.defaults({ users: [], channels: []})
  .write()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


io.on('connection', function(socket){
  socket.on('register', (data)=>{
    let uniqueID = Math.random().toString(36).slice(2);
    const user = db
    .get('users')
    .find({ username:  data.username })
    .value()

    console.log(user)

    if(user!=undefined) {
      data = { status: 'USER_ALREADY_EXISTS' };
    } else {
       db.get('users')
      .push({ id: uniqueID, username: data.username, password: data.password})
      .write();
      
     data = {
        status: 'USER_CREATED',
        userId: uniqueID,
        username: data.username,
        password: data.password
      }
    }
    io.sockets.emit('register', data);
    
});

  socket.on('login', (data)=>{
    const user = db.get('users').find({username: data.username, password: data.password}).value();
    if(user) {
      data = {
        status: 'LOGIN_SUCCESS',
        userId: user.id,
        username: user.username,
        accessToken: Math.random().toString(36).substr(2)
      }
    } else {
      data = {
        status: 'LOGIN_ERROR',
      }
    }
    io.sockets.emit('login', data);
});

socket.on("send-message", (data)=>{
  const send_timestamp = Date.now();
  console.log(send_timestamp);
  console.log(data)
  io.sockets.emit('send-message', data);
  // add message
  db.get('channels')
    .push({
      chat_id: 1,
      sender_id: data.sender_id,
      author: data.author,
      message: data.message,
      timestamp: send_timestamp
    })
    .write();
  });

socket.on("typing", (data)=>{
  socket.broadcast.emit('typing', data);
});

socket.on('getConnectedUsers', (data) => {
  const res = {};
  //const res = {users: [{username: 'pepe'},{username: 'pato'},{username: 'juan'}]}
  io.sockets.emit('getConnectedUsers', res);
})



socket.on('get-messages', (res) => {
  const messages = db.get('channels').value().filter((message) => message.chat_id!=0); // filter by user id 
  console.log(`[API] Retrieving a total of ${messages.length} messages`);
  io.sockets.emit('get-messages', messages)
})

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
