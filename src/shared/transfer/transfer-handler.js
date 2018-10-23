import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {TRANSFER} from '../common/site-url';

export function setTransferHandler(server) {
  const {gateways: {iotexCore}} = server;

  function transferHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getTransferId(ctx, next) {
    const {id} = ctx.request.body;

    try {
      ctx.body = {ok: true, transfer: await iotexCore.getTransferById(ctx.request.body.id)};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_TRANSFER', message: 'transfer.error.get', data: {id}}};
    }
  }

  server.get('transfer', TRANSFER.INDEX, transferHandler);
  server.post('getTransferId', TRANSFER.GET, getTransferId);
}
