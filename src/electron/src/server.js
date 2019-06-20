const fs = require("fs");
const https = require("https");
const WebSocket = require("ws");

module.exports = {
  createServer(port: int, cert: Buffer, key: Buffer) {
    server = https.createServer({ cert, key });
    server.listen(port);
    return new WebSocket.Server({ server });
  }
};
