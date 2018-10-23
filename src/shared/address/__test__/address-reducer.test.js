// @flow
import test from 'ava';

import reducer from '../address-reducer';

test('Address - FETCH_ADDRESS', t => {
  const state = {
    fetchingAddress: false,
  };
  const action = {
    type: 'FETCH_ADDRESS',
  };

  const result = reducer(state, action);
  t.is(result.fetching, true, 'FETCH_ADDRESS');
});

test('Address - FETCH_ADDRESS_FAIL', t => {
  const state = {
    fetchingAddress: false,
  };
  const action = {
    type: 'FETCH_ADDRESS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_ADDRESS_FAIL');
  t.is(result.error, null, 'FETCH_ADDRESS_FAIL');
});

test('Address - FETCH_ADDRESS_SUCCESS', t => {
  const state = {
    fetchingAddress: false,
  };
  const action = {
    type: 'FETCH_ADDRESS_SUCCESS',
    payload: {
      address: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.fetching, false, 'FETCH_ADDRESS_SUCCESS');
  t.is(result.address, null, 'FETCH_ADDRESS_SUCCESS');
});

test('Address - FETCH_ADDRESS_TRANSFERS', t => {
  const state = {
    transfers: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_ADDRESS_TRANSFERS',
  };

  const result = reducer(state, action);
  t.is(result.transfers.fetching, true, 'FETCH_ADDRESS_TRANSFERS');
});

test('Address - FETCH_ADDRESS_TRANSFERS_FAIL', t => {
  const state = {
    transfers: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_ADDRESS_TRANSFERS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.transfers.fetching, false, 'FETCH_ADDRESS_TRANSFERS_FAIL');
  t.is(result.transfers.error, null, 'FETCH_ADDRESS_TRANSFERS_FAIL');
});

test('Address - FETCH_ADDRESS_TRANSFERS_SUCCESS', t => {
  const state = {
    transfers: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_ADDRESS_TRANSFERS_SUCCESS',
    payload: {
      transfers: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.transfers.fetching, false, 'FETCH_ADDRESS_TRANSFERS_SUCCESS');
  t.is(result.transfers.items, null, 'FETCH_ADDRESS_TRANSFERS_SUCCESS');
});

test('Address - FETCH_ADDRESS_VOTERS', t => {
  const state = {
    voters: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_ADDRESS_VOTERS',
  };

  const result = reducer(state, action);
  t.is(result.voters.fetching, true, 'FETCH_ADDRESS_VOTERS');
});

test('Address - FETCH_ADDRESS_VOTERS_FAIL', t => {
  const state = {
    voters: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_ADDRESS_VOTERS_FAIL',
    payload: {
      error: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.voters.fetching, false, 'FETCH_ADDRESS_VOTERS_FAIL');
  t.is(result.voters.error, null, 'FETCH_ADDRESS_VOTERS_FAIL');
});

test('Address - FETCH_ADDRESS_VOTERS_SUCCESS', t => {
  const state = {
    voters: {
      fetching: false,
    },
  };
  const action = {
    type: 'FETCH_ADDRESS_VOTERS_SUCCESS',
    payload: {
      voters: null,
    },
  };

  const result = reducer(state, action);
  t.is(result.voters.fetching, false, 'FETCH_ADDRESS_VOTERS_SUCCESS');
  t.is(result.voters.items, null, 'FETCH_ADDRESS_VOTERS_SUCCESS');
});
