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
        if (client.player?.room === room) {
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
        client.leaveRoom();
        // Add player to the room
        room.addPlayer(client);
        client.sendJSON({
            type: "joined_room",
            client_id: client.id,
            x: client.player.x,
            y: client.player.y
        });
        server.log(`Client ${client.id} joined room ${room.id} (${room.name}).`);
    }
}