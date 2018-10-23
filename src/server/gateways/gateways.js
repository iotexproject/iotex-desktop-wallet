import {logger} from '../../lib/integrated-gateways/logger';
import {IotexCoreExplorer} from './iotex-core';
import {CoinMarketCap} from './coin-market-cap';
import {WalletCore} from './wallet-core/wallet-core';

export function setGateways(server) {
  server.gateways = server.gateways || {};
  server.gateways.iotexCore = new IotexCoreExplorer(server.config.gateways.iotexCore);
  server.gateways.coinmarketcap = new CoinMarketCap();
  server.gateways.walletCore = new WalletCore(server.config.gateways.walletCore);

  server.gateways.iotexCore.init()
    .catch(e => logger.error('failed to init gateways', {err: e}));
}
