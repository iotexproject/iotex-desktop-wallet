import {RouterContext} from 'inferno-router';
import {Provider} from 'inferno-redux';
import {Provider as StyleProvider} from 'styletron-inferno';

export function RootServer({store, renderProps, styletron}) {
  return (
    <Provider store={store}>
      <StyleProvider styletron={styletron}>
        <RouterContext {...renderProps}/>
      </StyleProvider>
    </Provider>
  );
}
