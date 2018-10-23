import {connect} from 'inferno-redux';

import {Delegates} from './delegates';
import * as actions from './delegates-actions';

export const DelegatesContainer = connect(
  function mapStateToProps(state) {
    return {
      delegates: state.delegates,
      width: state.app.width,
    };
  },
  dispatch => ({
    fetchDelegates: data => dispatch(actions.fetchDelegates(data)),
    sortAddress: () => dispatch({type: 'SORT_BY_ADDRESS'}),
  }),
)(Delegates);
