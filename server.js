const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
  });


const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id) 
  messages.push(message);
  socket.broadcast.emit('message', message);
  });
  socket.on('user', ({user}) => {
    console.log('I have added user ' + user + ' with id ' + socket.id);
    users.push({name: user, id: socket.id});
    console.log(users);
    socket.broadcast.emit('user', {user});
  });
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') 

    for(let leftUser of users) {
      if(leftUser.id === socket.id) {
        users.splice(users.indexOf(leftUser), 1);
        socket.broadcast.emit('removeUser', leftUser.name);
      };
    };

  });
  console.log('I\'ve added a listener on message event \n');
});