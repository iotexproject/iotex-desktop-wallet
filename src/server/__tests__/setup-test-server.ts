import test from 'ava';
// @ts-ignore
import {Server} from 'onefx';
import {startServer} from '../start-server';

let server: Server;

export function setupTestServer():void {
  test.before('Set up server', async () => {
    server = await startServer();
  });

  test.after.cb('Teardown server', t => {
    server.close(t.end);
  });
}
