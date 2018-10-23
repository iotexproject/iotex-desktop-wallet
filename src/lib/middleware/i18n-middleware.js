import fs from 'fs';
import dotty from 'dotty';
import i18n from 'koa-i18n';
import locale from 'koa-locale';

const SUPPORTED_LOCALES = ['en'];

export function initI18nMiddleware(server) {
  locale(server.app);
  let directory = './translations';

  const preferredDir = `./${server.config.project}-translations`;
  if (fs.existsSync(preferredDir)) {
    directory = preferredDir;
  }
  server.logger.info(`load translations from ${directory}`);

  server.use(i18n(server.app, {
    directory,
    locales: SUPPORTED_LOCALES,
    modes: [
      'cookie',
      'query',
      'header',
    ],
    extension: '.yaml',
    parse(data) {
      return require('js-yaml').safeLoad(data);
    },
    dump(data) {
      return require('js-yaml').safeDump(data);
    },
  }));
  server.use(async(ctx, next) => {
    const locale = dotty.get(ctx, 'request.query.locale');
    if (locale && SUPPORTED_LOCALES.indexOf(locale) !== -1) {
      ctx.cookies.set(
        'locale',
        ctx.request.query.locale.toLowerCase(),
        {
          maxAge: 14 * 24 * 3600 * 1000,
        },
      );
      ctx.i18n.setLocale(locale);
    }
    await next();
  });
}
