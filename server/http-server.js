let express = require('express')(),
    app = require('express')(),
    bodyParser = require('body-parser'),
    path = require('path'),
    low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db/data.json')
const db = low(adapter)


let Messages = require('./db.js');

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


app.get('/getMessages', async(req, res) => {
    //const messages = db.get('channels').value().filter((message) => message.message_id!=0); // filter by user id 
    const messages =  await Messages.find();
    console.log(`[API] Retrieving a total of ${messages.length} messages`);
    res.send(messages)
})


const generateAuthToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const randomInteger = () => {
  return Math.floor(Math.random(999999999-0) * 999999999);
}


module.exports = app;