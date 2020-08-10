import koa from "koa";
import { addDynamicPath } from "./server-routes";
import { MyServer } from "./start-server";

export function setConfigs(server: MyServer, ctx: koa.Context): void {
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
  ctx.setState("siteVersion", server.config.siteVersion);
}
