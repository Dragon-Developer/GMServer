const Player = require("./Player");

module.exports = class Room {
    constructor(server, owner, name, limit) {
        this.server = server;
        this.id = server.roomID++;
        this.owner = owner;
        this.name = name;
        this.limit = limit;
        this.players = [];
        this.addPlayer(owner);
    }
    // Is the room full of players?
    isFull() {
        return this.players.length >= this.limit;
    }
    // Get Info for Room List
    getPreviewInfo() {
        return {
            id: this.id,
            ownerID: this.owner.id,
            name: this.name,
            limit: this.limit,
            playerTotal: this.players.length
        };
    }
    // Get player info list
    getPlayerList() {
        return this.getClients().map(c => this.getPlayer(client));
    }
    // Get clients in this room
    getClients(exceptClientID = null) {
        return this.players.map(p => p.getClient()).filter(c => c.id != exceptClientID);
    }
    // Get Player from Client
    getPlayer(client) {
        return this.players.find(p => p.id === client.id);
    }
    // Add Player to this room
    addPlayer(client) {
        let player = new Player(this.server, client, this);
        this.players.push(player);
        client.player = player;
    }
}