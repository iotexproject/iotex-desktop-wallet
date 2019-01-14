import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {EXECUTION} from '../common/site-url';
import {logger} from '../../lib/integrated-gateways/logger';

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
      ctx.body = {ok: true, execution: await iotexCore.getExecutionByID(id)};
    } catch (error) {
      logger.error('failed to getExecutionId', error);
      ctx.body = {ok: false, message: 'execution.error.failGetExecution', data: {id}};
    }
  }

  async function getExecutionReceipt(ctx, next) {
    try {
      ctx.body = {ok: true, receipt: await iotexCore.getReceiptByExecutionID(ctx.request.body.id)};
    } catch (error) {
      logger.error('failed to getExecutionReceipt', error);
      ctx.body = {ok: false, message: error};
    }
  }

  async function getContractExecutions(ctx, next) {
    try {
      ctx.body = {ok: true, executions: await iotexCore.getExecutionsByAddress(ctx.request.body.id, ctx.request.body.offset, ctx.request.body.count)};
    } catch (error) {
      logger.error('failed to getContractExecutions', error);
      ctx.body = {ok: false, error};
    }
  }

  server.get('execution', EXECUTION.INDEX, executionHandler);
  server.post('getExecutionId', EXECUTION.GET, getExecutionId);
  server.post('getExecutionReceipt', EXECUTION.GET_RECEIPT, getExecutionReceipt);
  server.post('getContractExecutions', EXECUTION.GET_EXECUTIONS, getContractExecutions);
}
