'use strict';

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(5000);
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const apiai = require('apiai')('c7170cc3822c44b798ccdb3330919818');

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('connection', function(socket) {
	
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    let apiaiReq = apiai.textRequest(text, {
      sessionId: '123456789'
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => console.log(error));

    apiaiReq.end();
  });
});
