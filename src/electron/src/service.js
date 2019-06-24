function onConnection(ws) {
  ws.on("message", function message(data) {
    console.log("recieved: %s", data);
    // TODO: base on data, handle request
  });
}

module.exports = class Service {
  constructor(wss) {
    this.wss = wss;
    wss.on("connection", onConnection);
  }

  stop() {
    this.wss.close();
  }
};
