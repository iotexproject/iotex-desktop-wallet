const { join } = require("path");
const { readFileSync } = require("fs");
const { rootPath } = require("electron-root-path");
const { ipcRenderer } = require("electron");

let _pkginfo = {};

ipcRenderer.on("process_env", (event, message) => {
  if (message.NODE_ENV !== "development") {
    _pkginfo = {
      version: message.version,
      copyRight: message.copyRight,
      author: message.author
    };
  } else {
    _pkginfo = JSON.parse(
      readFileSync(join(rootPath, "package.json"), { encoding: "utf8" })
    );
  }
  const appVersion = _pkginfo.version;
  const copyRight = _pkginfo.author || _pkginfo.copyRight || "";
  document.getElementById(
    "version"
  ).innerHTML = `Version ${appVersion} (${appVersion})`;
  document.getElementById("copyright").innerHTML = copyRight;
});
