module.exports = class Player {
    constructor(server, client, room) {
        this.server = server;
        this.client = client;
        this.id = client.id;
        this.room = room;
    }
    getClient() {
        return this.server.clientList.find(c => c.id === this.id);
    }
    leave() {
        let roomIndex = this.server.rooms.indexOf(this.room);
        // If this player has created a room, notify all players this room has been deleted
        if (roomIndex != -1 && this.room.owner.id === this.id) {
            // Players in this room
            let clients = this.room.getClients().filter(p => p.id != this.id);
            for (let c of clients) {
                c.sendJSON({
                    type: "deleted_room"
                });
                c.player == null;
            }
            this.server.rooms.splice(roomIndex, 1);
            this.server.log(`The room ${this.room.id} (${this.room.name}) has been deleted!`);
            this.room = null;
        }
        if (this.room) {
            let playerIndex = this.room.players.find(p => p.id == this.id);
            this.room.players.splice(playerIndex, 1);
            this.server.log(`Client ${this.id} left the room ${this.room.id} (${this.room.name}).`);
        }
        this.client.player = null;
    }
}