import {connect} from 'inferno-redux';

import {App} from './app';

export const AppContainer = connect(
  function mapStateToProps(state) {
    return {
      googleTid: state.base.analytics.googleTid,
      fetching: state.app.fetching,
      width: state.app.width,
      status: state.app.status,
    };
  },
  dispatch => ({
    updateWidth: data => dispatch(updateWidth(data)),
  }),
)(App);

function updateWidth(w) {
  return dispatch => {
    dispatch({type: 'UPDATE_WIDTH', payload: w});
  };
}

export default function reducer(state = {
  width: 0,
  status: 'LIVE',
  fetching: false,
}, action) {
  switch (action.type) {
  case 'UPDATE_WIDTH': {
    return {...state, width: action.payload};
  }
  case 'FETCHING': {
    return {...state, fetching: action.payload};
  }
  case 'LIVE': {
    return {...state, status: 'LIVE'};
  }
  case 'OFFLINE': {
    return {...state, status: 'OFFLINE'};
  }
  default: {
    return {...state};
  }
  }
}
