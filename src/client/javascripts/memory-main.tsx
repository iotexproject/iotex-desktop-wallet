import { initAssetURL } from "onefx/lib/asset-url";
import { initClientI18n } from "onefx/lib/iso-i18n";
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import { combineReducers, Reducer } from "redux";
// @ts-ignore
import JSONGlobals from "safe-json-globals/get";
// @ts-ignore
import { Client as StyletronClient } from "styletron-engine-atomic";
import { apolloClient } from "../../shared/common/apollo-client";
import { RootMemory } from "../../shared/common/root-memory";
import "../../shared/common/setup-big-number";
import { getAntenna } from "../../shared/wallet/get-antenna";
import { Wallet } from "../../shared/wallet/wallet";
import {
  queryParamsReducer,
  signParamsReducer,
  walletReducer
} from "../../shared/wallet/wallet-reducer";

export const STYLETRON_GLOBAL = "styletron-global";

type Opts = {
  reducer: Reducer;
  VDom: JSX.Element;
};

getAntenna();

export function memoryReactRender({ reducer = noopReducer, VDom }: Opts): void {
  const store = configureStore(JSONGlobals("state"), reducer);
  const { translations, manifest } = store.getState().base;

  initClientI18n(translations);
  initAssetURL(manifest);
  const stylesheets = document.getElementsByClassName(STYLETRON_GLOBAL);
  const styletron = new StyletronClient({ hydrate: stylesheets, prefix: "_" });

  render(
    <RootMemory store={store} styletron={styletron}>
      {VDom}
    </RootMemory>,
    document.getElementById("root")
  );
}

memoryReactRender({
  VDom: (
    <ApolloProvider client={apolloClient}>
      <Wallet />
    </ApolloProvider>
  ),
  reducer: combineReducers<{}>({
    base: noopReducer,
    apolloState: noopReducer,
    apolloAnalyticsState: noopReducer,
    webBpApolloState: noopReducer,
    queryParams: queryParamsReducer,
    signParams: signParamsReducer,
    wallet: walletReducer
  })
});
