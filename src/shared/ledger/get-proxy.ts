// @ts-ignore
import window from "global/window";
import isElectron from "is-electron";
import { IoTeXApp } from ".";

export interface TransportProxy {
  getPublicKey(path: Array<number>): Promise<Buffer>;
  sign(path: Array<number>, message: Buffer): Promise<Buffer>;
}

export class WebUSBTransportProxy implements TransportProxy {
  public async getPublicKey(path: Array<number>): Promise<Buffer> {
    const TransportWebUSB = await import("@ledgerhq/hw-transport-webusb");
    const transport = await TransportWebUSB.default.create();
    const app = new IoTeXApp(transport);
    const result = await app.publicKey(path);
    await transport.close();
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.publicKey;
  }

  public async sign(path: Array<number>, message: Buffer): Promise<Buffer> {
    const TransportWebUSB = await import("@ledgerhq/hw-transport-webusb");
    const transport = await TransportWebUSB.default.create();
    const app = new IoTeXApp(transport);
    const result = await app.sign(path, message);
    await transport.close();
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.publicKey;
  }
}

class TransportNodeHidProxy {
  public async getPublicKey(path: Array<number>): Promise<Buffer> {
    const { ipcRenderer } = await import("electron");
    const result = ipcRenderer.sendSync("getPublicKey", path);
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.publicKey;
  }

  public async sign(path: Array<number>, message: Buffer): Promise<Buffer> {
    // TODO
    return message;
  }
}

export async function getTransportProxy(): Promise<TransportProxy> {
  if (isElectron()) {
    return new TransportNodeHidProxy();
  } else {
    return new WebUSBTransportProxy();
  }
}

window.getTransportProxy = getTransportProxy;
