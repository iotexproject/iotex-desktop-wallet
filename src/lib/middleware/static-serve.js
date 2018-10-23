const {resolve} = require('path');
const assert = require('assert');
const send = require('koa-send');

export function staticServe(root, opts) {
  opts = opts || {};

  assert(root, 'root directory is required to serve files');

  // options
  opts.root = resolve(root);
  if (opts.index !== false) {
    opts.index = opts.index || 'index.html';
  }

  return async function serve(ctx, next) {
    let done = false;

    if (ctx.method === 'HEAD' || ctx.method === 'GET') {
      try {
        const filePath = ctx.path.replace(new RegExp(`^${opts.routePrefix}`), '') || ctx.path;
        done = await send(ctx, filePath, opts);
      } catch (err) {
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    if (!done) {
      await next();
    }
  };
}
