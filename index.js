// Modules
require('dotenv').config();
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

// Create Server
const server = new WebSocket.Server({ port: process.env.PORT });
server.rooms = [];
server.roomID = 0;      // Increase by 1 when a room is created
server.clientList = []; // List of Clients
server.clientID = 0;    // Increase by 1 when a client connects
server.room_limit = 10; // Limit of rooms at the same time
server.log = (...x) => console.log(...x);
server.clientConnectIndex = 0; // Index of next client to reconnect
server.awaitingRequest = false; // Is the server waiting a request

// Load Commands
server.commands = {};

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    const commandName = file.slice(0, -3);  // Remove .js from the file name

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('execute' in command) {
        server.commands[commandName] = command;
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "execute" property.`);
    }

}

// New Connection
server.on("connection", (client, req) => {
    client.id = server.clientID++;
    client.player = null;
    server.clientList.push(client);
    server.awaitingRequest = false;
  
    // Send JSON data
    client.sendJSON = function (data) {
        client.send(JSON.stringify(data));
    };
    client.leaveRoom = function() {
        client.player?.leave();
    }

    // Connected
    console.log(`A new player has connected! ID: ${client.id}`);
    console.log("User-Agent: " + req.headers['user-agent']);
    
    // Receive message
    client.on("message", msg => {
        try {
            let data = JSON.parse(msg);
            if (server.commands.hasOwnProperty(data.type)) {
                server.commands[data.type].execute(server, client, data);
            } else {
                console.log(`Invalid message type: ${data.type}`)
            }
        } catch (ex) {
            console.error(ex);
        }
    });

    // Disconnected
    client.on("close", () => {

        let clientIndex = server.clientList.indexOf(client);

        client.leaveRoom();
        
        server.clientList.splice(clientIndex, 1);
        console.log(`A player has been disconnected! ID: ${client.id}`);
    });

    // Error
    client.onerror = function () {

    }
});

console.log(`The WebSocket Server is running!`);

// Use this only if you need to keep the server online when there is a client
function sendRequest() {
  
  let len = server.clientList.length;
  let index = server.clientConnectIndex;
  if (index >= len) index = 0;
  if (len) {
    server.awaitingRequest = true;
    server.clientList[index].sendJSON({
      type: "connect"
    });
    server.clientConnectIndex = (index + 1) % len;
  }
  setTimeout(() => {
    if (server.awaitingRequest) {
      sendRequest();
    }
  }, 5000);
  
}

setInterval(() => {
  if (server.clientList.length) 
    sendRequest();
}, 240000);

