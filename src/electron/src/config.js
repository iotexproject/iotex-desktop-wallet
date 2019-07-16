const { app, remote } = require("electron");
const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");
const log = require("electron-log");

const userDataPath = (app || remote.app).getPath("userData");
const userConfName = resolve(userDataPath, "iotex-wallet-conf.json");
const loadConfData = function() {
  try {
    return JSON.parse(readFileSync(userConfName, { encoding: "utf8" }));
  } catch (e) {
    log.info("Load empty xconf!");
  }
  return {};
};

const confData = loadConfData();

module.exports = {
  getConf: function(name, defaultValue) {
    if (typeof confData[name] !== "undefined") {
      return confData[name];
    }
    return defaultValue;
  },
  setConf: function(name, value) {
    if (typeof name !== "string" || !name) {
      return false;
    }
    if ((typeof value).match(/undefined|function|symbol/i)) {
      return false;
    }
    confData[name] = value;
    try {
      writeFileSync(userConfName, JSON.stringify(confData));
    } catch (e) {
      log.error(e);
      return false;
    }
    return true;
  }
};
