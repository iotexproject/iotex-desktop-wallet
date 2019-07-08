// @ts-ignore
import { MyServer } from "../start-server";
import { setIoTexCoreProxy } from "./iotex-core-proxy-middleware";
import { manifestMiddleware } from "./manifest-middleware";

export function setMiddleware(server: MyServer): void {
  server.use(manifestMiddleware(server));
  setIoTexCoreProxy(server);
}
