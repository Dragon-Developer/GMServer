// Modules
const WebSocketServer = require('ws');
require('dotenv').config();

// Create Server
const wss = new WebSocketServer.Server({ port: process.env.PORT });

wss.on("connection", ws => {
    
    // Send JSON data
    ws.sendJSON = function(data) {
        ws.send(JSON.stringify(data));
    };

    // Connected
    console.log("A new player has connected!");

    // Receive message
    ws.on("message", msg => {
        try {
            let data = JSON.parse(msg);
            handleMessage(ws, data);
        } catch (ex) {
            console.error(ex);
        }
    });
    
    // Disconnected
    ws.on("close", () => {
        console.log("A player has been disconnected!");
    });

    // Error
    ws.onerror = function() {

    }
});

console.log(`The WebSocket Server is running at port ${process.env.PORT}!`);

function handleMessage(ws, data) {
    switch (data.type) {
        case "ping":
            // Send ping back
            ws.sendJSON(data);
            break;
        // Other event types here
        default:
            console.log(data);
    }
}