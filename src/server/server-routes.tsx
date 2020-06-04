import koa from "koa";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
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
