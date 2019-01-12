// @flow

import type {Server} from 'onefx/lib/server';
import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import {AppContainer} from '../shared/app-container';
import {setApiGateway} from '../api-gateway/api-gateway';

export function setServerRoutes(server: Server) {
  // Health checks
  server.get('health', '/health', function onHealth(ctx) {
    ctx.body = 'OK';
  });

  setApiGateway(server);

  server.get('SPA', '/', function onRoute(ctx) {
    ctx.setState('base.blah', 'this is a sample initial state');
    ctx.body = ctx.isoReactRender({
      VDom: (
        <AppContainer/>
      ),
      reducer: noopReducer,
      clientScript: '/main.js',
    });
  });
}
