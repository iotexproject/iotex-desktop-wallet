import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {TRANSFERS} from '../common/site-url';

export function setTransfersHandler(server) {
  const {gateways: {iotexCore}} = server;

  function transfersHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getTransfers(ctx, next) {
    const {tip, offset, count, showCoinBase} = ctx.request.body;

    try {
      if (tip === undefined || tip === -1) {
        throw new Error('Could not load latest block');
      }

      ctx.body = {
        ok: true,
        transfers: await iotexCore.getLastTransfersByRange(tip, offset, count, showCoinBase !== undefined ? showCoinBase : true),
        offset,
        count,
        tip,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_TRANSFERS', message: 'transfers.error.get'}};
    }
  }

  server.get('transfers', TRANSFERS.INDEX, transfersHandler);
  server.post('getTransfers', TRANSFERS.GET, getTransfers);
}
