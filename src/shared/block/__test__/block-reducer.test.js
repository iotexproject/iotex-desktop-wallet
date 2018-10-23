// @flow
import test from 'ava';

import reducer from '../block-reducer';

test('Block - FETCH_BLOCK', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_BLOCK',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_BLOCK');
});

test('Block - FETCH_BLOCK_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_BLOCK_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_BLOCK_FAIL');
  t.is(result.error, null, 'FETCH_BLOCK_FAIL');
});

test('Block - FETCH_BLOCK_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_BLOCK_SUCCESS',
    payload: {
      block: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_BLOCK_SUCCESS');
  t.is(result.block, null, 'FETCH_BLOCK_SUCCESS');
});

test('Block - FETCH_BLOCK_TRANSFERS', t => {
  const state = {
    transfers: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_BLOCK_TRANSFERS',
  };

  const result = reducer(state, action);
  t.is(result.transfers.fetching, true, 'FETCH_BLOCK_TRANSFERS');
});

test('Block - FETCH_BLOCK_TRANSFERS_FAIL', t => {
  const state = {
    transfers: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_BLOCK_TRANSFERS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.transfers.fetching, false, 'FETCH_BLOCK_TRANSFERS_FAIL');
  t.is(result.transfers.error, null, 'FETCH_BLOCK_TRANSFERS_FAIL');
});

test('Block - FETCH_BLOCK_TRANSFERS_SUCCESS', t => {
  const state = {
    transfers: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_BLOCK_TRANSFERS_SUCCESS',
    payload: {
      transfers: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.transfers.fetching, false, 'FETCH_BLOCK_TRANSFERS_SUCCESS');
  t.is(result.transfers.items, null, 'FETCH_BLOCK_TRANSFERS_SUCCESS');
});
