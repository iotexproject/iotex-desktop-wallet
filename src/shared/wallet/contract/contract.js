// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import {CommonMargin} from '../../common/common-margin';
import type {TWallet} from '../../../entities/wallet-types';
import {t} from '../../../lib/iso-i18n';
import type {TAddressDetails} from '../../../entities/explorer-types';
import {assetURL} from '../../../lib/asset-url';
import {Interact} from './interact';
import {Deploy} from './deploy';

const INTERACT = 0;
const DEPLOY = 1;
const SELECT = 2;

export class Contract extends Component {
  props: {
    wallet: TWallet,
    address: TAddressDetails,
    updateWalletInfo: any,
    serverUrl: string,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      selectedTab: '',
    };

    (this: any).toolInputs = this.toolInputs.bind(this);
  }

  card(imgSrc: string, title: string, tab: number) {
    return (
      <div style={{cursor: 'pointer'}} className='contract-card' onClick={() => this.setState({selectedTab: tab})}>
        <div>
          <img
            style={{maxWidth: '100%', paddingTop: '24px'}}
            src={assetURL(imgSrc)}
          />
          <div className='contract-card-container'>
            <p style={{fontSize: '16px', fontWeight: 'bold'}}>{title}</p>
            <p></p>
          </div>
        </div>
        <div style={{width: '100%', textAlign: 'center'}} className='transaction-history-tag'>
          {/* <a onClick={() => {}}>{t('wallet.contract.learn')}</a>*/}
        </div>
      </div>
    );
  }

  toolInputs(tab: number, wallet: TWallet, address: TAddressDetails, updateWalletInfo: any, serverUrl: string) {
    switch (tab) {
    case INTERACT: {
      return (
        <div>
          <div style={{paddingBottom: '24px'}}>
            <a onClick={() => this.setState({selectedTab: SELECT})}>{t('wallet.contract.back')}</a>
          </div>
          <Interact style={{paddingTop: '24px'}} wallet={wallet} address={address} updateWalletInfo={updateWalletInfo} serverUrl={serverUrl}/>
        </div>
      );
    }
    case DEPLOY: {
      return (
        <div>
          <div style={{paddingBottom: '24px'}}>
            <a onClick={() => this.setState({selectedTab: SELECT})}>{t('wallet.contract.back')}</a>
          </div>
          <Deploy style={{paddingTop: '24px'}} wallet={wallet} address={address} updateWalletInfo={updateWalletInfo}/>
        </div>
      );
    }
    default: {
      return (
        <div>
          <p className='wallet-title'>{t('wallet.contract.choose')}</p>
          <div style={{paddingTop: '10px'}} className='columns'>
            <div className='column is-half'>
              {this.card('/interact-contract.png', t('wallet.contract.interactWith'), INTERACT)}
            </div>
            <div className='column is-half'>
              {this.card('/deploy-contract.png', t('wallet.contract.deployContract'), DEPLOY)}
            </div>
          </div>
        </div>
      );
    }
    }
  }

  render() {
    const {wallet, address, updateWalletInfo, serverUrl} = this.props;
    const {selectedTab} = this.state;

    if (!wallet) {
      return null;
    }

    return (
      <div className='column'>
        <Helmet
          title={`${t('wallet.contract.title')} - IoTeX`}
        />
        {this.toolInputs(selectedTab, wallet, address, updateWalletInfo, serverUrl)}
        <CommonMargin/>
      </div>
    );
  }
}
