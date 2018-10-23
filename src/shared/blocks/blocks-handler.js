import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {BLOCKS} from '../common/site-url';

export function setBlocksRoutes(server) {
  const {gateways: {iotexCore}} = server;

  function blocksHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getBlocks(ctx, next) {
    const {tip, offset, count} = ctx.request.body;

    try {
      if (tip === undefined || tip === -1) {
        throw new Error('Could not load latest block');
      }

      ctx.body = {
        ok: true,
        blocks: await iotexCore.getLastBlocksByRange(tip - offset, count),
        offset,
        count,
        tip,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_BLOCKS', message: 'blocks.error.get'}};
    }
  }

  server.get('blocks', BLOCKS.INDEX, blocksHandler);
  server.post('getBlocks', BLOCKS.GET, getBlocks);
}
