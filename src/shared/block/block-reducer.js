// eslint-disable-next-line complexity
export default function reducer(state = {
  block: null,
  fetching: true,
  error: null,
  transfers: {
    items: [],
    fetching: true,
    error: null,
    offset: 0,
    count: 10,
  },
  executions: {
    items: [],
    fetching: true,
    error: null,
    offset: 0,
    count: 10,
  },
  votes: {
    items: [],
    fetching: true,
    error: null,
    offset: 0,
    count: 10,
  },
}, action) {
  switch (action.type) {
  case 'FETCH_BLOCK': {
    return {...state, fetching: true};
  }
  case 'FETCH_BLOCK_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_BLOCK_SUCCESS': {
    return {
      ...state,
      fetching: false,
      block: action.payload.block,
    };
  }
  case 'FETCH_BLOCK_EXECUTIONS': {
    return {
      ...state,
      executions: {
        ...state.executions,
        fetching: true,
      },
    };
  }
  case 'FETCH_BLOCK_EXECUTIONS_FAIL': {
    return {
      ...state,
      executions: {
        ...state.executions,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_BLOCK_EXECUTIONS_SUCCESS': {
    return {
      ...state,
      executions: {
        ...state.executions,
        fetching: false,
        items: action.payload.executions,
        offset: action.payload.offset,
        count: action.payload.count,
      },
    };
  }
  case 'FETCH_BLOCK_TRANSFERS': {
    return {
      ...state,
      transfers: {
        ...state.transfers,
        fetching: true,
      },
    };
  }
  case 'FETCH_BLOCK_TRANSFERS_FAIL': {
    return {
      ...state,
      transfers: {
        ...state.transfers,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_BLOCK_TRANSFERS_SUCCESS': {
    return {
      ...state,
      transfers: {
        ...state.transfers,
        fetching: false,
        items: action.payload.transfers,
        offset: action.payload.offset,
        count: action.payload.count,
      },
    };
  }
  case 'FETCH_BLOCK_VOTES': {
    return {
      ...state,
      votes: {
        ...state.votes,
        fetching: true,
      },
    };
  }
  case 'FETCH_BLOCK_VOTES_FAIL': {
    return {
      ...state,
      votes: {
        ...state.votes,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_BLOCK_VOTES_SUCCESS': {
    return {
      ...state,
      votes: {
        ...state.votes,
        fetching: false,
        items: action.payload.votes,
        offset: action.payload.offset,
        count: action.payload.count,
      },
    };
  }
  default: {
    return state;
  }
  }
}
