// @flow
import config from 'config';
import bodyParser from 'koa-bodyparser';

import type {Server} from '../server';
import {viewBaseState} from './view-base-state';
import {initI18nMiddleware} from './i18n-middleware';
import {staticServe} from './static-serve';
import {cookieSessionMiddleware} from './cookie-session-middleware';
import {manifestMiddleware} from './manifest-middleware';
import {isoRenderMiddleware} from './iso-render-middleware';
import {uncaughtErrorMiddleware} from './uncaught-error-middleware';

export function initMiddleware(server: Server) {
  server.use(uncaughtErrorMiddleware(server));
  initI18nMiddleware(server);

  // Static file serving
  const staticDir = config.get('server').staticDir || 'dist';
  server.all('serve-static', '/*', staticServe(staticDir, {routePrefix: server.routePrefix()}));

  server.use(bodyParser());
  server.use(cookieSessionMiddleware(server));

  server.use(viewBaseState(server));
  server.use(manifestMiddleware(server));
  server.use(isoRenderMiddleware(server));
}
