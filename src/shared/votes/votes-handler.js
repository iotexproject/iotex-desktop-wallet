import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {VOTES} from '../common/site-url';

export function setVotesRoutes(server) {
  const {gateways: {iotexCore}} = server;

  function votesHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getVotes(ctx, next) {
    const {tip, offset, count} = ctx.request.body;

    try {
      if (tip === undefined || tip === -1) {
        throw new Error('Could not load latest block');
      }

      ctx.body = {
        ok: true,
        votes: await iotexCore.getLastVotesByRange(tip, offset, count),
        offset,
        count,
        tip,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_VOTES', message: 'votes.error.get'}};
    }
  }

  server.get('votes', VOTES.INDEX, votesHandler);
  server.post('getVotes', VOTES.GET, getVotes);
}
