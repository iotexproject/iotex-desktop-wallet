export function uncaughtErrorMiddleware(server) {
  return async(ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = 'Internal Server Error';
      server.logger.error(err);
    }
  };
}
