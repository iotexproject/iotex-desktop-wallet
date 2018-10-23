// @flow
import test from 'ava';

import reducer from '../execution-reducer';

test('Execution - FETCH_EXECUTION', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_EXECUTION',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_EXECUTION');
});

test('Execution - FETCH_EXECUTION_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_EXECUTION_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_EXECUTION_FAIL');
  t.is(result.error, null, 'FETCH_EXECUTION_FAIL');
});

test('Execution - FETCH_EXECUTION_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_EXECUTION_SUCCESS',
    payload: {
      execution: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_EXECUTION_SUCCESS');
  t.is(result.execution, null, 'FETCH_EXECUTION_SUCCESS');
});
