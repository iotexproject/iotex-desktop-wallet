export default function reducer(state = {
  execution: null,
  fetching: true,
  error: null,
}, action) {
  switch (action.type) {
  case 'FETCH_EXECUTION': {
    return {...state, fetching: true, receipt: null};
  }
  case 'FETCH_EXECUTION_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_EXECUTION_SUCCESS': {
    return {
      ...state,
      fetching: false,
      execution: action.payload.execution,
    };
  }
  case 'FETCH_EXECUTION_RECEIPT': {
    return {...state, fetchingReceipt: true, receipt: null};
  }
  case 'FETCH_EXECUTION_RECEIPT_FAIL': {
    return {...state, receiptError: action.payload.error, fetchingReceipt: false};
  }
  case 'FETCH_EXECUTION_RECEIPT_SUCCESS': {
    return {
      ...state,
      receipt: action.payload.receipt,
      fetchingReceipt: false,
    };
  }
  case 'FETCH_CONTRACT_EXECUTIONS': {
    return {
      ...state,
      executions: {
        ...state.executions,
        fetching: true,
      },
    };
  }
  case 'FETCH_CONTRACT_EXECUTIONS_FAIL': {
    return {
      ...state,
      executions: {
        ...state.executions,
        fetching: false,
        error: action.payload.error,
      },
    };
  }
  case 'FETCH_CONTRACT_EXECUTIONS_SUCCESS': {
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
  default: {
    return state;
  }
  }
}
