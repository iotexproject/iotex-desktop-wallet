export default function reducer(state = {
  createDeposit: null,
  fetching: true,
  error: null,
}, action) {
  switch (action.type) {
  case 'FETCH_CREATE_DEPOSIT': {
    return {...state, fetching: true};
  }
  case 'FETCH_CREATE_DEPOSIT_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_CREATE_DEPOSIT_SUCCESS': {
    return {
      ...state,
      fetching: false,
      createDeposit: action.payload.createDeposit,
    };
  }
  default: {
    return state;
  }
  }
}
