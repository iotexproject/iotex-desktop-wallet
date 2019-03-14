// @ts-ignore
import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { AppContainer } from "../../shared/app-container";
import { apolloClient } from "../../shared/common/apollo-client";

clientReactRender({
  VDom: (
    <ApolloProvider client={apolloClient}>
      <AppContainer />
    </ApolloProvider>
  ),
  reducer: noopReducer,
  clientScript: "/main.js"
});
