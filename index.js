// Modules
require('dotenv').config();
const WebSocketServer = require('ws');
const path = require('path');
const fs = require('fs');

// Create Server
const server = new WebSocketServer.Server({ port: process.env.PORT });
server.rooms = [];
server.roomID = 0;      // Increase by 1 when a room is created
server.clientList = []; // List of Clients
server.clientID = 0;    // Increase by 1 when a client connects
server.room_limit = 10; // Limit of rooms at the same time
server.log = (...x) => console.log(...x);

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
server.on("connection", client => {

    client.id = server.clientID++;
    client.roomID = -1;

    server.clientList.push(client);

    // Send JSON data
    client.sendJSON = function (data) {
        client.send(JSON.stringify(data));
    };
    
    // Leave room
    client.leaveRoom = function () {
        if (client.roomID === -1) return;
        let room = server.rooms.find(r => r.id == client.roomID);
        if (room) {
            let playerIndex = room.players.find(p => p.id == client.id);
            room.players.splice(playerIndex, 1);
            server.log(`Client ${client.id} left the room ${room.id}.`);
        }
    }

    // Connected
    console.log(`A new player has connected! ID: ${client.id}`);

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
        
        // If this player has created a room
        let roomIndex = server.rooms.findIndex(r => r.ownerID == client.id);
        // Notify all players that this room has been deleted
        if (roomIndex != -1) {
            let room = server.rooms[roomIndex];
            server.rooms.splice(roomIndex, 1);
            // Players in this room
            let players = server.clientList.filter(c => c.id != client.id && room.players.includes(c.id));
            players.forEach(player => {
                player.sendJSON({
                    type: "deleted_room"
                });
                player.roomID = -1;
            })
        }
        
        client.leaveRoom();
        
        server.clientList.slice(clientIndex, 1);
        console.log(`A player has been disconnected! ID: ${client.id}`);
    });

    // Error
    client.onerror = function () {

    }
});

console.log(`The WebSocket Server is running!`);