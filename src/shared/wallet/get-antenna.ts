// @ts-ignore
import window from "global/window";
import Antenna from "iotex-antenna";
import { Account } from "iotex-antenna/lib/account/account";
import { Envelop, SealedEnvelop } from "iotex-antenna/lib/action/envelop";
import { SignerPlugin } from "iotex-antenna/lib/action/method";
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

export function getAntenna(): Antenna {
  const injectedWindow: Window & { antenna?: Antenna } = window;
  if (injectedWindow.antenna) {
    return injectedWindow.antenna;
  }
  const url = isElectron()
    ? "https://iotexscan.io/iotex-core-proxy"
    : "/iotex-core-proxy";
  // @ts-ignore
  injectedWindow.signerPlugin = new LedgerSigner();
  injectedWindow.antenna = new Antenna(url, {
    // @ts-ignore
    signer: injectedWindow.signerPlugin
  });
  return injectedWindow.antenna;
}
