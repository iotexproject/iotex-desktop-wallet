import {NAV} from '../site-url';

export function formatBlockHistory(seconds) {
  if (seconds === 0) {
    return 0;
  }
  const days = Math.floor(seconds / (3600 * 24));
  seconds = seconds % (3600 * 24);
  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}′${seconds}″`;
  }

  return `${hours}h ${minutes}′${seconds}″`;
}

export function setNavRoutes(server) {
  const {gateways: {iotexCore, coinmarketcap}} = server;

  async function getStatisticApi(ctx, next) {
    try {
      const statistic = await iotexCore.getCoinStatistic();
      const block1 = await iotexCore.getLastBlocksByRange(1, 1);
      const latestBlock = await iotexCore.getLastBlocksByRange(statistic.height, 1);
      statistic.bh = formatBlockHistory(
        block1[0] && latestBlock[0] && latestBlock[0].height >= block1[0].height ?
          latestBlock[0].timestamp - block1[0].timestamp : 0
      );

      ctx.body = {ok: true, statistic};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_STATISTIC', message: 'nav.error.statistic'}};
    }
  }

  async function getCoinPrice(ctx, next) {
    try {
      const response = await coinmarketcap.fetchCoinPrice();
      const d = response.data[0];
      const price = {usd: d.price_usd, eth: d.price_eth};
      ctx.body = {ok: true, price};
    } catch (error) {
      ctx.body = {ok: false, error: {code: 'FAIL_GET_COIN_PRICE', message: 'nav.error.coin'}};
    }
  }

  server.post('getStatistic', NAV.STATISTIC, getStatisticApi);
  server.post('getCoinPrice', NAV.PRICE, getCoinPrice);
}
