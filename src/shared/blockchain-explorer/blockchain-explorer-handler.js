import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {SITE_URL} from '../common/site-url';

export function setBlockchainExplorerRoutes(server) {
  async function blockchainExplorerHandler(ctx, next) {
    return ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  server.get('getBlockchainExplorerView', SITE_URL, blockchainExplorerHandler);
}
