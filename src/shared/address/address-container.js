import {connect} from 'inferno-redux';

import * as actions from '../address/address-actions';
import {Address} from './address';

export const AddressContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.address,
      width: state.app.width,
    };
  },
  dispatch => ({
    fetchAddressId: data => dispatch(actions.fetchAddressId(data)),
    fetchAddressExecutionsId: data => dispatch(actions.fetchAddressExecutionsId(data)),
    fetchAddressTransfersId: data => dispatch(actions.fetchAddressTransfersId(data)),
    fetchAddressVotersId: data => dispatch(actions.fetchAddressVotersId(data)),
  }),
)(Address);
