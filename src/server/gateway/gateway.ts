// @ts-ignore
import RpcMethod from "iotex-antenna/lib/rpc-method/node-rpc-method";
// @ts-ignore
import { Server } from "onefx/lib/server";

export function setGateways(server: Server): void {
  server.gateways = server.gateways || {};
  server.gateways.antenna = new RpcMethod(server.config.gateways.iotexAntenna);
}
