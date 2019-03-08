import koa from 'koa';
// @ts-ignore
import {Server} from 'onefx';
// @ts-ignore
import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import React from 'react';
import {apolloSSR} from '../common/apollo-ssr';
import {ProfileAppContainer} from './profile-app';

export function setProfileHandler(server: Server): void {
  server.get('/profile/*', server.auth.authRequired, async (ctx: koa.Context, _: Function) => {
    ctx.setState('base.userId', ctx.state.userId);
    ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
      VDom: (
        <ProfileAppContainer/>
      ),
      reducer: noopReducer,
      clientScript: '/profile-main.js',
    });
  });
}
