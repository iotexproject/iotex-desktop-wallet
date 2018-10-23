import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {BLOCK} from '../common/site-url';

export function setBlockRoutes(server) {
  const {gateways: {iotexCore}} = server;

  function blockHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getBlockId(ctx, next) {
    const {id} = ctx.request.body;

    try {
      ctx.body = {ok: true, block: await iotexCore.getBlockById(id)};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_BLOCK_ID', message: 'block.error.failGetBlock', data: {id}}};
    }
  }

  async function getBlockExecutionsId(ctx, next) {
    try {
      ctx.body = {
        ok: true,
        executions: await iotexCore.getExecutionsByBlockID(ctx.request.body.id, ctx.request.body.offset, ctx.request.body.count),
        offset: ctx.request.body.offset,
        count: ctx.request.body.count,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_EXECUTIONS', message: error}};
    }
  }

  async function getBlockTransfersId(ctx, next) {
    const {id, offset, count} = ctx.request.body;

    try {
      ctx.body = {
        ok: true,
        transfers: await iotexCore.getTransfersByBlockID(id, offset, count),
        offset: ctx.request.body.offset,
        count: ctx.request.body.count,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_BLOCK_TRANSFERS', message: 'block.error.failGetTransfers', data: {id}}};
    }
  }

  async function getBlockVotesId(ctx, next) {
    const {id, offset, count} = ctx.request.body;

    try {
      ctx.body = {
        ok: true,
        votes: await iotexCore.getVotesByBlockID(id, offset, count),
        offset: ctx.request.body.offset,
        count: ctx.request.body.count,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_BLOCK_VOTES', message: 'block.error.failGetVotes', data: {id}}};
    }
  }

  server.get('block', BLOCK.INDEX, blockHandler);
  server.post('getBlockId', BLOCK.GET_BLOCK, getBlockId);
  server.post('getBlockTransfersId', BLOCK.GET_TRANSFERS, getBlockTransfersId);
  server.post('getBlockExecutionsId', BLOCK.GET_EXECUTIONS, getBlockExecutionsId);
  server.post('getBlockVotesId', BLOCK.GET_VOTES, getBlockVotesId);
}
