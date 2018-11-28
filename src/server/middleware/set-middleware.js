// @flow
import helmet from 'koa-helmet';
import config from 'config';
import uuid from 'uuid/v4';
import type {Server} from '../../lib/server';
import csp from './csp/csp';

function htmlOnlyMiddleware({preFunc = () => null, postFunc = () => null}) {
  return async(ctx, next) => {
    await preFunc(ctx, next);
    await next();
    if (ctx.response.type === 'text/html') {
      await postFunc(ctx, next);
    }
  };
}

export function setMiddleware(server: Server) {
  server.use(htmlOnlyMiddleware({
    postFunc: async ctx => {
      await helmet()(ctx, () => null);
    },
  }));

  const cspConfig = config.csp;
  if (cspConfig) {
    server.use(htmlOnlyMiddleware({
      preFunc: async ctx => {
        ctx.state.nonce = uuid();
      },
      postFunc: async ctx => {
        await csp({
          policy: {
            ...cspConfig,
            'script-src': [
              ...cspConfig['script-src'],
              ctx => {
                return `'nonce-${ ctx.state.nonce }'`;
              },
            ],
          },
        })(ctx, () => null);
      }}));
  }
}
