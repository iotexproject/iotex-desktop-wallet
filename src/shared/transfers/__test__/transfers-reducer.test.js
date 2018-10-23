// @flow
import test from 'ava';

import reducer from '../transfers-reducer';

test('Transfers - FETCH_TRANSFERS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_TRANSFERS',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_TRANSFERS');
});

test('Transfers - FETCH_TRANSFERS_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_TRANSFERS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_TRANSFERS_FAIL');
  t.is(result.error, null, 'FETCH_TRANSFERS_FAIL');
});

test('Transfers - FETCH_TRANSFERS_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_TRANSFERS_SUCCESS',
    payload: {
      transfers: null,
      offset: null,
      count: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_TRANSFERS_SUCCESS');
  t.is(result.items, null, 'FETCH_TRANSFERS_SUCCESS');
  t.is(result.offset, null, 'FETCH_TRANSFERS_SUCCESS');
  t.is(result.count, null, 'FETCH_TRANSFERS_SUCCESS');
});
