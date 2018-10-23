// @flow
import test from 'ava';

import reducer from '../vote-reducer';

test('Vote - FETCH_VOTE', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_VOTE',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_VOTE');
});

test('Vote - FETCH_VOTE_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_VOTE_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_VOTE_FAIL');
  t.is(result.error, null, 'FETCH_VOTE_FAIL');
});

test('Vote - FETCH_VOTE_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_VOTE_SUCCESS',
    payload: {
      vote: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_VOTE_SUCCESS');
  t.is(result.vote, null, 'FETCH_VOTE_SUCCESS');
});
