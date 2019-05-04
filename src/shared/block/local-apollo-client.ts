import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const csrfToken = isBrowser && state.base.csrfToken;

const link = ApolloLink.from([
  new HttpLink({
    uri: "https://member.iotex.io/api-gateway/",
    fetch,
    headers: { "x-csrf-token": csrfToken }
  })
]);

export const localApolloClient = new ApolloClient({
  ssrMode: !isBrowser,
  link,
  cache: new InMemoryCache().restore(apolloState)
});
