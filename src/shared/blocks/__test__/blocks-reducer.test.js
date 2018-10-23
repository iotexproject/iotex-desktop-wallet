// @flow
import test from 'ava';

import reducer from '../blocks-reducer';

test('Blocks - FETCH_BLOCKS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_BLOCKS',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_BLOCKS');
});

test('Blocks - FETCH_BLOCKS_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_BLOCKS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_BLOCKS_FAIL');
  t.is(result.error, null, 'FETCH_BLOCKS_FAIL');
});

test('Blocks - FETCH_BLOCKS_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_BLOCKS_SUCCESS',
    payload: {
      blocks: null,
      offset: 0,
      count: 0,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_BLOCKS_SUCCESS');
  t.is(result.items, null, 'FETCH_BLOCKS_SUCCESS');
  t.is(result.offset, 0, 'FETCH_BLOCKS_SUCCESS');
  t.is(result.count, 0, 'FETCH_BLOCKS_SUCCESS');
});
