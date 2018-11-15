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
  settlerWallet: {
    publicKey: 'd857218c61a15a71f9ac313d954b12f4a0748d88840eb3b6b2cffa727e86f73fe57ade02d65e80df2078b5de771e552a7b264450b3c9daebb42e96c80c5e6e708e8f1105f11bdc03',
    privateKey: '2a67356f088788959d4fb2754d15e8bd4b30252dede329609c8c604504fda1a7c87d5d00',
    rawAddress: 'io1qypqqqqqxqhxv6t77uqgkv8r7drr9cdkm7kue5wrcdjwwq',
  },
};
