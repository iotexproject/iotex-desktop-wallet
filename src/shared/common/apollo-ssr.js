import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {getDataFromTree} from 'react-apollo';
import {initAssetURL} from 'onefx/lib/asset-url';
import {configureStore} from 'onefx/lib/iso-react-render/root/configure-store';
import {Server as StyletronServer} from 'styletron-engine-atomic';
import {RootServer} from 'onefx/lib/iso-react-render/root/root-server';
import {createHttpLink} from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import {logger} from 'onefx/lib/integrated-gateways/logger';

export async function apolloSSR(ctx, uri, {VDom, reducer, clientScript}) {
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
  const styletron = new StyletronServer({prefix: '_'});

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
