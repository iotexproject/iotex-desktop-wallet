const http = require("http");
const pem = require("pem");
const WebSocket = require("ws");
const console = require("global/console");
const { getConf, setConf } = require("./config");

function createServerWithCertAndKey(port, cert, key, callback) {
  const server = http.createServer();
  server.listen(port);
  callback(null, new WebSocket.Server({ server }));
}

function createServer(port, callback) {
  const caStr = getConf("cert/key");
  let key;
  let cert;
  if (typeof caStr !== "undefined") {
    try {
      const ca = JSON.parse(caStr);
      key = ca.serviceKey;
      cert = ca.certificate;
      createServerWithCertAndKey(port, cert, key, callback);
    } catch (err) {
      console.error("failed to decode certificate");
    }
  }
  if (!cert || !key) {
    pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
      if (err) {
        console.error("failed to create certificate", err);
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
