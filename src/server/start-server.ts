import config from "config";
// @ts-ignore
import { Server } from "onefx/lib/server";
import { setModel } from "../model";
import { setGateways } from "./gateways/gateway";
import { setMiddleware } from "./middleware";
import { setServerRoutes } from "./server-routes";

export async function startServer(): Promise<void> {
  const server = new Server(config);
  setGateways(server);
  setMiddleware(server);
  setModel(server);
  setServerRoutes(server);

  const port = process.env.PORT || config.get("server.port");
  server.listen(port);
  return server;
}
