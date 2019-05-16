import koa from "koa";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
// @ts-ignore
import { Server } from "onefx/lib/server";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";

export function setServerRoutes(server: Server): void {
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
    "(/|/address/.*|/block|/block/.*|/action|/action/.*|/wallet.*|/not-found)",
    async (ctx: koa.Context) => {
      ctx.setState("base.multiChain", server.config.multiChain);
      ctx.setState("base.webBpApiGatewayUrl", server.config.webBpApiGatewayUrl);
      ctx.setState("base.enableSignIn", server.config.enableSignIn);
      ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
        VDom: <AppContainer />,
        reducer: noopReducer,
        clientScript: "/main.js"
      });
    }
  );
}
