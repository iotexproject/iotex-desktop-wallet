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

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const apolloAnalyticsState = isBrowser && state.apolloAnalyticsState;
const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
const webBpApiGatewayUrl = isBrowser && state.base.webBpApiGatewayUrl;
const analyticsApiGatewayUrl = isBrowser && state.base.analyticsApiGatewayUrl;
const csrfToken = isBrowser && state.base.csrfToken;

const apolloClientConfig = {
  uri: apiGatewayUrl
};

const fetch = unfetch.bind(window);

const MAX_CONCURRENT_REQUEST = 5;

let availableCap = MAX_CONCURRENT_REQUEST;
setInterval(() => (availableCap = MAX_CONCURRENT_REQUEST), 1000); // Rate cap to 5 requests per second

const limitRateFetch = async (
  req: RequestInfo,
  opt?: RequestInit
): Promise<Response> => {
  if (availableCap > 0) {
    availableCap--;
    return fetch(req, opt);
  }
  return new Promise(resolve =>
    setTimeout(() => resolve(limitRateFetch(req, opt)), 100)
  );
};

const httpLink = new HttpLink({
  uri: apiGatewayUrl,
  fetch: async (_, ...opts) => limitRateFetch(apolloClientConfig.uri, ...opts),
  headers: { "x-csrf-token": csrfToken }
});

const link = ApolloLink.from([httpLink]);

export const apolloClient = new ApolloClient({
  ssrMode: !isBrowser,
  link,
  cache: new InMemoryCache().restore(apolloState)
});

export const setApolloClientEndpoint = (url: string) => {
  apolloClientConfig.uri = url;
  apolloClient.cache.reset();
  apolloClient.reFetchObservableQueries(true);
};

export const webBpApolloClient = createWebBpApolloClient(
  webBpApiGatewayUrl || "https://member.iotex.io/api-gateway/"
);

const httpAnalyticsLink = new HttpLink({
  uri: analyticsApiGatewayUrl || "https://analytics.iotexscan.io/query",
  fetch: limitRateFetch
});

export const analyticsClient = new ApolloClient({
  ssrMode: !isBrowser,
  link: httpAnalyticsLink,
  cache: new InMemoryCache().restore(apolloAnalyticsState)
});
