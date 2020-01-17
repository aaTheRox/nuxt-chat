var express = require('express');
var bodyParser = require('body-parser')
var app = require('express')();
var server = app.listen(8081);
var http = require('http').Server(app);
var io = require('socket.io')(http);


const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8888});
const date = new Date()
const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;


var port = process.env.PORT || 8080
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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});





/*
app.post('/login', (req, res) => {
  let data = req.body;
  console.log(data)

  const user = db.get('users').find({username: data.username, password: data.password}).value();
    if(user) {
      data = {
        status: 'LOGIN_SUCCESS',
        userId: user.id,
        username: user.username,
        accessToken: generateAuthToken()
      }
    } else {
      data = {
        status: 'LOGIN_ERROR',
      }
    }
    res.send(data);

})

app.post('/register', (req, res) => {
  const user = db.get('users').find({username: req.body.username}).value();
    if(!user) {
      const uniqueID = generateAuthToken();
      data = {
        status: 'USER_CREATED',
        userId: uniqueID,
        accessToken: uniqueID
      }
       db.get('users')
      .push({ id: uniqueID, username: req.body.username, password: req.body.password})
      .write();
    } else {
      data = {
        status: 'USER_ALREADY_EXISTS',
      }
    }
    res.send(data);
})

app.get('/getMessages', (req, res) => {
  const messages = db.get('channels').value().filter((message) => message.message_id!=0); // filter by user id 
  console.log(`[API] Retrieving a total of ${messages.length} messages`);
  res.send(messages)
})



socket.on("send-message", (data)=>{
  const send_timestamp = Date.now();
  io.sockets.emit('send-message', data);
  // add message
  db.get('channels')
    .push({
      message_id: randomInteger(),
      sender_id: data.sender_id,
      author: data.author,
      message: data.message,
      timestamp: send_timestamp,
      edited: false
    })
    .write();
  });

socket.on("typing", (data)=>{
  console.log('typing')
  socket.broadcast.emit('typing', data);
});

socket.on('getConnectedUsers', (data) => {
  const res = {};
  //const res = {users: [{username: 'pepe'},{username: 'pato'},{username: 'juan'}]}
  io.sockets.emit('getConnectedUsers', res);
})

socket.on('get-messages', (res) => {
  const messages = db.get('channels').value().filter((message) => message.message_id!=0); // filter by user id 
  console.log(`[API] Retrieving a total of ${messages.length} messages`);
  io.sockets.emit('get-messages', messages)
})

socket.on('get-mylast-message', (sender_id) => {
  console.log('ccc', sender_id)
  const lastMessage = db.get('channels').filter({sender_id}).orderBy ('timestamp','desc').take(1).value()
  console.log(lastMessage) 
  socket.emit('get-mylast-message', ...lastMessage);
  console.log('getting my last message')
})

socket.on('edit-message', (resp) => {
  const response = db.get('channels')
    .find({message_id: resp.message_id})
    .assign({message: resp.message, timestamp: Date.now(), edited: true})
    .write()
    const lastMessage = db.get('channels').filter({message_id: resp.message}).take(1).value()
    console.log(lastMessage) 
    socket.emit('edit-message', lastMessage);
})

});

// Generates a token for user auth
const generateAuthToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const randomInteger = () => {
  return Math.floor(Math.random(999999999-0) * 999999999);
}
/*
http.listen(port, () =>{
  console.log('listening on *:' + port);
});
*/
