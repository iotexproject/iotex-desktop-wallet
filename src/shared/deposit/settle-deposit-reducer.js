export default function reducer(state = {
  settleDeposit: null,
  fetching: true,
  error: null,
}, action) {
  switch (action.type) {
  case 'FETCH_SETTLE_DEPOSIT': {
    return {...state, fetching: true};
  }
  case 'FETCH_SETTLE_DEPOSIT_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_SETTLE_DEPOSIT_SUCCESS': {
    return {
      ...state,
      fetching: false,
      settleDeposit: action.payload.settleDeposit,
    };
  }
  default: {
    return state;
  }
  }
}
