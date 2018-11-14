import {RpcMethods, HttpProvider} from 'iotex-client-js';
import config from 'config';
import {logger} from '../../lib/integrated-gateways/logger';
import {IotexCoreExplorer} from './iotex-core';
import {CoinMarketCap} from './coin-market-cap';
import {WalletCore} from './wallet-core/wallet-core';
import {CrossChain} from './cross-chains';

export function setGateways(server) {
  server.gateways = server.gateways || {};
  server.gateways.iotexCore = new IotexCoreExplorer(server.config.gateways.iotexCore);
  server.gateways.coinmarketcap = new CoinMarketCap();
  server.gateways.walletCore = new WalletCore(server.config.gateways.walletCore);
  server.gateways.crossChain = new CrossChain(config.get('chains'));
  server.gateways.iotxRpcMethods = new RpcMethods(new HttpProvider(server.config.gateways.iotexCore.serverUrl));

  server.gateways.iotexCore.init()
    .catch(e => logger.error('failed to init gateways', {err: e}));
}
