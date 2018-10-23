import {Route} from 'inferno-router';
import window from 'global/window';

import {WALLET} from '../common/site-url';
import {WalletContainer} from '../wallet/wallet-container';
import {WalletAppContainer} from '../wallet/wallet-app-container';

export function createViewRoutes(routePrefix = '/') {
  return (
    <Route path={routePrefix} component={WalletAppContainer}>
      <RoutePage path={WALLET.INDEX} component={WalletContainer}/>
    </Route>
  );
}

function RoutePage(props) {
  return (
    <Route onEnter={onEnter} {...props} />
  );
}

function onEnter() {
  // eslint-disable-next-line no-unused-expressions
  window && window.ga && window.ga('send', 'pageview');
  scrollTop();
}

function scrollTop() {
  if (window && window.scrollTo) {
    window.scrollTo(0, 0);
  }
}
