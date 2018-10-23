import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {DELEGATES} from '../common/site-url';

export function setDelegateRoutes(server) {
  const {gateways: {iotexCore}} = server;

  function delegateHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getDelegates(ctx, next) {
    try {
      ctx.body = {
        ok: true,
        delegates: await iotexCore.getCandidateMetrics(),
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_DELEGATES', message: 'delegates.error.fail'}};
    }
  }

  server.get('delegate', DELEGATES.INDEX, delegateHandler);
  server.post('getDelegates', DELEGATES.GET, getDelegates);
}
