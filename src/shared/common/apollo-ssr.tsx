import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import config from "config";
import fetch from "isomorphic-unfetch";
import koa from "koa";
// @ts-ignore
import { initAssetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { logger } from "onefx/lib/integrated-gateways/logger";
// @ts-ignore
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
// @ts-ignore
import { RootServer } from "onefx/lib/iso-react-render/root/root-server";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { getDataFromTree } from "react-apollo";
// @ts-ignore
import * as engine from "styletron-engine-atomic";
import { IWalletState } from "../wallet/wallet-reducer";
import { analyticsClient, webBpApolloClient } from "./apollo-client";
const ROUTE_PREFIX = config.get("server.routePrefix") || "";

type Opts = {
  VDom: JSX.Element;
  reducer: Function;
  clientScript: string;
};

export async function apolloSSR(
  ctx: koa.Context,
  { VDom, reducer, clientScript }: Opts
): Promise<string> {
  ctx.setState(
    "base.apiGatewayUrl",
    `${ctx.origin}${ROUTE_PREFIX}/api-gateway/`
  );

  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `http://localhost:${config.get(
        "server.port"
      )}${ROUTE_PREFIX}/api-gateway/`,
      fetch,
      credentials: "same-origin",
      headers: {
        cookie: ctx.get("Cookie")
      }
    }),
    cache: new InMemoryCache()
  });

  const state = ctx.getState();
  initAssetURL(state.base.manifest);
  const store = configureStore(state, noopReducer);
  const styletron = new engine.Server({ prefix: "_" });

  const context = {};

  const walletState: IWalletState = {
    customRPCs: [],
    tokens: {},
    defaultNetworkTokens: []
  };

  try {
    await getDataFromTree(
      <RootServer
        store={store}
        location={ctx.url}
        context={context}
        routePrefix={state.base.routePrefix}
        styletron={styletron}
      >
        <ApolloProvider client={apolloClient}>{VDom}</ApolloProvider>
      </RootServer>
    );
  } catch (e) {
    logger.error(`failed to hydrate apollo SSR: ${e} ${e.stack}`);
  }
  try {
    const apolloState = apolloClient.extract();
    ctx.setState("apolloState", apolloState);
  } catch (e) {
    logger.debug(`soft-failed to hydrate apolloState`);
  }
  try {
    ctx.setState("apolloAnalyticsState", analyticsClient.extract());
  } catch (e) {
    logger.debug(`soft-failed to hydrate apolloAnalyticsState`);
  }
  try {
    ctx.setState("webBpApolloState", webBpApolloClient.extract());
  } catch (e) {
    logger.debug(`soft-failed to hydrate webBpApolloState`);
  }
  ctx.setState("wallet", walletState);

  return ctx.isoReactRender({
    VDom: <ApolloProvider client={apolloClient}>{VDom}</ApolloProvider>,
    clientScript,
    reducer
  });
}
