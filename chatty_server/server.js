const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1');
const WebSocket = require('ws');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const colourList = [
  'orange',
  'green',
  'blue',
  'magenta'
];

// WebSockets server is Created //
const wss = new SocketServer({server});
let nextSocketId = 0;

// Messages Broadcast to Client //
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

// Connection is Established //
wss.on('connection', (client) => {
  console.log('Client connected');

  // Online Users and User Color //
  const socketId = nextSocketId;
  nextSocketId += 1;
  let userLoggedIn = {
    type: "onlineUsers",
    value: nextSocketId
  }
  wss.broadcast(JSON.stringify(userLoggedIn));

  const colourPayload = {type: 'colourAssignment', colour: colourList[nextSocketId % 4] }
  client.send(JSON.stringify(colourPayload));

  // Incoming Message Data and Sending //
  client.on('message', (data) => {
    inMessage = JSON.parse(data);
    switch(inMessage.type) {
      case "postMessage":
        inMessage = {
          uniqueKey: uuidV1(),
          user: inMessage.user,
          content: inMessage.content,
          type: "incomingMessage"
        };
      break;
      case "postNotification":
        inMessage = {
          uniqueKey: uuidV1(),
          user: inMessage.user,
          notification: inMessage.notification,
          type: "incomingNotification"
        };
      break;
      default:
      throw new Error(`Unknown event type ${inMessage.type}`);
    };
      wss.broadcast(JSON.stringify(inMessage));
  });

// Client Socket ID Deleted when User Disconnects //
  client.on('close', () => {
    nextSocketId -= 1;
    let userLoggedOut = {
      type: "onlineUsers",
      value: nextSocketId
    }
    wss.broadcast(JSON.stringify(userLoggedOut));
    console.log('Client has disconnected');
  });

}); // Connection Ends Here //
