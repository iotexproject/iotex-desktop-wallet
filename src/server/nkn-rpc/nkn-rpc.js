import nkn from 'nkn-client';
import Barrister from 'barrister';
import idlJson from '../json-rpc/json-rpc.json';
import {BarristerAdapter} from '../json-rpc/barrister-handler-factory';

export function setupNknRpc(server) {
  const jsonRpcService = new Barrister.Server(idlJson);
  jsonRpcService.addHandler('JsonRpc', new BarristerAdapter(server.services.rpc));

  const client = nkn({
    identifier: 'iotex-gateway1',
    privateKey: '6ff1b417b1568303dbc3c69423b3690384468c1d4efdfe9b22a7c97b67d78da1',
    seedRpcServerAddr: 'http://104.196.247.255:30003',
  });
  client.on('message', async(src, payload) => {
    server.logger.info(`receive payload: ${payload}`);
    const req = JSON.parse(payload);
    return new Promise((resolve, reject) => {
      jsonRpcService.handle({}, req, resp => {
        resolve(JSON.stringify(resp));
      });
    });
  });
}
