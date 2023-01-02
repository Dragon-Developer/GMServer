module.exports = {
    execute(server, client, data) {
        client.sendJSON(data);
    }
}