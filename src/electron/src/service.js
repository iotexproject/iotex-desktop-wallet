const { ipcMain } = require("electron");

let sigID = 0;
let webContents;
function onConnection(ws) {
  console.log("connected");
  ws.on("message", function message(data) {
    const id = sigID++;
    data = data.trim();
    console.log("received: %s", data);
    webContents.send("sign", JSON.stringify({ id, content: data }));
    // forward message to wallet
    // wait for wallet response
    ipcMain.on(`signed-${id}`, function(event, signedMessage) {
      console.log("responsed from wallet", { signedMessage });
      ws.send(signedMessage);
    });
    // TODO: base on data, handle request
  });
}

module.exports = class Service {
  constructor(_wss, _webContents) {
    this.wss = _wss;
    webContents = _webContents;
    console.log("service created");
    this.wss.on("connection", onConnection);
  }

  stop() {
    this.wss.close();
  }
};
