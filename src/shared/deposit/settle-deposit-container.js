import {connect} from 'inferno-redux';
import {SettleDeposit} from './settle-deposit';
import * as actions from './deposit-actions';

export const SettleDepositContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.settleDeposit || null,
    };
  },
  dispatch => ({
    fetchSettleDepositId: data => dispatch(actions.fetchSettleDepositId(data)),
  }),
)(SettleDeposit);
