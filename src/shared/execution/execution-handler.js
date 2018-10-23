import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {EXECUTION} from '../common/site-url';

export function setExecutionHandler(server) {
  const {gateways: {iotexCore}} = server;

  function executionHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getExecutionId(ctx, next) {
    const {id} = ctx.request.body;

    try {
      ctx.body = {ok: true, execution: await iotexCore.getExecutionById(id)};
    } catch (error) {
      ctx.body = {ok: false, message: 'execution.error.failGetExecution', data: {id}};
    }
  }

  async function getExecutionReceipt(ctx, next) {
    try {
      ctx.body = {ok: true, receipt: await iotexCore.getReceiptByExecutionId(ctx.request.body.id)};
    } catch (error) {
      ctx.body = {ok: false, message: error};
    }
  }

  async function getContractExecutions(ctx, next) {
    try {
      ctx.body = {ok: true, executions: await iotexCore.getExecutionsByAddress(ctx.request.body.id, ctx.request.body.offset, ctx.request.body.count)};
    } catch (error) {
      ctx.body = {ok: false, error};
    }
  }

  server.get('execution', EXECUTION.INDEX, executionHandler);
  server.post('getExecutionId', EXECUTION.GET, getExecutionId);
  server.post('getExecutionReceipt', EXECUTION.GET_RECEIPT, getExecutionReceipt);
  server.post('getContractExecutions', EXECUTION.GET_EXECUTIONS, getContractExecutions);
}
