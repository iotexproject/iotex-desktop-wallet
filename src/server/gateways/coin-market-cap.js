import axios from 'axios';

export class CoinMarketCap {
  fetchCoinPrice() {
    const url = 'https://api.coinmarketcap.com/v1/ticker/iotex/';
    return axios.get(url);
  }
}
