import koa from "koa";
import send from "koa-send";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import * as path from "path";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";
import { setConfigs } from "./set-configs";
// @ts-ignore
import { MyServer } from "./start-server";

export function addDynamicPath(
  chainObject: {
    chains: Array<{ name: string; url: string }>;
    current: string;
  },
  path: string
): Array<{ name: string; url: string }> {
  return chainObject.chains.map(item => {
    return {
      url: item.url + path.slice(1),
      name: item.name
    };
  });
}

export function setServerRoutes(server: MyServer): void {
  // Health checks
  server.get("health", "/health", (ctx: koa.Context) => {
    ctx.body = "OK";
  });

  // Iotex Token Image
  server.get("token-image", "/image/token/*", async (ctx: koa.Context) => {
    await send(
      ctx,
      path.resolve(
        __dirname,
        `/node_modules/iotex-token-metadata/images${ctx.path.replace(
          "/image/token",
          ""
        )}`
      )
    );
  });

  setApiGateway(server);

  server.get("delegate-details", "/delegate/:id", (ctx: koa.Context) => {
    ctx.redirect(
      `https://member.iotex.io/delegate/${ctx.params.id}/?utm_source=iotexscan`
    );
  });

  server.get(
    "SPA",
    // @ts-ignore
    /^(?!\/?api-gateway\/).+$/,
    async (ctx: koa.Context) => {
      setConfigs(server, ctx);
      ctx.body = await apolloSSR(ctx, {
        VDom: <AppContainer />,
        reducer: noopReducer,
        clientScript: "/main.js"
      });
    }
  );
}
