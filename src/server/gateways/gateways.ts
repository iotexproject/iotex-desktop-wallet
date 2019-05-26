import RpcMethod from "iotex-antenna/lib/rpc-method/node-rpc-method";
// @ts-ignore
import { Server } from "onefx/lib/server";

import { fetchCoinPrice } from "./coin-market-cap";
import { getSendgrid } from "./get-sendgrid";

export function setGateways(server: Server): void {
  server.gateways = server.gateways || {};
  const gateways = server.config.gateways;

  server.gateways.antenna = new RpcMethod(gateways.iotexAntenna);
  server.gateways.coinmarketcap = { fetchCoinPrice };
  server.gateways.sendgrid = getSendgrid(gateways.sendgrid);
}
