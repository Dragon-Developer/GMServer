module.exports = {
    execute(server, client, data) {
        if (!client.player?.room) return;
        client.player.room.getClients(client.id).forEach(c => {
            c.sendJSON({
                type: "player_state",
                id: client.id,
                x: data.x,
                y: data.y    
            });
        });
    }
}