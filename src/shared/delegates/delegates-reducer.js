export default function reducer(state = {
  fetching: true,
  error: null,
  items: [],
  sort_count: 0,
}, action) {
  switch (action.type) {
  case 'FETCH_DELEGATES': {
    return {...state, fetching: true};
  }
  case 'FFETCH_DELEGATES_FAIL': {
    return {...state, fetching: false, error: action.payload.error};
  }
  case 'FETCH_DELEGATES_SUCCESS': {
    const candidates = action.payload.delegates.candidates;

    return {
      ...state,
      fetching: false,
      items: candidates.sort((a, b) => sortCandidates('address', a, b, state.sort_count)),
    };
  }
  case 'SORT_BY_ADDRESS': {
    const copy = [...state.items];
    const items = copy.sort((a, b) => sortCandidates('address', a, b, state.sort_count));

    return {
      ...state,
      items,
      sort_count: state.sort_count + 1,
    };
  }
  default: {
    return state;
  }
  }
}

function sortCandidates(field, a, b, count) {
  if (a[field] < b[field]) {
    return count % 2 === 0 ? -1 : 1;
  }
  if (a[field] > b[field]) {
    return count % 2 === 0 ? 1 : 1;
  }
  return 0;
}
