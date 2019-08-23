// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";
import { Account } from "iotex-antenna/lib/account/account";
import { Envelop, SealedEnvelop } from "iotex-antenna/lib/action/envelop";
import { SignerPlugin } from "iotex-antenna/lib/action/method";
import { WsSignerPlugin } from "iotex-antenna/lib/plugin/ws";
import isElectron from "is-electron";
// @ts-ignore
import { IoTeXApp } from "../../ledger/iotex";

class LedgerSigner implements SignerPlugin {
  public publicKey: Buffer;
  public address: string;

  public async signOnly(envelop: Envelop): Promise<SealedEnvelop> {
    const transport = await window.transport.create();
    transport.setDebugMode(true);
    const app = new IoTeXApp(transport);
    const signed = await app.sign([44, 304, 0, 0, 0], envelop.bytestream());
    await transport.close();
    return new SealedEnvelop(envelop, this.publicKey, signed.signature);
  }

  public async getAccount(address: string): Promise<Account> {
    const acct = new Account();
    acct.address = address;
    return acct;
  }
}

export const SignerPlugins: {
  ws?: WsSignerPlugin;
  ledger?: LedgerSigner;
  default?: undefined;
} = {};

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
    injectedWindow.antenna = new Antenna("/iotex-core-proxy", {});
  }
  return injectedWindow.antenna;
}

export function setSignerType(
  type: "ws" | "ledger" | "default" = "default"
): void {
  switch (type) {
    case "ws":
      if (!SignerPlugins.ws) {
        SignerPlugins.ws = new WsSignerPlugin(
          "wss://local.get-scatter.com:64102/"
        );
      }
      break;
    case "ledger":
      if (!SignerPlugins.ledger) {
        SignerPlugins.ledger = new LedgerSigner();
      }
      break;
    default:
  }
  getAntenna().iotx.signer = SignerPlugins[type] || undefined;
}
