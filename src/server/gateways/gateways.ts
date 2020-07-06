import RpcMethod from "iotex-antenna/lib/rpc-method/node-rpc-method";
import mongoose from "mongoose";
// @ts-ignore
import { MyServer } from "../start-server";
import { analytics } from "./analytics";
import { fetchCoinPrice } from "./coin-market-cap";
import { getSendgrid } from "./get-sendgrid";

export function setGateways(server: MyServer): void {
  server.gateways = server.gateways || {};

  if (
    // @ts-ignore
    !(server.config.gateways.mongoose && server.config.gateways.mongoose.uri)
  ) {
    server.logger.warn(
      "cannot start server without gateways.mongoose.uri provided in configuration"
    );
  } else {
    // @ts-ignore
    mongoose.connect(server.config.gateways.mongoose.uri).catch(err => {
      server.logger.warn(`failed to connect mongoose: ${err}`);
    });
  }
  // @ts-ignore
  server.gateways.mongoose = mongoose;

  const gateways = server.config.gateways;
  server.gateways.antenna = new RpcMethod(gateways.iotexAntenna);
  server.gateways.coinmarketcap = { fetchCoinPrice };
  server.gateways.analytics = analytics;
  server.gateways.sendgrid = getSendgrid(gateways.sendgrid);
}
