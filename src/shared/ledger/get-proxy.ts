import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
// @ts-ignore
import window from "global/window";
import { Envelop, SealedEnvelop } from "iotex-antenna/lib/action/envelop";
import { SignerPlugin } from "iotex-antenna/lib/action/method";
import isElectron from "is-electron";
import { IoTeXLedgerApp } from ".";

export interface TransportProxy {
  getPublicKey(path: Array<number>): Promise<Buffer>;
  sign(path: Array<number>, message: Uint8Array): Promise<Buffer>;
}

export class WebUSBTransportProxy implements TransportProxy {
  public async getPublicKey(path: Array<number>): Promise<Buffer> {
    const transport = await TransportWebUSB.create();
    const app = new IoTeXLedgerApp(transport);
    const result = await app.publicKey(path);
    await transport.close();
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.publicKey;
  }

  public async sign(path: Array<number>, message: Uint8Array): Promise<Buffer> {
    const transport = await TransportWebUSB.create();
    const app = new IoTeXLedgerApp(transport);
    const result = await app.sign(path, message);
    await transport.close();
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.signature;
  }
}

class TransportNodeHidProxy {
  public async getPublicKey(path: Array<number>): Promise<Buffer> {
    return window.getPublicKey(path);
  }

  public async sign(path: Array<number>, message: Uint8Array): Promise<Buffer> {
    const signature = window.sign(path, message);
    return Buffer.from(signature, "hex");
  }
}

export async function getTransportProxy(): Promise<TransportProxy> {
  if (isElectron()) {
    return new TransportNodeHidProxy();
  } else {
    return new WebUSBTransportProxy();
  }
}

export class LedgerPlugin implements SignerPlugin {
  private readonly path: Array<number>;
  private readonly publicKey: Buffer;
  private readonly proxy: TransportProxy;

  constructor(path: Array<number>, publicKey: Buffer, proxy: TransportProxy) {
    this.path = path;
    this.publicKey = publicKey;
    this.proxy = proxy;
  }

  public async signOnly(envelop: Envelop): Promise<SealedEnvelop> {
    const signed = await this.proxy.sign(this.path, envelop.bytestream());
    return new SealedEnvelop(
      envelop,
      Buffer.from(this.publicKey),
      Buffer.from(signed)
    );
  }
}

window.getTransportProxy = getTransportProxy;
