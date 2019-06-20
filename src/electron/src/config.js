const { app, remote } = require("electron");
const { resolve } = require("path");
const pem = require("pem");
const log = require("electron-log");

const userDataPath = (app || remote.app).getPath("userData");
const userConfName = resolve(userDataPath, "iotex-wallet-conf.json");
loadConfData = function() {
  let confData;
  try {
    confData = JSON.parse(readFileSync(userConfName, { encoding: "utf8" }));
  } catch (e) {
    log.info("Load empty xconf!");
  }
  if (typeof confData["cert/key"] === "undefined") {
    pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
      if (err) {
        log.error("failed to create certificate", err);
      } else {
        confData["cert/key"] = JSON.stringify(keys);
        try {
          writeFileSync(userConfName, JSON.stringify(confData));
        } catch (e) {
          log.error("failed to update userData", e);
        }
      }
    });
  }
  return confData;
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
