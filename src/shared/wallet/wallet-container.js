import {connect} from 'inferno-redux';

import {fetchAddressId} from '../address/address-actions';
import {Wallet} from './wallet';

export const WalletContainer = connect(
  function mapStateToProps(state) {
    return {
      address: state.address.address,
      serverUrl: state.base.iotexCore.serverUrl,
    };
  },
  dispatch => ({
    fetchAddressId: data => dispatch(fetchAddressId(data)),
  }),
)(Wallet);
