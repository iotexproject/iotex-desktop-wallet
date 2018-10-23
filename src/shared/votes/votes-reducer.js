export default function reducer(state = {
  items: null,
  fetching: true,
  error: null,
  offset: 0,
  count: 10,
  tip: 0,
}, action) {
  switch (action.type) {
  case 'FETCH_VOTES': {
    return {...state, fetching: true};
  }
  case 'FETCH_VOTES_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_VOTES_SUCCESS': {
    return {
      ...state,
      fetching: false,
      items: action.payload.votes,
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
