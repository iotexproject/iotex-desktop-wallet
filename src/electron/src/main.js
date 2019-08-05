// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { session } = require("electron");
const { initSolc } = require("./solc");
const { createServer } = require("./server");
const Service = require("./service");
const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const process = require("global/process");
const console = require("global/console");

process.on("uncaughtException", function(error) {
  console.error(`failed on unknown error: ${error.stack}`);
});

const allowRequestOrigins = [
  "https://iotexscan.io",
  "https://ethereum.github.io",
  "https://testnet.iotexscan.io",
  "https://certs.get-scatter.com"
];

const allowedElectronModules = new Set(["app", "shell"]);
const allowedModules = new Set(["renderer"]);
const allowedGlobals = new Set();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let service;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, "renderer.js")
    }
  });

  // init ledger
  mainWindow.transport = TransportNodeHid;

  // start a service
  createServer(64102, function(err, server) {
    if (err) {
      log.error("failed to create wss service", err);
    } else {
      service = new Service(server, mainWindow.webContents);
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.resolve(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (service) {
      service.stop();
    }
    mainWindow = null;
  });

  mainWindow.on("reload", function() {
    mainWindow.reload();
  });

  mainWindow.once("ready-to-show", function() {
    // show mainWindow here to prevent visual flash.
    mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// refresh
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
let template = [];
if (process.platform === "darwin") {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: "About " + name,
        role: "about"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click() {
          app.quit();
        }
      }
    ]
  });
}

// Verify WebView Options Before Creation
app.on("web-contents-created", (event, contents) => {
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;
    delete webPreferences.preloadURL;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;

    // Verify URL being loaded
    const allowOrigin = allowRequestOrigins.find(origin =>
      params.src.startsWith(origin)
    );
    if (!allowOrigin) {
      event.preventDefault();
    }
  });
});

// Disable navigation
app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", e => {
    e.preventDefault();
  });
});

// Disable creating new window
app.on("web-contents-created", (_, contents) => {
  contents.on("new-window", event => {
    event.preventDefault();
  });
});

// Init solidity compiler
app.on("ready", function() {
  initSolc();
});

// check for session
app.on("ready", function() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      ...details,
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          `default-src 'self' ${allowRequestOrigins.join(" ")} `
        ]
      }
    });
  });
  session
    .fromPartition("requests")
    .setPermissionRequestHandler((webContents, permission, callback) => {
      const url = webContents.getURL();
      if (permission === "notifications") {
        // Approves the permissions request
        callback(true);
      }
      // Verify URL
      const allowOrigin = allowRequestOrigins.find(origin =>
        url.startsWith(origin)
      );
      callback(!!allowOrigin);
    });
});

app.on("remote-require", (event, webContents, moduleName) => {
  if (!allowedModules.has(moduleName)) {
    event.preventDefault();
  }
});

app.on("remote-get-builtin", (event, webContents, moduleName) => {
  if (!allowedElectronModules.has(moduleName)) {
    event.preventDefault();
  }
});

app.on("remote-get-global", (event, webContents, globalName) => {
  if (!allowedGlobals.has(globalName)) {
    event.preventDefault();
  }
});

app.on("remote-get-current-window", event => {
  event.preventDefault();
});

app.on("remote-get-current-web-contents", event => {
  event.preventDefault();
});

app.on("remote-get-guest-web-contents", event => {
  event.preventDefault();
});

// check for updates
app.on("ready", function() {
  autoUpdater.checkForUpdatesAndNotify();
});

const queryString = require("query-string");

// check for deep link
app.setAsDefaultProtocolClient("iopay");

// Protocol handler for osx
app.on("open-url", function(event, url) {
  event.preventDefault();
  const { query } = queryString.parseUrl(url);
  log.debug("deeplink url with query params: " + JSON.stringify(query));

  if (mainWindow && mainWindow.webContents) {
    return mainWindow.webContents.send("query", query);
  }

  app.on("ready", () => {
    setTimeout(() => {
      return mainWindow.webContents.send("query", query);
    }, 3000);
  });
});
