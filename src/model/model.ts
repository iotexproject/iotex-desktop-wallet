// @ts-ignore
import {Server} from 'onefx/lib/server';

export function setModel(server: Server): void {
  server.model = server.model || {};
}
