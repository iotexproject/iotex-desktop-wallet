// @flow
import test from 'ava';
import {Server} from '../../../lib/server';

import reducer from '../consensus-metrics-reducer';
import {setConsensusMetricsRoutes} from '../consensus-metrics-handler';
import {fetchConsensusMetrics} from '../consensus-metrics-actions';

test('FETCH_CONSENSUS_METRICS', t => {
  const state = {
    fetching: true,
    error: null,
    metrics: null,
  };
  const action = {
    type: 'FETCH_CONSENSUS_METRICS',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_CONSENSUS_METRICS');
});

test('FETCH_CONSENSUS_METRICS_FAIL', t => {
  const state = {
    fetching: true,
    error: null,
    metrics: null,
  };
  const action = {
    type: 'FETCH_CONSENSUS_METRICS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_CONSENSUS_METRICS_FAIL');
  t.is(result.error, null, 'FETCH_CONSENSUS_METRICS_FAIL');
});

test('FETCH_CONSENSUS_METRICS_SUCCESS', t => {
  const state = {
    fetching: true,
    error: null,
    metrics: null,
  };
  const action = {
    type: 'FETCH_CONSENSUS_METRICS_SUCCESS',
    payload: {
      consensusMetrics: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_CONSENSUS_METRICS_SUCCESS');
  t.is(result.metrics, null, 'FETCH_CONSENSUS_METRICS_SUCCESS');
});

test('handler', t => {
  setConsensusMetricsRoutes(new Server());
  t.is(null, null, 'handler');
});

test('actions', t => {
  fetchConsensusMetrics();
  t.is(null, null, 'handler');
});
