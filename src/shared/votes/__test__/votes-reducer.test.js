// @flow
import test from 'ava';

import reducer from '../votes-reducer';

test('Votes - FETCH_VOTES', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_VOTES',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_VOTES');
});

test('Votes - FETCH_VOTES_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_VOTES_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_VOTES_FAIL');
  t.is(result.error, null, 'FETCH_VOTES_FAIL');
});

test('Votes - FETCH_VOTES_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_VOTES_SUCCESS',
    payload: {
      votes: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_VOTES_SUCCESS');
  t.is(result.items, null, 'FETCH_VOTES_SUCCESS');
});
