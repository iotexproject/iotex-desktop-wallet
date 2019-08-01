// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";
import { WsSignerPlugin } from "iotex-antenna/lib/plugin/ws";
import isElectron from "is-electron";

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
      signer: new WsSignerPlugin("ws://localhost:64102/")
    });
  }

  return injectedWindow.antenna;
}
