// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";
import { WsSignerPlugin } from "iotex-antenna/lib/plugin/ws";
import isElectron from "is-electron";

// TODO: enable USE_WS_SIGNER to active the WsSignerPlugin
const USE_WS_SIGNER = false;

export function getAntenna(): Antenna {
  const injectedWindow: Window & { antenna?: Antenna } = window;
  if (injectedWindow.antenna) {
    return injectedWindow.antenna;
  }
  if (isElectron()) {
    injectedWindow.antenna = new Antenna(
      "https://iotexscan.io/iotex-core-proxy"
    );
  } else {
    injectedWindow.antenna = new Antenna("/iotex-core-proxy", {
      ...(USE_WS_SIGNER
        ? {
            signer: new WsSignerPlugin("ws://localhost:64102/")
          }
        : {})
    });
  }

  return injectedWindow.antenna;
}
