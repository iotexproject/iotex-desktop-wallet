import {connect} from 'inferno-redux';

import {fetchAddressId} from '../address/address-actions';
import {Wallet} from './wallet';

export const WalletContainer = connect(
  function mapStateToProps(state) {
    const chains = state.base.chains;
    const href = state.base.href;
    const curChain = chains.find(c => String(c.url).indexOf(href) !== -1);
    const chainId = curChain ? curChain.id : 1;
    return {
      address: state.address.address,
      serverUrl: state.base.iotexCore.serverUrl,
      chainId,
    };
  },
  dispatch => ({
    fetchAddressId: data => dispatch(fetchAddressId(data)),
  }),
)(Wallet);
