// @flow
import JsonGlobals from 'safe-json-globals';
import StyletronServer from 'styletron-server';
import {match} from 'inferno-router';
import {renderToString} from 'inferno-server';

import type {Server} from '../server';
import {configureStore} from '../../shared/common/root/configure-store';
import {initAssetURL} from '../asset-url';
import {initServerI18n} from '../iso-i18n';
import {rootHtml} from '../../shared/common/root/root-html';
import {RootServer} from '../../shared/common/root/root-server';

export function isoRenderMiddleware(server: Server): any {
  return async(ctx, next) => {
    ctx.isoRender = ({vDom, reducer, clientScript}) => {
      const routes = vDom;
      const renderProps = match(routes, ctx.url);
      if (renderProps.redirect) {
        return ctx.redirect(renderProps.redirect);
      }

      ctx.body = html(ctx, renderProps, reducer, clientScript);
    };
    await next();
  };
}

function html(ctx, renderProps, reducer, clientScript): string {
  initServerI18n(ctx);
  const state = ctx.getState();
  const jsonGlobals = JsonGlobals({state});
  initAssetURL(state.base.siteURL, state.base.routePrefix, state.base.manifest);
  const store = configureStore(state, reducer);
  const styletron = new StyletronServer({prefix: '_'});

  const reactMarkup = renderToString(
    <RootServer store={store} renderProps={renderProps} styletron={styletron}/>
  );
  return rootHtml({styletron, jsonGlobals, reactMarkup, clientScript});
}
