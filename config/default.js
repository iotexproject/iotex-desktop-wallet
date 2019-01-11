/* eslint-disable no-process-env */
import process from 'global/process';

require('dotenv').config();

module.exports = {
  project: 'iotex-explorer',
  env: 'development',
  server: {
    protocol: 'http:',
    host: 'localhost',
    port: process.env.PORT || 4004,
    staticDir: './dist',
    routePrefix: '/',
  },
  gateways: {
    logger: {
      enabled: true,
      baseDir: '/var/log/',
      topicName: 'iotex-explorer',
      level: 'debug',
      kafka: {
        leafHost: 'localhost',
        leafPort: 9093,
      },
    },
    iotexCore: {
      serverUrl: process.env.IOTEX_CORE_URL || 'http://localhost:14004/',
    },
    walletCore: {
      serverUrl: process.env.IOTEX_WALLET_URL || 'localhost:42124',
    },
  },
  analytics: {
    googleTid: process.env.GOOGLE_TID || 'UA-XXXXXXXXX-1',
  },
  chains: JSON.parse(process.env.CHAINS || '[{"id":1,"name":"mainchain","url":"http://localhost:4004/"},{"id":2,"name":"subchain","url":"http://localhost:4005/"}]'),
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
      'http://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css',
      'http://fonts.googleapis.com/css',
      'http://use.fontawesome.com/releases/v5.0.9/css/all.css',
    ],
    'frame-src': [
    ],
    'connect-src': [
      'self',
    ],
    'child-src': [
      'self',
    ],
    'font-src': [
      'self',
      'data:',
      'https://fonts.gstatic.com/s/sharetech/',
      'https://use.fontawesome.com/releases/v5.0.9/webfonts/',
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
      'https://use.fontawesome.com/releases/v5.0.9/js/all.js',
      'https://www.google-analytics.com/analytics.js',
      'https://d3js.org/d3.v4.min.js',
      'https://ethereum.github.io/solc-bin/bin/',
    ],
  },
};
