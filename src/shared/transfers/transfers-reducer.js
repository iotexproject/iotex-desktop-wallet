export default function reducer(state = {
  items: null,
  fetching: true,
  error: null,
  offset: 0,
  count: 10,
  tip: 0,
}, action) {
  switch (action.type) {
  case 'FETCH_TRANSFERS': {
    return {...state, fetching: true};
  }
  case 'FETCH_TRANSFERS_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_TRANSFERS_SUCCESS': {
    return {
      ...state,
      fetching: false,
      items: action.payload.transfers,
      offset: action.payload.offset,
      count: action.payload.count,
      tip: action.payload.tip,
    };
  }
  default: {
    return state;
  }
  }
}
