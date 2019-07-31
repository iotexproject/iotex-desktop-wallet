import "@babel/polyfill";
// tslint:disable-next-line: ordered-imports
import TransportU2F from "@ledgerhq/hw-transport-u2f";
// @ts-ignore
import window from "global/window";
// @ts-ignore
import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { Reducer } from "redux";
import { combineReducers } from "redux";
import { AppContainer } from "../../shared/app-container";
import { apolloClient } from "../../shared/common/apollo-client";
import "../../shared/common/setup-big-number";
import {
  queryParamsReducer,
  signParamsReducer,
  walletReducer
} from "../../shared/wallet/wallet-reducer";

const injectedWindow: Window & { transport?: {} } = window;
injectedWindow.transport = TransportU2F;
type Opts = {
  reducer: Reducer;
  VDom: JSX.Element;
  clientScript: string;
};

clientReactRender({
  VDom: (
    <ApolloProvider client={apolloClient}>
      <AppContainer />
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
  }),
  clientScript: "/main.js"
} as Opts);
