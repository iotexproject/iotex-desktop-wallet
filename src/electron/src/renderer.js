// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { shell, app, remote } = require("electron");
const { resolve } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const win = require("global/window");
const log = require("electron-log");
const { ipcRenderer } = require("electron");
const isDev = require("electron-is-dev");

win.xopen = function(url, frameName, features) {
  shell.openExternal(url);
};

// The xconf is used to store user configurations with electron.
// Config's value should be able to store under JSON string.
win.xconf = new (function() {
  const userDataPath = (app || remote.app).getPath("userData");
  const userConfName = resolve(userDataPath, "iotex-wallet-conf.json");
  let confData = {};
  try {
    confData = JSON.parse(readFileSync(userConfName, { encoding: "utf8" }));
  } catch (e) {
    log.info("Load empty xconf!");
  }

  const getConf = function(name, defaultValue) {
    if (typeof confData[name] !== "undefined") {
      return confData[name];
    }
    return defaultValue;
  };

  const setConf = function(name, value) {
    if (typeof name !== "string" || !name) {
      return false;
    }
    if ((typeof value).match(/undefined|function|symbol/i)) {
      return false;
    }
    try {
      confData[name] = value;
      writeFileSync(userConfName, JSON.stringify(confData));
    } catch (e) {
      log.error(e);
      return false;
    }
    return true;
  };

  return {
    getConf,
    setConf
  };
})();

let solcID = 1;
win.solidityCompile = function(source, callback) {
  const arg = {
    id: solcID++,
    source
  };
  ipcRenderer.once(`solc-reply-${arg.id}`, (_, arg) => callback(arg));
  ipcRenderer.send("solc", arg);
};

win.document.addEventListener("DOMContentLoaded", () => {
  require("../../../dist/memory-main.js");
  if (isDev) {
    ["../../../dist/stylesheets/main.css", "../../../dist/antd.css"].forEach(
      it => {
        const link = win.document.createElement("link");
        link.rel = "stylesheet";
        link.href = it;
        win.document.getElementsByTagName("head")[0].appendChild(link);
      }
    );
  }
});

ipcRenderer.on("query", function(event, store) {
  win.query = store;
});
