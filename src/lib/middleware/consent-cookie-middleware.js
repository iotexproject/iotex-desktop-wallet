import dotty from 'dotty';

export function consentCookieMiddleware(server) {
  return async(ctx, next) => {
    const consent = dotty.get(ctx, 'request.query.consent');
    if (consent) {
      server.logger.info('set consent cookie status');
      ctx.cookies.set(
        'consent',
        consent,
        {
          maxAge: 365 * 24 * 3600 * 1000,
        }
      );
    }
    await next();
  };
}
