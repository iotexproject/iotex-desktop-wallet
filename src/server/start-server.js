// @flow
import config from 'config';

import {Server} from '../lib/server';
import {setMiddleware} from './middleware';
import {setServerRoutes} from './server-routes';
import {setGateways} from './gateways/gateways';
import {setService} from './service/service';

export async function startServer() {
  const server = new Server();

  setMiddleware(server);
  setGateways(server);
  setService(server);
  setServerRoutes(server);

  // eslint-disable-next-line no-process-env,no-undef
  const port = parseInt(process.env.PORT || config.get('server.port'), 10);
  server.listen(port);
  return server;
}
