// @flow
import idl from './json-rpc.json';
import {barristerHandlerFactory} from './barrister-handler-factory';

export function setJsonRpcRoutes(server: any) {
  server.post(
    'api/json-rpc/',
    'api/json-rpc/',
    barristerHandlerFactory({
      service: server.services.rpc,
      idlJson: idl,
      name: 'JsonRpc',
    })
  );
  server.post(
    'api/wallet-core/',
    'api/wallet-core/',
    async ctx => {
      const {jsonrpc, id, method, params} = ctx.request.body;
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
            message: e.message,
          },
        };
      }
    }
  );
}
