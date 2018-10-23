import {connect} from 'inferno-redux';

import {Execution} from './execution';
import * as actions from './execution-actions';

export const ExecutionContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.execution || null,
    };
  },
  dispatch => ({
    fetchExecutionId: data => dispatch(actions.fetchExecutionId(data)),
    fetchExecutionReceipt: data => dispatch(actions.fetchExecutionReceipt(data)),
    fetchExecutions: data => dispatch(actions.fetchExecutions(data)),
  }),
)(Execution);
