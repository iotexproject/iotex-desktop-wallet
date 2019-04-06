// @ts-ignore
import { Server } from "onefx/lib/server";
import { setIoTexCoreProxy } from "./iotex-core-proxy-middleware";
import { manifestMiddleware } from "./manifest-middleware";

export function setMiddleware(server: Server): void {
  server.use(manifestMiddleware(server));
  setIoTexCoreProxy(server);
}
