// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";
import isElectron from "is-electron";

export function getAntenna(): Antenna {
  const injectedWindow: Window & { antenna?: Antenna } = window;
  if (injectedWindow.antenna) {
    return injectedWindow.antenna;
  }
  const url = isElectron()
    ? "https://iotexscan.io/iotex-core-proxy"
    : "/iotex-core-proxy";
  injectedWindow.antenna = new Antenna(url);
  return injectedWindow.antenna;
}
