const session = require('koa-session');

const CONFIG = {
  key: 'koa:sess',
  maxAge: 14 * 86400000, // ms = 14 days
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
};

export function cookieSessionMiddleware(server) {
  const config = {
    ...CONFIG,
    key: `${server.config.project}:sess`,
    ...server.config.session,
  };
  return session(config, server.app);
}
