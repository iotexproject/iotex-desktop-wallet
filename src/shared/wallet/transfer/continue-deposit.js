// @flow
import Component from 'inferno-component';
import window from 'global/window';
import {connect} from 'inferno-redux';
import {fetchPost} from '../../../lib/fetch-post';
import {WALLET} from '../../common/site-url';
import {BroadcastFail, BroadcastSuccess} from '../broadcastedTransaction';
import {t} from '../../../lib/iso-i18n';

const ELAPS = 10000;

export const ContinueDeposit = connect(
  state => ({chains: state.base.chains})
)(
  class ContinueDepositInner extends Component {
  state: {
    fetched: boolean,
    hash: string,
    error: string
  };
  props: {
    targetChainId: number, hash: string, rawTransaction: any, wallet: any, chains: any,
  };

  constructor(props) {
    super(props);
    this.state = {fetched: false, hash: '', error: ''};
  }

  componentDidMount() {
    const self = this;
    const {targetChainId, hash, rawTransaction, wallet} = this.props;
    window.setTimeout(() => {
      fetchPost(WALLET.CONTINUE_DEPOSIT, {targetChainId, hash, rawTransaction, wallet})
        .then(resp => {
          self.setState({hash: resp.hash, fetched: true});
        })
        .catch(err => {
          self.setState({error: err.message, fetched: true});
        });
    }, ELAPS);
  }

  render() {
    const {sendNewIOTX, chains, targetChainId} = this.props;
    const {fetched, hash, error} = this.state;
    // to be fetched
    if (!fetched) {
      return (
        <div>
          {t('wallet.transfer.crossChain.settling')}
        </div>
      );
    }

    if (error) {
      return BroadcastFail(error, t('wallet.transfer.broadcast.fail', {token: t('account.testnet.token')}), sendNewIOTX);
    }

    const targetChain = chains.find(c => c.id === targetChainId);
    return BroadcastSuccess(hash, 'transfer', sendNewIOTX, `${targetChain.url}deposits/`, true);
  }
  });
