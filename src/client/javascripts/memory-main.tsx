// @ts-ignore
import { initAssetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { initClientI18n } from "onefx/lib/iso-i18n";
// @ts-ignore
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
// @ts-ignore
import { RootBrowser } from "onefx/lib/iso-react-render/root/root-browser";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
// @ts-ignore
import { render } from "react-dom";
import { combineReducers, Reducer } from "redux";
// @ts-ignore
import JSONGlobals from "safe-json-globals/get";
// @ts-ignore
import { Client as StyletronClient } from "styletron-engine-atomic";
import { apolloClient } from "../../shared/common/apollo-client";
import { RootMemory } from "../../shared/common/root-memory";
import { Wallet } from "../../shared/wallet/wallet";
import { queryParamsReducer } from "../../shared/wallet/wallet-reducer";

export const STYLETRON_GLOBAL = "styletron-global";

type Opts = {
  reducer: Reducer;
  VDom: JSX.Element;
};

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
  reducer: combineReducers({
    base: noopReducer,
    apolloState: noopReducer,
    webBpApolloState: noopReducer,
    queryParams: queryParamsReducer
  })
});
