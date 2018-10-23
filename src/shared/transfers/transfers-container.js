import {connect} from 'inferno-redux';

import * as actions from './transfers-actions';
import {Transfers} from './transfers';

export const TransfersContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.transfers,
      width: state.app.width,
      statistic: state.nav.statistic,
    };
  },
  dispatch => ({
    fetchTransfers: data => dispatch(actions.fetchTransfers(data)),
  }),
)(Transfers);
