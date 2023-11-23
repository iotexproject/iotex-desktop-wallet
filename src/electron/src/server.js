const https = require("https");
const WebSocket = require("ws");
const console = require("global/console");
const fetch = require("isomorphic-unfetch");

function createServerWithCertAndKey(port, cert, key, callback) {
  const server = https.createServer({ cert, key });
  server.listen(port, "local.iotex.io");
  const namespace = new WebSocket.Server({
    server
  });
  callback(null, namespace);
}

function createServer(port, callback) {
  getCerts().then(resp => {
    createServerWithCertAndKey(port, resp.cert, resp.key, callback);
  });
}

const getCerts = async () => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  const url =
    "https://certs.iotex.io?rand=" + Math.round(Math.random() * 100 + 1);
  return fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    agent
  })
    .then(res => res.json())
    .catch(err =>
      console.error(
        "Could not fetch certs. Probably due to a proxy, vpn, or firewall." +
          err
      )
    );
};

module.exports = {
  createServer
};
