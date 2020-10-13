const { ipcMain } = require("electron");
const console = require("global/console");

let webContents;
let mainWindow;

function onConnection(ws) {
  console.log("connected");
  ws.on("message", function message(received) {
    if (
      received instanceof Error ||
      Object.prototype.toString.call(received) === "[object Error]"
    ) {
      return;
    }
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
      mainWindow.show();
      mainWindow.moveTop();
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
  constructor(_wss, _mainWindow) {
    this.wss = _wss;
    mainWindow = _mainWindow;
    webContents = _mainWindow.webContents;
    console.log("service created");
    this.wss.on("connection", onConnection);
  }

  stop() {
    this.wss._server.close();
    this.wss.close();
    console.log("service destroyed");
  }
};
