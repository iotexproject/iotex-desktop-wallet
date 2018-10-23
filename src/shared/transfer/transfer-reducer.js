export default function reducer(state = {
  transfer: null,
  fetching: true,
  error: null,
}, action) {
  switch (action.type) {
  case 'FETCH_TRANSFER': {
    return {...state, fetching: true};
  }
  case 'FETCH_TRANSFER_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_TRANSFER_SUCCESS': {
    return {
      ...state,
      fetching: false,
      transfer: action.payload.transfer,
    };
  }
  default: {
    return state;
  }
  }
}
