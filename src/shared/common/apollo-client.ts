import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { createWebBpApolloClient } from "iotex-react-block-producers";
import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
import localForage from "localforage";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import onErrorLink from "./apollo-error-handling";

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
const csrfToken = isBrowser && state.base.csrfToken;

export const createApolloClient = async () => {
  const link = ApolloLink.from([
    onErrorLink,
    new HttpLink({
      uri: apiGatewayUrl,
      fetch,
      headers: { "x-csrf-token": csrfToken }
    })
  ]);

  const cache = new InMemoryCache().restore(apolloState);
  if (isBrowser) {
    const storage = localForage.createInstance({
      name: "IOTEX"
    });
    // @ts-ignore
    await persistCache({ cache, storage });
  }

  return new ApolloClient({
    ssrMode: !isBrowser,
    link,
    cache
  });
};

export const webBpApolloClient = createWebBpApolloClient(
  "https://member.iotex.io/api-gateway/"
);
