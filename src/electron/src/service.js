function onConnection(ws: WebSocket.Server) {
  ws.on("message", function message(data) {
    console.log("recieved: %s", data);
    // TODO: base on data, handle request
  });
}

export class Service {
  wss: WebSocket.Server;
  constructor(wss: WebSocket.Server) {
    this.wss = wss;
    wss.on("connection", onConnection);
  }

  stop() {
    this.wss.close();
  }
}
