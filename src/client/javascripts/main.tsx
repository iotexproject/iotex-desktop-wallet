// @ts-ignore
import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { AppContainer } from "../../shared/app-container";
import { createApolloClient } from "../../shared/common/apollo-client";

const clientRender = async () => {
  const apolloClient = await createApolloClient();
  clientReactRender({
    VDom: (
      <ApolloProvider client={apolloClient}>
        <AppContainer />
      </ApolloProvider>
    ),
    reducer: noopReducer,
    clientScript: "/main.js"
  });
};

clientRender();
