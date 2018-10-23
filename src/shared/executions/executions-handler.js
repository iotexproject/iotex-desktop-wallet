import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {EXECUTIONS} from '../common/site-url';

export function setExecutionsHandler(server) {
  const {gateways: {iotexCore}} = server;

  function executionsHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getExecutions(ctx, next) {
    try {
      if (ctx.request.body.tip === undefined || ctx.request.body.tip === -1) {
        throw new Error('Could not load latest block');
      }

      ctx.body = {
        ok: true,
        executions: await iotexCore.getLastExecutionsByRange(
          ctx.request.body.tip,
          ctx.request.body.offset,
          ctx.request.body.count),
        offset: ctx.request.body.offset,
        count: ctx.request.body.count,
        tip: ctx.request.body.tip,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_EXECUTIONS', message: 'executions.error.get'}};
    }
  }

  server.get('executions', EXECUTIONS.INDEX, executionsHandler);
  server.post('getExecutions', EXECUTIONS.GET, getExecutions);
}
