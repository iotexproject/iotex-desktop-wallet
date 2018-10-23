export default function reducer(state = {
  vote: null,
  fetching: true,
  error: null,
}, action) {
  switch (action.type) {
  case 'FETCH_VOTE': {
    return {...state, fetching: true};
  }
  case 'FETCH_VOTE_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_VOTE_SUCCESS': {
    return {
      ...state,
      fetching: false,
      vote: action.payload.vote,
    };
  }
  default: {
    return state;
  }
  }
}
