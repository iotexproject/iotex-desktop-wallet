// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { shell } = require("electron");
const { getConf, setConf } = require("./config");
const window = require("global/window");
const { ipcRenderer } = require("electron");
const isDev = require("electron-is-dev");
const document = require("global/document");
const console = require("global/console");

let globalState = process.env.GLOBAL_STATE || {};
if (isDev) {
  globalState = require("../global-state");
}

window.xopen = function(url) {
  shell.openExternal(url);
};

// The xconf is used to store user configurations with electron.
// Config's value should be able to store under JSON string.
window.xconf = new (function() {
  return {
    getConf,
    setConf
  };
})();

let solcID = 1;
window.solidityCompile = function(source, callback) {
  const arg = {
    id: solcID++,
    source
  };
  ipcRenderer.once(`solc-reply-${arg.id}`, (_, arg) => callback(arg));
  ipcRenderer.send("solc", arg);
};

window.document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("json-globals").innerText = JSON.stringify(
    globalState
  );
  require("../../../dist/memory-main.js");
  if (isDev) {
    ["../../../dist/stylesheets/main.css", "../../../dist/antd.css"].forEach(
      it => {
        const link = window.document.createElement("link");
        link.rel = "stylesheet";
        link.href = it;
        window.document.getElementsByTagName("head")[0].appendChild(link);
      }
    );
  }
});

window.signed = function(id, response) {
  ipcRenderer.send(`signed-${id}`, response);
};

ipcRenderer.on("query", function(event, query) {
  const actionEvent = {
    type: "QUERY_PARAMS",
    payload: { ...query, queryNonce: Math.random() }
  };
  console.log("dispatching ", JSON.stringify(actionEvent));
  window.dispatch(actionEvent);
});

ipcRenderer.on("sign", function(event, payload) {
  const actionEvent = {
    type: "SIGN_PARAMS",
    payload: JSON.parse(payload)
  };
  // trigger confirm modal popup : sign-and-send-envelop-modal;
  console.log("dispatching", JSON.stringify(actionEvent));
  window.dispatch(actionEvent);
  window.dispatch({
    type: "OPEN_MODAL_GATE"
  });
});

ipcRenderer.on("GET_ACCOUNTS", function(event, payload) {
  const accts = window.getAntenna().iotx.accounts;
  const address = accts.wallet.accounts.entries().next().value[0];
  const reqId = JSON.parse(payload).reqId;
  const response = JSON.stringify({ reqId, accounts: [{ address }] });
  ipcRenderer.send(`signed-${reqId}`, response);
});

ipcRenderer.on("origin", function(_, payload) {
  const info = JSON.parse(payload);

  const actionEvent = {
    type: "SET_ORIGIN",
    payload: info
  };

  window.dispatch(actionEvent);
});
