// @flow
import document from 'global/document';
import StyletronClient from 'styletron-client';
import {render} from 'inferno';
import window from 'global/window';

import JSONGlobals from 'safe-json-globals/get';
import {initAssetURL} from '../../../lib/asset-url';
import {initClientI18n} from '../../../lib/iso-i18n';
import {initGoogleAnalytics} from '../google-analytics';
import {configureStore} from './configure-store';
import {RootBrowser} from './root-browser';
import {noopReducer} from './root-reducer';
import type {Reducer} from './root-reducer';

export function clientRender({reducer = noopReducer, vDom}: {reducer: Reducer, vDom: any}) {
  const store = configureStore(JSONGlobals('state'), reducer);
  const {siteURL, routePrefix, translations, analytics: {googleTid}, manifest, csrfToken} = store.getState().base;
  window.csrfToken = csrfToken;

  initGoogleAnalytics({tid: googleTid});
  initClientI18n(translations);
  initAssetURL(siteURL, routePrefix, manifest);

  const stylesheets = document.getElementsByClassName('styletron-global');
  const styletron = new StyletronClient(stylesheets, {prefix: '_'});

  render(
    <RootBrowser store={store} styletron={styletron}>
      {vDom}
    </RootBrowser>
    ,
    document.getElementById('root')
  );
}

