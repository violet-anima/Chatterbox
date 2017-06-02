const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1');
const WebSocket = require('ws');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

//----Create the WebSockets server----\\
const wss = new SocketServer({server});
let nextSocketId = 0;

//----Broadcasting messages back to Client----\\
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

//----Establishing connection----\\
wss.on('connection', (ws) => {
  console.log('Client connected');

//----UsersOnline Info----\\
  const socketId = nextSocketId;
  nextSocketId += 1;
  let userLoggedIn = {
    type: "onlineUsers",
    value: nextSocketId
  }
  wss.broadcast(JSON.stringify(userLoggedIn));

//----Incoming message data && Sending----\\
  ws.on('message', (data) => {
    inMessage = JSON.parse(data);
    switch(inMessage.type) {
      case "postMessage":
        inMessage = {
          uniqueKey: uuidV1(),
          username: inMessage.username,
          content: inMessage.content,
          type: "incomingMessage"
        };
      break;
      case "postNotification":
        inMessage = {
          uniqueKey: uuidV1(),
          notification: inMessage.notification,
          type: "incomingNotification"
        };
      break;
      default:
      throw new Error(`Unknown event type ${inMessage.type}`);
    };//end of switch statement\\
      wss.broadcast(JSON.stringify(inMessage));
  });

//----Client Socket ID deleted when user disconnects----\\
  ws.on('close', () => {
    nextSocketId -= 1;
    let userLoggedOut = {
      type: "onlineUsers",
      value: nextSocketId
    }
    wss.broadcast(JSON.stringify(userLoggedOut));
    console.log('Client disconnected');
  });

}); //----end of connection connection----\\
