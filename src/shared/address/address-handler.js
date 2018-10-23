import {createViewRoutes} from '../view-routes';
import {rootReducer} from '../common/root/root-reducer';
import {ADDRESS} from '../common/site-url';

export function setAddressRoutes(server) {
  const {gateways: {iotexCore}} = server;

  function addressHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/main.js',
    });
  }

  async function getAddressId(ctx, next) {
    const {id} = ctx.request.body;

    try {
      ctx.body = {ok: true, address: await iotexCore.getAddressDetails(id)};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_ADDRESS', message: 'address.error.failGetAddress', data: {id}}};
    }
  }

  async function getAddressExecutionsId(ctx, next) {
    try {
      ctx.body = {
        ok: true,
        executions: await iotexCore.getExecutionsByAddress(ctx.request.body.id, ctx.request.body.offset, ctx.request.body.count),
        offset: ctx.request.body.offset,
        count: ctx.request.body.count,
      };
    } catch (error) {
      ctx.body = {ok: false, error};
    }
  }

  async function getAddressTransfersId(ctx, next) {
    const {id, offset, count} = ctx.request.body;

    try {
      ctx.body = {
        ok: true,
        transfers: await iotexCore.getTransfersByAddress(id, offset, count),
        offset: ctx.request.body.offset,
        count: ctx.request.body.count,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_ADDRESS_TRANSFERS', message: 'address.error.failGetTransfers', data: {id}}};
    }
  }

  function cleanVotes(votes) {
    const res = [];
    if (votes) {
      let prevId = '';
      for (let i = 0; i < votes.length; i++) {
        if (votes[i] !== undefined) {
          if (prevId !== votes[i].id) {
            votes[i].out = true;
          }
          prevId = votes[i].id;
          res.push(votes[i]);
        }
      }
    }
    return res;
  }

  async function getAddressVotersId(ctx, next) {
    const {id, offset, count} = ctx.request.body;

    try {
      const votes = await iotexCore.getVotesByAddress(id, offset, count);
      ctx.body = {
        ok: true,
        voters: cleanVotes(votes),
        offset,
        count,
      };
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_ADDRESS_VOTES', message: 'address.error.failGetVotes', data: {id}}};
    }
  }

  server.get('address', ADDRESS.INDEX, addressHandler);
  server.post('getAddressId', ADDRESS.GET_ADDRESS, getAddressId);
  server.post('getAddressTransfersId', ADDRESS.GET_TRANSFERS, getAddressTransfersId);
  server.post('getAddressExecutionsId', ADDRESS.GET_EXECUTIONS, getAddressExecutionsId);
  server.post('getAddressVotersId', ADDRESS.GET_VOTERS, getAddressVotersId);
}
