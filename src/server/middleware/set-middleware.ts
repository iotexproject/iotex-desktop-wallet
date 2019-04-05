// @ts-ignore
import { Server } from "onefx/lib/server";
import { manifestMiddleware } from "./manifest-middleware";
import { setIoTexCoreProxy } from "./iotex-core-proxy-middleware";

export function setMiddleware(server: Server): void {
  server.use(manifestMiddleware(server));
  setIoTexCoreProxy(server);
}
