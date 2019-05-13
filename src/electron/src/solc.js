const { ipcMain } = require("electron");
const solc = require("solc");
const log = require("electron-log");
const https = require("https");
const MemoryStream = require("memorystream");

let soljsonReleases = null;
const solcRefs = {};

const fetchJson = async url => {
  return await new Promise((resolve, reject) => {
    const mem = new MemoryStream(null, { readable: false });
    https
      .get(url, function(response) {
        if (response.statusCode !== 200) {
          reject(response.statusMessage);
        } else {
          response.pipe(mem);
          response.on("end", function() {
            resolve(JSON.parse(mem.toString()));
          });
        }
      })
      .on("error", function(error) {
        reject(error);
      });
  });
};

const fetchReleaseVersions = async () => {
  if (soljsonReleases) {
    return soljsonReleases;
  }
  try {
    const { releases } = await fetchJson(
      "https://ethereum.github.io/solc-bin/bin/list.json"
    );
    soljsonReleases = releases;
  } catch (e) {
    log.error(e);
  }
  return soljsonReleases || {};
};

const loadSolc = async version => {
  if (solcRefs[version]) {
    return solcRefs[version];
  }
  const releases = await fetchReleaseVersions();

  if (!releases[version]) {
    throw new Error("wallet.cannot_find_solidity_version");
  }
  const releaseVersion = `${releases[version]}`.replace(
    /soljson\-|\.js$/gi,
    ""
  );
  return await new Promise((resolve, reject) => {
    solc.loadRemoteVersion(releaseVersion, (error, remoteSolc) => {
      if (error) {
        reject("wallet.cannot_load_solidity_version");
      } else {
        solcRefs[version] = remoteSolc;
        resolve(remoteSolc);
      }
    });
  });
};

// Prefetch release versions index.
fetchReleaseVersions();
module.exports.initSolc = async () => {
  ipcMain.on("solc", async (event, arg) => {
    if (!arg) {
      return;
    }
    const { id, source } = arg || {};
    if (!id || !source) return;
    const replyId = `solc-reply-${id}`;
    const verFound = /pragma solidity \^(.*);/.exec(source);
    if (!verFound || !verFound[1]) {
      event.reply(replyId, { error: "wallet.missing_solidity_pragma" });
      return;
    }
    try {
      const remoteSolc = await loadSolc(verFound[1]);
      const output = JSON.parse(remoteSolc.lowlevel.compileSingle(source));
      event.reply(replyId, output);
    } catch (e) {
      log.error(e);
      event.reply(replyId, { error: e.message });
    }
  });
};
