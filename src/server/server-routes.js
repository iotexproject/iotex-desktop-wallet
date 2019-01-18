// @flow

import type {Server} from 'onefx/lib/server';
import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import {AppContainer} from '../shared/app-container';
import {setApiGateway} from '../api-gateway/api-gateway';
import {apolloSSR} from '../shared/common/apollo-ssr';
import {setEmailPasswordIdentityProviderRoutes} from '../shared/onefx-auth-provider/email-password-identity-provider/email-password-identity-provider-handler';

export function setServerRoutes(server: Server) {
  // Health checks
  server.get('health', '/health', function onHealth(ctx) {
    ctx.body = 'OK';
  });

  setApiGateway(server);
  setEmailPasswordIdentityProviderRoutes(server);

  server.get('SPA', '/', async function onRoute(ctx) {
    ctx.setState('base.blah', 'this is a sample initial state');
    ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
      VDom: (
        <AppContainer/>
      ),
      reducer: noopReducer,
      clientScript: '/main.js',
    });
  });
}
