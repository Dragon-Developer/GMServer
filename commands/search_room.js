module.exports = {
    execute(server, client, data) {
        client.sendJSON({
            type: "room_list",
            rooms: server.rooms.map(r => r.getInfo())
        });
    }
}