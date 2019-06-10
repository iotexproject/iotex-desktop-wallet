import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
// @ts-ignore
import window from "global/window";
import { createWebBpApolloClient } from "iotex-react-block-producers";
import isBrowser from "is-browser";
import unfetch from "isomorphic-unfetch";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import onErrorLink from "./apollo-error-handling";

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
const csrfToken = isBrowser && state.base.csrfToken;

const apolloClientConfig = {
  uri: apiGatewayUrl
};

const fetch = unfetch.bind(window);

const httpLink = new HttpLink({
  uri: apiGatewayUrl,
  fetch: (_, ...opts) => fetch(apolloClientConfig.uri, ...opts),
  headers: { "x-csrf-token": csrfToken }
});

const link = ApolloLink.from([onErrorLink, httpLink]);

export const apolloClient = new ApolloClient({
  ssrMode: !isBrowser,
  link,
  cache: new InMemoryCache().restore(apolloState)
});

export const setApolloClientEndpoint = (url: string) => {
  apolloClientConfig.uri = url;
  apolloClient.resetStore();
  apolloClient.reFetchObservableQueries(true);
};

export const webBpApolloClient = createWebBpApolloClient(
  "https://member.iotex.io/api-gateway/"
);
