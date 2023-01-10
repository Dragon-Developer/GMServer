module.exports = {
    execute(server, client, data) {
        client.player?.room?.getClients(client.id).forEach(c => {
            c.sendJSON({
                type: "player_state",
                id: client.id,
                x: data.x,
                y: data.y,
                xscale: data.xscale,
                sprite: data.sprite,
                index: data.index  
            });
        });
    }
}