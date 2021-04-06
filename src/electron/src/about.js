const { join } = require("path");
const { readFileSync } = require("fs");
const { rootPath } = require("electron-root-path");
const { ipcRenderer } = require("electron");

let _pkginfo = {};

ipcRenderer.on("process_env", (event, message) => {
  if (message.NODE_ENV !== "development") {
    _pkginfo = {
      version: message.npm_package_version,
      author: message.npm_package_author_name
    };
  } else {
    _pkginfo = JSON.parse(
      readFileSync(join(rootPath, "package.json"), { encoding: "utf8" })
    );
  }
  const appVersion = _pkginfo.version;
  const copyRight = `Copyright © ${new Date().getFullYear()} ${
    _pkginfo.author
  }`;
  document.getElementById(
    "version"
  ).innerHTML = `Version ${appVersion} (${appVersion})`;
  document.getElementById("copyright").innerHTML = copyRight;
});
