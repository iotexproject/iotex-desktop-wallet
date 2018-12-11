import test from 'ava';

import {startServer} from '../start-server';

let server;

export function setupTestServer(port, dbName) {
  test.before('Set up server', async() => {
    server = await startServer(port, dbName);
  });

  test.after.cb('Teardown server', t => {
    server.close(t.end);
  });
}

