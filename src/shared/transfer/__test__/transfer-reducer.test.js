// @flow
import test from 'ava';

import reducer from '../transfer-reducer';

test('Transfer - FETCH_TRANSFER', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_TRANSFER',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_TRANSFER');
});

test('Transfer - FETCH_TRANSFER_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_TRANSFER_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_TRANSFER_FAIL');
  t.is(result.error, null, 'FETCH_TRANSFER_FAIL');
});

test('Transfer - FETCH_TRANSFER_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_TRANSFER_SUCCESS',
    payload: {
      transfer: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_TRANSFER_SUCCESS');
  t.is(result.transfer, null, 'FETCH_TRANSFER_SUCCESS');
});
