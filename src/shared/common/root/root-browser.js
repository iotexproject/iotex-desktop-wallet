import createBrowserHistory from 'history/createBrowserHistory';
import {Provider as StyleProvider} from 'styletron-inferno';
import {Provider} from 'inferno-redux';
import {Router} from 'inferno-router';

const browserHistory = createBrowserHistory();

export function RootBrowser({store, children, styletron}) {
  return (
    <Provider store={store}>
      <StyleProvider styletron={styletron}>
        <Router history={browserHistory}>
          {children}
        </Router>
      </StyleProvider>
    </Provider>
  );
}
