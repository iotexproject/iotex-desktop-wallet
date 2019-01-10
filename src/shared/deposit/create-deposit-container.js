import {connect} from 'inferno-redux';
import {CreateDeposit} from './create-deposit';
import * as actions from './deposit-actions';

export const CreateDepositContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.createDeposit || null,
    };
  },
  dispatch => ({
    fetchCreateDepositId: data => dispatch(actions.fetchCreateDepositId(data)),
  }),
)(CreateDeposit);
