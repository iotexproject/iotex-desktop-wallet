// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";
import { SignerPlugin } from "iotex-antenna/lib/action/method";
import { WsSignerPlugin } from "iotex-antenna/lib/plugin/ws";
import isElectron from "is-electron";

// TODO: enable USE_WS_SIGNER to active the WsSignerPlugin
const USE_WS_SIGNER = false;

export function getAntenna(initial?: boolean, signer?: SignerPlugin): Antenna {
  const injectedWindow: Window & { antenna?: Antenna } = window;
  if (injectedWindow.antenna && !initial) {
    return injectedWindow.antenna;
  }
  if (isElectron()) {
    injectedWindow.antenna = new Antenna(
      "https://iotexscan.io/iotex-core-proxy",
      { signer: signer }
    );
  } else {
    injectedWindow.antenna = new Antenna("/iotex-core-proxy", {
      ...(USE_WS_SIGNER
        ? {
            signer: signer || new WsSignerPlugin()
          }
        : {})
    });
  }

  return injectedWindow.antenna;
}

window.getAntenna = getAntenna;
