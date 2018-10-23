import {connect} from 'inferno-redux';

import * as actions from './executions-actions';
import {Executions} from './executions';

export const ExecutionsContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.executions,
      width: state.app.width,
      statistic: state.nav.statistic,
    };
  },
  dispatch => ({
    fetchExecutions: data => dispatch(actions.fetchExecutions(data)),
  }),
)(Executions);
