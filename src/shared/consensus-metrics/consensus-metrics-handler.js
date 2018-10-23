import {CONSENSUS_API} from '../common/site-url';

export function setConsensusMetricsRoutes(server) {
  const {gateways: {iotexCore}} = server;

  async function getConsensusMetrics(ctx, next) {
    try {
      const consensusMetrics = await iotexCore.getConsensusMetrics();
      ctx.body = {ok: true, consensusMetrics};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_CONSENSUS', message: 'consensus.error.fail'}};
    }
  }

  server.post('getConsensusMetrics', CONSENSUS_API, getConsensusMetrics);
}
