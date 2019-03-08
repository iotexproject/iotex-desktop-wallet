import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import koa from 'koa';
// @ts-ignore
import {initAssetURL} from 'onefx/lib/asset-url';
// @ts-ignore
import {logger} from 'onefx/lib/integrated-gateways/logger';
// @ts-ignore
import {configureStore} from 'onefx/lib/iso-react-render/root/configure-store';
// @ts-ignore
import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
// @ts-ignore
import {RootServer} from 'onefx/lib/iso-react-render/root/root-server';
import React from 'react';
import {ApolloProvider} from 'react-apollo';
import {getDataFromTree} from 'react-apollo';
// @ts-ignore
import * as engine from 'styletron-engine-atomic';

type Opts = {
  VDom: JSX.Element,
  reducer: Function,
  clientScript: string,
}

export async function apolloSSR(ctx: koa.Context, uri: string, {VDom, reducer, clientScript}: Opts) {
  ctx.setState('base.apiGatewayUrl', uri);
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri,
      fetch,
      credentials: 'same-origin',
      headers: {
        cookie: ctx.get('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  });

  const state = ctx.getState();
  initAssetURL(state.base.manifest);
  const store = configureStore(state, noopReducer);
  const styletron = new engine.Server({prefix: '_'});

  const context = {};

  try {
    await getDataFromTree(
      <RootServer store={store} location={ctx.url} context={context} styletron={styletron}>
        <ApolloProvider client={apolloClient}>
          {VDom}
        </ApolloProvider>
      </RootServer>,
    );
    const apolloState = apolloClient.extract();
    ctx.setState('apolloState', apolloState);
  } catch (e) {
    logger.error(`failed to hydrate apollo SSR: ${e}`);
  }
  return ctx.isoReactRender({
    VDom: (
      <ApolloProvider client={apolloClient}>
        {VDom}
      </ApolloProvider>
    ),
    clientScript,
    reducer,
  });
}
