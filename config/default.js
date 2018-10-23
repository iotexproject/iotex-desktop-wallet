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
};
