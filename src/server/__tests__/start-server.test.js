import test from 'ava';
import config from 'config';

import {asyncRequest} from './async-request';
import {setupTestServer} from './setup-test-server';

const port = config.server.port;
setupTestServer(port);

test('GET /health', async t => {
  try {
    const res = await asyncRequest({
      method: 'GET',
      path: '/health',
    }, port);

    t.deepEqual(res.statusCode, 200, 'res.statusCode');
    t.deepEqual(res.body, 'OK', 'res.body');
  } catch (err) {
    t.fail(`Failed to connect to the server: ${err}`);
  }
});

test('GET /', async t => {
  t.plan(5);
  try {
    const res = await asyncRequest({
      method: 'GET',
      path: '/',
    }, port);

    t.deepEqual(res.statusCode, 200, 'res.statusCode');
    const html = res.body;
    t.true(html.includes('html'), 'html.includes(\'html\')');
    t.true(html.includes('head'), 'html.includes(\'head\')');
    t.true(html.includes('body'), 'html.includes(\'body\')');
    t.true(html.includes('<div id=\'root\'>'), 'html.includes(\'<div id=\'root\'>\')');
  } catch (err) {
    t.fail(`Failed to connect to the server: ${err}`);
  }
});
