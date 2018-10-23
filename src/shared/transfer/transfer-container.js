import {connect} from 'inferno-redux';

import {Transfer} from './transfer';
import * as actions from './transfer-actions';

export const TransferContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.transfer || null,
    };
  },
  dispatch => ({
    fetchTransferId: data => dispatch(actions.fetchTransferId(data)),
  }),
)(Transfer);
