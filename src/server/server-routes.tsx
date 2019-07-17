import koa from "koa";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";
// @ts-ignore
import { MyServer } from "./start-server";

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
    "(/|/address/.*|/block|/block/.*|/action|/action/.*|/wallet.*|/not-found|/.*)",
    async (ctx: koa.Context) => {
      ctx.setState("base.bidContractAddress", server.config.bidContractAddress);
      ctx.setState("base.vitaTokens", server.config.vitaTokens);
      ctx.setState("base.multiChain", server.config.multiChain);
      ctx.setState("base.defaultERC20Tokens", server.config.defaultERC20Tokens);
      ctx.setState("base.webBpApiGatewayUrl", server.config.webBpApiGatewayUrl);
      ctx.setState(
        "base.analyticsApiGatewayUrl",
        server.config.analyticsApiGatewayUrl
      );
      ctx.setState("base.enableSignIn", server.config.enableSignIn);
      ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
        VDom: <AppContainer />,
        reducer: noopReducer,
        clientScript: "/main.js"
      });
    }
  );
}
