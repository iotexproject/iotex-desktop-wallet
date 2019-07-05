// tslint:disable:no-http-string
// @ts-ignore
// @ts-ignore
import { logger } from "onefx/lib/integrated-gateways/logger";
import { MyServer } from "../start-server";

export function setIoTexCoreProxy(server: MyServer): void {
  const proxy = require("koa-server-http-proxy");
  let target = server.config.gateways.iotexAntenna;
  if (target) {
    target = target.indexOf("http") === -1 ? `http://${target}` : target;
    server.use(
      proxy("/iotex-core-proxy/", {
        target,
        pathRewrite: { "^/iotex-core-proxy/*": "/" },
        changeOrigin: true
      })
    );
  }
}
