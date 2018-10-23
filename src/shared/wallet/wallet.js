// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import window from 'global';
import {CommonMargin} from '../common/common-margin';
import type {TWallet} from '../../entities/wallet-types';
import {t} from '../../lib/iso-i18n';
import type {TAddressDetails} from '../../entities/explorer-types';
import {fetchAddressId} from '../address/address-actions';
import {Contract} from './contract/contract';
import {AccountSection} from './account-section';
import {Transfer} from './transfer/transfer';
import {Vote} from './vote/vote';
import {DeployPreloadHeader} from './contract/deploy';
import {UnlockWallet} from './unlock-wallet';

const TRANSFER = 0;
const VOTE = 1;
const CONTRACT = 2;

export class Wallet extends Component {
  props: {
    fetchAddressId: fetchAddressId,
    address: TAddressDetails,
    serverUrl: string,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      wallet: null,
      selectedTab: TRANSFER,
      createNew: false,
      fetchAddressIntervalId: 0,
    };

    (this: any).setWallet = this.setWallet.bind(this);
    (this: any).tabs = this.tabs.bind(this);
    (this: any).updateWalletInfo = this.updateWalletInfo.bind(this);
  }

  componentWillMount() {
    const {wallet} = this.state;

    if (isBrowser) {
      if (wallet) {
        this.props.fetchAddressId({id: wallet.rawAddress});
      }
    }
  }

  componentDidMount() {
    if (isBrowser) {
      // Fetch address every 1 seconds
      const fetchAddressIntervalId = window.setInterval(() => this.updateWalletInfo(), 1000);
      this.setState({fetchAddressIntervalId});
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.state.fetchAddressIntervalId);
  }

  setWallet(wallet: TWallet) {
    if (wallet) {
      this.props.fetchAddressId({id: wallet.rawAddress});
    }
    this.setState({wallet, createNew: false});
  }

  tabs() {
    const {serverUrl} = this.props;
    const {selectedTab, wallet, createNew} = this.state;
    const tabs = (
      <div className='tabs'>
        <ul style={{marginLeft: '0em'}}>
          <li className={`${selectedTab === TRANSFER ? 'is-active' : ''}`}
            onClick={() => this.setState({selectedTab: TRANSFER})}
          >
            <a>{t('wallet.tab.transfer', {token: t('account.testnet.token')})}</a>
          </li>
          <li className={`${selectedTab === VOTE ? 'is-active' : ''}`}
            onClick={() => this.setState({selectedTab: VOTE})}>
            <a>{t('wallet.tab.vote')}</a>
          </li>
          <li className={`${selectedTab === CONTRACT ? 'is-active' : ''}`}
            onClick={() => this.setState({selectedTab: CONTRACT})}>
            <a>{t('wallet.tab.contract')}</a>
          </li>
        </ul>
      </div>
    );
    let tab = null;
    switch (selectedTab) {
    case VOTE: {
      tab = <Vote wallet={wallet} address={this.props.address} updateWalletInfo={this.updateWalletInfo}/>;
      break;
    }
    case CONTRACT: {
      tab = <Contract wallet={wallet} address={this.props.address} serverUrl={serverUrl}
        updateWalletInfo={this.updateWalletInfo}/>;
      break;
    }
    default: {
      tab = <Transfer wallet={wallet} address={this.props.address} updateWalletInfo={this.updateWalletInfo}/>;
      break;
    }
    }
    return (
      <div>
        <div className='columns'>
          <div className='column is-three-quarters'>
            {
              wallet ? (
                [tabs, tab]
              ) : (
                <UnlockWallet
                  wallet={wallet}
                  setWallet={this.setWallet}
                  updateWalletInfo={this.updateWalletInfo}
                  createNew={this.state.createNew}
                  setCreateNew={() => this.setState({createNew: true})}
                />
              )
            }

          </div>
          <div className='column'>
            <AccountSection createNew={createNew} wallet={wallet} setWallet={this.setWallet}
              address={this.props.address}/>
          </div>
        </div>
      </div>
    );
  }

  updateWalletInfo() {
    if (this.state.wallet) {
      this.props.fetchAddressId({id: this.state.wallet.rawAddress});
    }
  }

  render() {

    return (
      <div className='column container'>
        <div style={{margin: '48px'}}/>
        <Helmet
          title={`${t('wallet.title.wallet')} - IoTeX`}
        />
        <DeployPreloadHeader/>
        <div className='column container'>
          {this.tabs()}
        </div>
        <CommonMargin/>
      </div>
    );
  }
}
