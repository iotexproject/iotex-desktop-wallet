// @flow
import type {Server} from 'onefx/lib/server';
import {manifestMiddleware} from './manifest-middleware';

export function setMiddleware(server: Server) {
  server.use(manifestMiddleware(server));
}
