import Transport from "@ledgerhq/hw-transport";
// @ts-ignore
import window from "global/window";
import isElectron from "is-electron";

export async function getTransport(): Promise<Transport> {
  if (isElectron()) {
    const TransportNodeHid = await import("@ledgerhq/hw-transport-node-hid");
    return TransportNodeHid.default.create();
  } else {
    const TransportWebUSB = await import("@ledgerhq/hw-transport-webusb");
    return TransportWebUSB.default.create();
  }
}

window.getTransport = getTransport;
