import process from 'global/process';
import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  project: 'web-onefx-boilerplate',
  server: {
    port: process.env.PORT || 4100,
    staticDir: './dist',
    delayInitMiddleware: false,
    cookie: {
      secrets: ['insecure plain text', 'insecure secret here'],
    },
    noSecurityHeadersRoutes: {
      '/api-gateway/': true,
      '/api/': true,
    },
    noCsrfRoutes: {
      '/api-gateway/': true,
      '/api/': true,
    },
  },
  ssm: {
    enabled: false,
  },
  gateways: {
    logger: {
      enabled: true,
      level: 'debug',
    },
  },
  analytics: {
    googleTid: 'TODO: replace with your googleTid',
  },
  csp: {
    'default-src': [
      'none',
    ],
    'manifest-src': [
      'self',
    ],
    'style-src': [
      'self',
      'unsafe-inline',
      'https://fonts.googleapis.com/css',
      'https://use.fontawesome.com/releases/v5.0.13/',
      'https://translate.googleapis.com/',
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/',
      'https://checkout.stripe.com/v3/',
    ],
    'frame-src': [
      'https://www.slideshare.net/',
      'https://checkout.stripe.com/',
    ],
    'connect-src': [
      'self',
      'https://checkout.stripe.com/api/',
    ],
    'child-src': [
      'self',
    ],
    'font-src': [
      'self',
      'https://fonts.gstatic.com/',
      'https://use.fontawesome.com/releases/v5.0.13/',
      'data: https://use.fontawesome.com/releases/v5.0.13/',
    ],
    'img-src': [
      '*',
    ],
    'media-src': [
      'self',
    ],
    'object-src': [
      'self',
    ],
    'script-src': [
      'self',
      'https://www.google-analytics.com/',
      'https://translate.google.com/',
      'https://translate.googleapis.com/',
      'https://cdn.jsdelivr.net/particles.js/2.0.0/',
      'https://checkout.stripe.com/checkout.js',
    ],
  },
  stripe: {
    stripePubKey: 'pk_test_1yMRIhidzZOrBJ84mJNHqa4O',
    stripePriKey: 'sk_test_5pGpbrSWDfkXbg1XoOOqQzQy',
  },
  apiGatewayUrl: 'http://localhost:4006/api-gateway/',
};
