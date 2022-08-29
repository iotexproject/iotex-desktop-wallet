// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";
import { SignerPlugin } from "iotex-antenna/lib/action/method";
import { WsSignerPlugin } from "iotex-antenna/lib/plugin/ws";
import isElectron from "is-electron";
import { setCurrentProviderNetwork } from "./chain-network-switch";

// TODO: enable USE_WS_SIGNER to active the WsSignerPlugin
const USE_WS_SIGNER = false;

export const IOTEX_MAIN_CHAIN_ID = 1;
export const IOTEX_TEST_CHAIN_ID = 2;

export function getAntenna(initial?: boolean, signer?: SignerPlugin): Antenna {
  const injectedWindow: Window & { antenna?: Antenna } = window;
  if (injectedWindow.antenna && !initial) {
    return injectedWindow.antenna;
  }
  if (isElectron()) {
    injectedWindow.antenna = new Antenna("https://api.mainnet.iotex.one:443", IOTEX_MAIN_CHAIN_ID,{
      signer: signer
    });
  } else {
    injectedWindow.antenna = new Antenna("https://api.mainnet.iotex.one:443", IOTEX_MAIN_CHAIN_ID,{
      ...(USE_WS_SIGNER
        ? {
            signer: signer || new WsSignerPlugin()
          }
        : {})
    });
  }

  setCurrentProviderNetwork();

  return injectedWindow.antenna;
}

window.getAntenna = getAntenna;
