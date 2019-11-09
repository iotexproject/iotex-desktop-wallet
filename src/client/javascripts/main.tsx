// @ts-ignore
import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Reducer } from "redux";
import { combineReducers } from "redux";
import { createStore } from "redux";
import { AppContainer } from "../../shared/app-container";
import { apolloClient } from "../../shared/common/apollo-client";
import "../../shared/common/setup-big-number";
import {
  queryParamsReducer,
  signParamsReducer,
  walletReducer
} from "../../shared/wallet/wallet-reducer";
type Opts = {
  reducer: Reducer;
  VDom: JSX.Element;
  clientScript: string;
};

const rootReducer = combineReducers<{}>({
  base: noopReducer,
  apolloState: noopReducer,
  apolloAnalyticsState: noopReducer,
  webBpApolloState: noopReducer,
  queryParams: queryParamsReducer,
  signParams: signParamsReducer,
  wallet: walletReducer
});

clientReactRender({
  VDom: (
    <BrowserRouter>
      <Provider
        store={createStore(rootReducer, {
          base: {
            analytics: {},
            translations: {},
            manifest: {}
          }
        })}
      >
        <ApolloProvider client={apolloClient}>
          <AppContainer />
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  ),
  reducer: rootReducer,
  clientScript: "/main.js"
} as Opts);
