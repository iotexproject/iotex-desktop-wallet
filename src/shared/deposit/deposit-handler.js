import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {DEPOSIT} from '../common/site-url';

export function setDepositRoutes(server) {
  const {gateways: {iotexCore}} = server;

  function depositHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getSettleDepositId(ctx, next) {
    const {id} = ctx.request.body;

    try {
      ctx.body = {ok: true, settleDeposit: await iotexCore.getSettleDeposit(ctx.request.body.id)};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_CREATE_DEPOSIT', message: 'deposit.error.getSettleDeposit', data: {id}}};
    }
  }

  async function getCreateDepositId(ctx, next) {
    const {id} = ctx.request.body;

    try {
      ctx.body = {ok: true, createDeposit: await iotexCore.getCreateDeposit(ctx.request.body.id)};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_SETTLE_DEPOSIT', message: 'deposit.error.getCreateDeposit', data: {id}}};
    }
  }

  server.get('settleDeposit', DEPOSIT.INDEX_SETTLE, depositHandler);
  server.get('createDeposit', DEPOSIT.INDEX_CREATE, depositHandler);
  server.post('getSettleDepositId', DEPOSIT.GET_SETTLE, getSettleDepositId);
  server.post('getCreateDepositId', DEPOSIT.GET_CREATE, getCreateDepositId);
}
