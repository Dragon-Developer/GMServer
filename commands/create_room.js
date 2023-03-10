const Room = require("../classes/Room");

module.exports = {
    execute(server, client, data) {
        // Reached max number of rooms
        if (server.rooms.length >= server.room_limit) {
            return client.sendJSON({
                type: "error",
                text: `The server has reached the max number of rooms: ${server.room_limit}`
            });
        }
        // Client can only create 1 room
        if (server.rooms.find(r => r.owner.id === client.id)) {
            return client.sendJSON({
                type: "error",
                text: "You have already created a room!"
            });
        }
        client.leaveRoom();
        // Create room
        let room = new Room(server, client, data.name, parseInt(data.limit))
        server.rooms.push(room);
        // Send room info to client
        client.sendJSON({
            type: "created_room",
            room_id: room.id,
            x: client.player.x,
            y: client.player.y,
            client_id: client.id,
            name: data.name,
            limit: data.limit
        });
        client.roomID = room.id;
        server.log(`Client ${client.id} created room ${room.id} (${room.name}).`);
    }
}