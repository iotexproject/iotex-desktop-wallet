// @ts-ignore
import { Server } from "onefx/lib/server";
// @ts-ignore
import { RpcMethod } from "iotex-antenna/lib/rpc-method/node-rpc-method";

export function setGateways(server: Server): void {
  server.gateways = server.gateways || {};
  server.gateways.antenna = new RpcMethod(server.config.gateways.antenna);
}
