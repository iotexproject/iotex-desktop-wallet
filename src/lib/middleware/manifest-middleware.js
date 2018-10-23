import {logger} from '../integrated-gateways/logger';

export function manifestMiddleware(server) {
  return async(ctx, next) => {
    let manifest = {};
    try {
      manifest = require('../../../dist/manifest.json');
    } catch (e) {
      logger.info(`cannot load manifest: ${e.stack}`);
    }
    ctx.setState('base.manifest', manifest);
    await next();
  };
}
