// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { shell, remote } = require("electron");
const { getConf, setConf } = require("./config");
const window = require("global/window");
const { ipcRenderer } = require("electron");
const isDev = require("electron-is-dev");
const document = require("global/document");
const console = require("global/console");
const uuidv4 = require("uuid/v4");
const ua = require("universal-analytics");
const { timeout: promiseTimeout } = require("promise-timeout");

let globalState = process.env.GLOBAL_STATE || {};
if (isDev) {
  globalState = require("../global-state");
}

const uuid = getConf("uuid", uuidv4());
const trackingId =
  (globalState &&
    globalState.state &&
    globalState.state.base.analytics &&
    globalState.state.base.analytics.googleTidApp) ||
  "UA-111756489-15";

// Global instance of google universal analytics.
window.gua = ua(trackingId, uuid);

window.getAppInfo = function() {
  const appVersion = remote.app.getVersion();
  return {
    appVersion
  };
};

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

window.getPublicKey = async function(path) {
  await ipcRenderer.send("getPublicKey", path);

  const result = await promiseTimeout(
    new Promise(resolve => {
      ipcRenderer.on("getPublicKey-response", (event, query) => {
        resolve(query);
      });
    }),
    6000
  );
  if (result.code && result.code !== 0x9000) {
    throw new Error(result.message);
  }
  if (result.error_message) {
    throw new Error(result.error_message);
  }
  return result.publicKey;
};

window.sign = function(path, message) {
  const result = ipcRenderer.sendSync("sign", path, message);
  if (result.code !== 0x9000) {
    throw new Error(result.message);
  }
  return result.signature.toString("hex");
};

window.signMessage = function(path, message) {
  const result = ipcRenderer.sendSync("signMessage", path, message);
  if (result.code !== 0x9000) {
    throw new Error(result.message);
  }
  return result.signature.toString("hex");
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
});

ipcRenderer.on("GET_ACCOUNTS", function(event, payload) {
  const accounts = window.getAntenna().iotx.accounts;
  let filtered = [];
  if (accounts && accounts[0]) {
    const { address } = accounts[0];
    filtered = [{ address }];
  }
  try {
    const reqId = JSON.parse(payload).reqId;
    const response = JSON.stringify({ reqId, accounts: filtered });
    ipcRenderer.send(`signed-${reqId}`, response);
  } catch (err) {
    console.warn(`Error: ${err}, error in parse to JSON`);
  }
});
