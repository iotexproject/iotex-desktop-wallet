// @flow
import test from 'ava';

import reducer from '../nav-reducer';

test('Nav - FETCH_COIN_STATISTIC', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_COIN_STATISTIC',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_COIN_STATISTIC');
});

test('Nav - FETCH_COIN_STATISTIC_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_COIN_STATISTIC_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_COIN_STATISTIC_FAIL');
  t.is(result.error, null, 'FETCH_COIN_STATISTIC_FAIL');
});

test('Nav - FETCH_COIN_STATISTIC_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_COIN_STATISTIC_SUCCESS',
    payload: {
      statistic: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_COIN_STATISTIC_SUCCESS');
  t.is(result.statistic, null, 'FETCH_COIN_STATISTIC_SUCCESS');
});

test('Nav - FETCH_COIN_PRICE', t => {
  const state = {
    fetchingPrice: false,
  };
  const action = {
    type: 'FETCH_COIN_PRICE',
  };

  const result = reducer(state, action);
  t.is(result.fetchingPrice, true, 'FETCH_COIN_PRICE');
});

test('Nav - FETCH_COIN_PRICE_FAIL', t => {
  const state = {
    fetchingPrice: false,
  };
  const action = {
    type: 'FETCH_COIN_PRICE_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetchingPrice, false, 'FETCH_COIN_PRICE_FAIL');
  t.is(result.error, null, 'FETCH_COIN_PRICE_FAIL');
});

test('Nav - FETCH_COIN_PRICE_SUCCESS', t => {
  const state = {
    fetchingPrice: false,
  };
  const action = {
    type: 'FETCH_COIN_PRICE_SUCCESS',
    payload: {
      price: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetchingPrice, false, 'FETCH_COIN_PRICE_SUCCESS');
  t.is(result.price, null, 'FETCH_COIN_PRICE_SUCCESS');
});
