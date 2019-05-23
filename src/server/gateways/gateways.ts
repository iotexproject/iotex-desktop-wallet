import RpcMethod from "iotex-antenna/lib/rpc-method/node-rpc-method";
// @ts-ignore
import { Server } from "onefx/lib/server";

import { addSubscription } from "./add-subscription";
import { fetchCoinPrice } from "./coin-market-cap";

export function setGateways(server: Server): void {
  server.gateways = server.gateways || {};
  server.gateways.antenna = new RpcMethod(server.config.gateways.iotexAntenna);
  server.gateways.coinmarketcap = { fetchCoinPrice };
  server.gateways.sendGrid = { addSubscription };
}
