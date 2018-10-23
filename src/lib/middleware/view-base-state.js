// @flow
import deepExtend from 'deep-extend';
import dotty from 'dotty';
import type {Context} from 'koa';

import type {Server} from '../server';

export function viewBaseState(server: Server) {
  return async(ctx: Context, next: () => Promise<void>) => {

    ctx.state.view = {
      base: {
        routePrefix: server.routePrefix(),
        siteURL: server.siteURL,
        analytics: server.config.analytics,
        csrfToken: ctx.csrf,
        iotexCore: server.config.gateways.iotexCore,
      },
    };

    ctx.deepExtendState = function deepExtendState(newState) {
      ctx.state.view = deepExtend({}, ctx.state.view, newState);
    };
    ctx.setState = function setState(path, val) {
      dotty.put(ctx.state.view, path, val);
    };
    ctx.getState = function getState(path) {
      if (path) {
        return dotty.get(ctx.state.view, path);
      }
      return ctx.state.view;
    };
    ctx.removeState = function removeState(path) {
      return dotty.remove(ctx.state.view, path);
    };

    return await next();
  };
}
