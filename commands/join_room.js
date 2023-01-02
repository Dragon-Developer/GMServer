const Room = require("../classes/Room");

module.exports = {
    execute(server, client, data) {
        // Get room
        let room = server.rooms.find(r => r.id == data.id);
        // Couldn't find the room
        if (!room) {
            return client.sendJSON({
                type: "error",
                text: "Invalid room!"
            });
        }
        // Cannot join the room again
        if (room.players.includes(client.id)) {
            return client.sendJSON({
                type: "error",
                text: "You have already joined this room!"
            });
        }
        // Room reached max number of players
        if (room.players.length >= room.limit) {
            return client.sendJSON({
                type: "error",
                text: `The room has reached the max number of players: ${room.limit}`
            });
        }
        // Add player to the room
        room.players.push(client.id);
        client.roomID = room.id;
        server.log(`Client ${client.id} joined room ${room.id}.`);
    }
}