// eslint-disable-next-line complexity
export default function reducer(state = {
  address: null,
  fetching: true,
  error: null,
  executions: {
    fetching: true,
    items: [],
    error: null,
    offset: 0,
    count: 10,
  },
  transfers: {
    fetching: true,
    items: [],
    error: null,
    offset: 0,
    count: 10,
  },
  voters: {
    fetching: true,
    items: [],
    error: null,
    offset: 0,
    count: 10,
  },
  settleDeposits: {
    fetching: true,
    items: [],
    error: null,
    offset: 0,
    count: 10,
  },
  createDeposits: {
    fetching: true,
    items: [],
    error: null,
    offset: 0,
    count: 10,
  },
}, action) {
  switch (action.type) {
  case 'FETCH_ADDRESS': {
    return {...state, fetching: true};
  }
  case 'FETCH_ADDRESS_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_ADDRESS_SUCCESS': {
    return {
      ...state,
      fetching: false,
      address: action.payload.address,
    };
  }
  case 'FETCH_ADDRESS_TRANSFERS': {
    return {
      ...state,
      transfers: {
        ...state.transfers,
        fetching: true,
      },
    };
  }
  case 'FETCH_ADDRESS_TRANSFERS_FAIL': {
    return {
      ...state,
      transfers: {
        ...state.transfers,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_ADDRESS_TRANSFERS_SUCCESS': {
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
  case 'FETCH_ADDRESS_EXECUTIONS': {
    return {
      ...state,
      executions: {
        ...state.executions,
        fetching: true,
      },
    };
  }
  case 'FETCH_ADDRESS_EXECUTIONS_FAIL': {
    return {
      ...state,
      executions: {
        ...state.executions,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_ADDRESS_EXECUTIONS_SUCCESS': {
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
  case 'FETCH_ADDRESS_VOTERS': {
    return {
      ...state,
      voters: {
        ...state.voters,
        fetching: true,
      },
    };
  }
  case 'FETCH_ADDRESS_VOTERS_FAIL': {
    return {
      ...state,
      voters: {
        ...state.voters,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_ADDRESS_VOTERS_SUCCESS': {
    return {
      ...state,
      voters: {
        ...state.voters,
        fetching: false,
        items: action.payload.voters,
        offset: action.payload.offset,
        count: action.payload.count,
      },
    };
  }
  default: {
    return reducerMore(state, action);
  }
  }
}

function reducerMore(state, action) {
  switch (action.type) {
  case 'FETCH_ADDRESS_SETTLE_DEPOSITS': {
    return {
      ...state,
      settleDeposits: {
        ...state.settleDeposits,
        fetching: true,
      },
    };
  }
  case 'FETCH_ADDRESS_SETTLE_DEPOSITS_FAIL': {
    return {
      ...state,
      settleDeposits: {
        ...state.settleDeposits,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_ADDRESS_SETTLE_DEPOSITS_SUCCESS': {
    return {
      ...state,
      settleDeposits: {
        ...state.settleDeposits,
        fetching: false,
        items: action.payload.settleDeposits,
        offset: action.payload.offset,
        count: action.payload.count,
      },
    };
  }
  case 'FETCH_ADDRESS_CREATE_DEPOSITS': {
    return {
      ...state,
      createDeposits: {
        ...state.createDeposits,
        fetching: true,
      },
    };
  }
  case 'FETCH_ADDRESS_CREATE_DEPOSITS_FAIL': {
    return {
      ...state,
      createDeposits: {
        ...state.createDeposits,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_ADDRESS_CREATE_DEPOSITS_SUCCESS': {
    return {
      ...state,
      createDeposits: {
        ...state.createDeposits,
        fetching: false,
        items: action.payload.createDeposits,
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
