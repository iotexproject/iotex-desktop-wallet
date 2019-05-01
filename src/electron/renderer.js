// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { shell } = require("electron");
require("global/window").xopen = function(url, frameName, features) {
  shell.openExternal(url);
};
require("../../dist/memory-main.js");
