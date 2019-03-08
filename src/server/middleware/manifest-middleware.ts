/* eslint-disable import/no-unresolved */
import koa from 'Koa';
// @ts-ignore
import {Server} from 'onefx';
// @ts-ignore
import {logger} from 'onefx/lib/integrated-gateways/logger';

export function manifestMiddleware(_: Server): Function {
  return async (ctx: koa.Context, next: Function) => {
    let manifest = {};
    try {
      manifest = require('../../../dist/asset-manifest.json');
    } catch (e) {
      logger.info(`cannot load manifest: ${e.stack}`);
    }
    ctx.setState('base.manifest', manifest);
    await next();
  };
}
