let WSServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./http-server'),
    low = require('lowdb'),
FileSync = require('lowdb/adapters/FileSync'),

adapter = new FileSync('db/data.json'),
db = low(adapter)
let Messages = require('./db.js');

const PORT = process.env.PORT || 8888;
// Create web socket server on top of a regular http server
let wss = new WSServer({
  server: server
});

// Also mount the app here
server.on('request', app);

console.log('Esperando a una conexión mediante WS...')
wss.on('connection', function connection(ws) {
  console.log(`Connected`);


  ws.on('message', async function incoming(data) {

    // Se recorren todos los clientes conectados y se envia el mensaje.


    const messages =  await Messages.find()
    console.log(`[API] Retrieving a total of ${messages.length} messages`)

      wss.clients.forEach(function each(client) {
          client.send(messages);
      });
    



     
        const parsed = JSON.parse(data);
        const send_timestamp = Date.now();
        const newMessage = new Messages({
        //message_id: randomInteger(),
        sender_id: parsed.sender_id,
        author: parsed.author,
        message: parsed.message,
        timestamp: send_timestamp,
        edited: false
        });
        await newMessage.save()
        console.log({status: 'MESSAGE_SENT'});

  });

  ws.on('close', (message)=> {
    console.log('Se ha desconectado un cliente');
    ws.close();
  });

});

async function getAllMessages() {
  //const messages = db.get('channels').value().filter((message) => message.message_id!=0); // filter by user id 
    
}

server.listen(PORT, function() {
  console.log(`http/ws server listening on ${PORT}`)
});

const randomInteger = () => {
  return Math.floor(Math.random(999999999-0) * 999999999)
}