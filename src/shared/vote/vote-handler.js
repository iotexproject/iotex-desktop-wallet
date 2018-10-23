import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {VOTE} from '../common/site-url';

export function setVoteRoutes(server) {
  const {gateways: {iotexCore}} = server;

  function voteHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getVoteId(ctx, next) {
    const {id} = ctx.request.body;

    try {
      ctx.body = {ok: true, vote: await iotexCore.getVoteByID(ctx.request.body.id)};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_VOTE', message: 'vote.error.getVote', data: {id}}};
    }
  }

  server.get('address', VOTE.INDEX, voteHandler);
  server.post('getVoteId', VOTE.GET_VOTE, getVoteId);
}
