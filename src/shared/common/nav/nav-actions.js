/* eslint-disable no-console,no-undef */
import {jsonCall} from '../actions';
import {NAV} from '../site-url';

export function fetchCoinStatistic() {
  return jsonCall([], 'FETCH_COIN_STATISTIC', NAV.STATISTIC);
}

export function fetchCoinPrice() {
  return jsonCall([], 'FETCH_COIN_PRICE', NAV.PRICE);
}
