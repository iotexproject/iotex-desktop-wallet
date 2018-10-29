// @flow
import idl from './json-rpc.json';
import {barristerHandlerFactory} from './barrister-handler-factory';

export function setJsonRpcRoutes(server: any) {
  server.post(
    'api/json-rpc/',
    'api/json-rpc/',
    async(ctx, next) => {
      setCors(ctx);
      next();
    },
    barristerHandlerFactory({
      service: server.services.rpc,
      idlJson: idl,
      name: 'JsonRpc',
    })
  );
  server.all(
    'api/wallet-core/',
    'api/wallet-core/',
    async ctx => {
      const {jsonrpc, id, method, params} = ctx.request.body;
      setCors(ctx);
      try {
        const result = await server.gateways.walletCore[method](...params);
        return ctx.response.body = {
          id,
          jsonrpc,
          result,
        };
      } catch (e) {
        return ctx.response.body = {
          id,
          jsonrpc,
          error: {
            code: -32600,
            message: JSON.stringify(e),
          },
        };
      }
    }
  );
}

function setCors(ctx) {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'POST');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
}
