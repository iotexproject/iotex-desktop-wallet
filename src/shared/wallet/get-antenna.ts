// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";

export function getAntenna(): Antenna {
  const injectedWindow: Window & { antenna?: Antenna } = window;
  if (injectedWindow.antenna) {
    return injectedWindow.antenna;
  }
  injectedWindow.antenna = new Antenna("/iotex-core-proxy");
  return injectedWindow.antenna;
}
