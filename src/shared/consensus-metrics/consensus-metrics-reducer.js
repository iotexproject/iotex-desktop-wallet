export default function reducer(state = {
  fetching: true,
  error: null,
  metrics: null,
}, action) {
  switch (action.type) {
  case 'FETCH_CONSENSUS_METRICS': {
    return {
      ...state,
      fetching: true,
    };
  }
  case 'FETCH_CONSENSUS_METRICS_FAIL': {
    return {
      ...state,
      fetching: false,
      error: action.payload.error,
    };
  }
  case 'FETCH_CONSENSUS_METRICS_SUCCESS': {
    return {
      ...state,
      fetching: false,
      metrics: action.payload.consensusMetrics,
    };
  }
  default: {
    return state;
  }
  }
}
