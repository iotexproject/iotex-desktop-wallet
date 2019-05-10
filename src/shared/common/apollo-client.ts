import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { createWebBpApolloClient } from "iotex-react-block-producers";
import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import onErrorLink from "./apollo-error-handling";

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
const csrfToken = isBrowser && state.base.csrfToken;

const link = ApolloLink.from([
  onErrorLink,
  new HttpLink({
    uri: apiGatewayUrl,
    fetch,
    headers: { "x-csrf-token": csrfToken }
  })
]);

export const apolloClient = new ApolloClient({
  ssrMode: !isBrowser,
  link,
  cache: new InMemoryCache().restore(apolloState)
});

export const webBpApolloClient = createWebBpApolloClient(
  "https://member.iotex.io/api-gateway/"
);
