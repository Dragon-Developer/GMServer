module.exports = class Room {
    constructor(id, ownerID, name, limit) {
        this.id = id;
        this.ownerID = ownerID;
        this.name = name;
        this.limit = limit;
        this.players = [ownerID];
    }
    // Is the room full of players?
    isFull() {
        return this.players.length >= this.limit;
    }
    getInfo() {
        return {
            id: this.id,
            ownerID: this.ownerID,
            name: this.name,
            limit: this.limit,
            playerTotal: this.players.length
        };
    }
}