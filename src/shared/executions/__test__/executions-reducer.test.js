// @flow
import test from 'ava';

import reducer from '../executions-reducer';

test('Executions - FETCH_EXECUTIONS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_EXECUTIONS',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_EXECUTIONS');
});

test('Executions - FETCH_EXECUTIONS_FAIL', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_EXECUTIONS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_EXECUTIONS_FAIL');
  t.is(result.error, null, 'FETCH_EXECUTIONS_FAIL');
});

test('Executions - FETCH_EXECUTIONS_SUCCESS', t => {
  const state = {
    fetching: false,
  };
  const action = {
    type: 'FETCH_EXECUTIONS_SUCCESS',
    payload: {
      executions: null,
      offset: null,
      count: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_EXECUTIONS_SUCCESS');
  t.is(result.items, null, 'FETCH_EXECUTIONS_SUCCESS');
  t.is(result.offset, null, 'FETCH_EXECUTIONS_SUCCESS');
  t.is(result.count, null, 'FETCH_EXECUTIONS_SUCCESS');
});
