module.exports = {
    execute(server, client, data) {
        if (!client.player?.room) return;
        client.player?.room.getClients(client.id).forEach(c => {
            c.sendJSON({
              type: "player_state",
              ID: client.id,
              x: data.x,
              y: data.y,
              xscale: data.xscale,
              sprite: data.sprite,
              index: data.index
            });
        });
    }
}