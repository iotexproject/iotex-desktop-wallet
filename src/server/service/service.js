// @flow
import {RpcService} from './rpc-service';

export function setService(server: any) {
  server.services = server.services || {};
  server.services.rpc = new RpcService(server);
}
