import axios from "axios";

export function fetchCoinPrice(){
  const url = "https://api.coinmarketcap.com/v1/ticker/iotex/?convert=ETH";
  return axios.get(url);
}

