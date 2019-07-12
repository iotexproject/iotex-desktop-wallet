const { ipcMain } = require("electron");

let webContents;
function onConnection(ws) {
  console.log("connected");
  ws.on("message", function message(received) {
    let json = {};
    try {
      json = JSON.parse(received);
    } catch (e) {
      console.log(`failed to parse ${received}`);
      return;
    }
    if (json.reqId === undefined) {
      return;
    }
    webContents.send("sign", received);
    console.log(`signed-${json.reqId}`);
    // forward message to wallet
    // wait for wallet response
    ipcMain.on(`signed-${json.reqId}`, function(event, signed) {
      console.log("responsed from wallet", { signed });
      ws.send(signed);
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
