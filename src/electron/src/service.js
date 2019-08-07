const { ipcMain } = require("electron");
const console = require("global/console");

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

    if (json.type === "GET_ACCOUNTS") {
      webContents.send("GET_ACCOUNTS", received);
    } else {
      webContents.send("sign", received);
    }

    console.log(`[sign-${json.reqId}]: send to wallet`);
    // forward message to wallet
    // wait for wallet response
    ipcMain.on(`signed-${json.reqId}`, function(event, respMessage) {
      console.log(`[sign-${json.reqId}]: response from wallet`, {
        respMessage
      });
      ws.send(respMessage);
    });
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
    this.wss._server.close();
    this.wss.close();
    console.log("service destroyed");
  }
};
