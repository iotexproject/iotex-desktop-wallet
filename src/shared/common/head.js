// @flow
import {t} from 'onefx/lib/iso-i18n';
import {mobileViewPortContent} from 'onefx/lib/iso-react-render/root/mobile-view-port-content';
import {assetURL} from 'onefx/lib/asset-url';
import Helmet from 'onefx/lib/react-helmet';
import {colors} from './styles/style-color';

export function Head({locale}: {locale: string}) {
  return (
    <Helmet
      title={`${t('meta.title')} - ${t('meta.description')}`}
      meta={[
        {name: 'viewport', content: mobileViewPortContent},
        {name: 'description', content: t('meta.description')},
        {name: 'theme-color', content: colors.brand01},

        // social
        {property: 'og:title', content: `${t('meta.title')}`},
        {property: 'og:description', content: t('meta.description')},
        {property: 'twitter:card', content: 'summary'},
      ]}
      link={[
        // PWA & mobile
        {rel: 'manifest', href: '/manifest.json'},
        {rel: 'apple-touch-icon', href: '/favicon.png'},

        {rel: 'icon', type: 'image/png', sizes: 'any', href: assetURL('/favicon.png')},

        // styles
        {rel: 'stylesheet', type: 'text/css', href: assetURL('/stylesheets/main.css')},
        {href: 'https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic', rel: 'stylesheet', type: 'text/css'},
      ]}
    >
      <html lang={locale}/>
    </Helmet>
  );
}
