import axios from 'axios';

export class CoinMarketCap {
  fetchCoinPrice() {
    // there are usd, btc and eth prices
    const url = 'https://api.coinmarketcap.com/v1/ticker/iotex/?convert=ETH';
    return axios.get(url);
  }
}
