export default function reducer(state = {
  statistic: null,
  price: null,
  fetching: false,
  error: null,
}, action) {
  switch (action.type) {
  case 'FETCH_COIN_STATISTIC': {
    return {...state, fetching: true};
  }
  case 'FETCH_COIN_STATISTIC_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_COIN_STATISTIC_SUCCESS': {
    return {
      ...state,
      fetching: false,
      statistic: action.payload.statistic,
    };
  }
  case 'FETCH_COIN_PRICE': {
    return {...state, fetchingPrice: true};
  }
  case 'FETCH_COIN_PRICE_FAIL': {
    return {...state, fetchingPrice: false, error: action.payload.error};
  }
  case 'FETCH_COIN_PRICE_SUCCESS': {
    return {
      ...state,
      fetchingPrice: false,
      price: action.payload.price,
    };
  }
  default: {
    return state;
  }
  }
}
