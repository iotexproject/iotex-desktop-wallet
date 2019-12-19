import koa from "koa";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";
import { setEmailPasswordIdentityProviderRoutes } from "../shared/one-fix-auth-provider/email-password-identity-provider/email-password-identity-provider-handler";
// @ts-ignore
import { MyServer } from "./start-server";

function addDynamicPath(
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
  setEmailPasswordIdentityProviderRoutes(server);

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
      ctx.setState("base.bidContractAddress", server.config.bidContractAddress);
      ctx.setState("base.vitaTokens", server.config.vitaTokens);
      ctx.setState("base.multiChain", server.config.multiChain);
      ctx.setState(
        "base.chainArray",
        addDynamicPath(
          server.config.multiChain as {
            chains: Array<{ name: string; url: string }>;
            current: string;
          },
          ctx.path
        )
      );
      ctx.setState("base.defaultERC20Tokens", server.config.defaultERC20Tokens);
      ctx.setState("base.webBpApiGatewayUrl", server.config.webBpApiGatewayUrl);
      ctx.setState(
        "base.analyticsApiGatewayUrl",
        server.config.analyticsApiGatewayUrl
      );
      ctx.setState("base.enableSignIn", server.config.enableSignIn);
      ctx.setState("base.isEnterprise", server.config.isEnterprise);
      ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
        VDom: <AppContainer />,
        reducer: noopReducer,
        clientScript: "/main.js"
      });
    }
  );
}
