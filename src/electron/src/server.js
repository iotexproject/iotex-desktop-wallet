const fs = require("fs");
const https = require("https");
const pem = require("pem");
const WebSocket = require("ws");
const { getConf, setConf } = require("./config");

function createServerWithCertAndKey(port, cert, key, callback) {
  const server = https.createServer({ cert, key });
  server.listen(port);
  callback(null, new WebSocket.Server({ server }));
}

function createServer(port, callback) {
  const caStr = getConf("cert/key");
  if (typeof caStr !== "undefined") {
    try {
      const ca = JSON.parse(caStr);
      key = ca.serviceKey;
      cert = ca.certificate;
      createServerWithCertAndKey(port, cert, key, callback);
    } catch (err) {
      log.error("failed to decode certificate");
    }
  }
  if (typeof cert === "undefined" || typeof key === "undefined") {
    pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
      if (err) {
        log.error("failed to create certificate", err);
        callback(err, null);
      } else {
        cert = keys.certificate;
        key = keys.serviceKey;
        setConf("cert", cert);
        setConf("key", key);
        createServerWithCertAndKey(port, cert, key, callback);
      }
    });
  }
}

module.exports = {
  createServer
};
