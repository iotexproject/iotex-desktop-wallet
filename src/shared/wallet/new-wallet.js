// @flow

import Component from 'inferno-component';
import isBrowser from 'is-browser';
import copy from 'copy-to-clipboard';
import {LabelInputField} from '../common/inputfields/text-input-field';
import type {TWallet} from '../../entities/wallet-types';
import {WALLET} from '../common/site-url';
import {t} from '../../lib/iso-i18n';
import {fetchGet} from '../../lib/fetch-get';

export class NewWallet extends Component {
  props: {
    setWallet: any,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      copied: false,
      message: '',
      fetching: false,
      wallet: null,
    };

    (this: any).unlockWallet = this.unlockWallet.bind(this);
    (this: any).generateKeyPair = this.generateKeyPair.bind(this);
    (this: any).copyPriKey = this.copyPriKey.bind(this);
  }

  generateKeyPair() {
    this.setState({fetching: true});
    fetchGet(WALLET.GENERATE_KEY_PAIR).then(res => {
      if (!res.ok) {
        this.setState({message: res.error.message, fetching: false});
      } else {
        this.setState({copied: false, message: '', fetching: false, wallet: res.wallet});
      }
    });
  }

  componentWillMount() {
    if (isBrowser) {
      this.generateKeyPair();
    }
  }

  button(onClick: any, message: string) {
    const backgroundColor = '#00b4a0';
    const color = '#ffffff';
    return (
      <button style={{backgroundColor, color}} className='button' onClick={onClick}>{message}</button>
    );
  }

  unlockWallet() {
    const {wallet} = this.state;
    this.props.setWallet(wallet);
    this.setState({message: '', fetching: false});
  }

  copyPriKey() {
    const {wallet} = this.state;
    copy(wallet.privateKey);
    this.setState({copied: true});
  }

  walletInfo(copied: boolean, wallet: TWallet) {
    return (
      <div>
        <LabelInputField
          label={t('wallet.account.raw')}
          name='address'
          value={wallet.rawAddress}
          placeholder={t('wallet.account.addressPlaceHolder')}
          readOnly={true}/>
        <br/>
        <LabelInputField
          label={t('wallet.account.private')}
          name='priKey'
          value={wallet.privateKey}
          placeholder={t('wallet.account.addressPlaceHolder')}
          readOnly={true}>
          <p className='control'>
            {copied ?
              <a style={{backgroundColor: '#07a35a', color: '#cccccc'}} className='button is-info' onClick={this.copyPriKey}><i className='fas fa-check'/></a> :
              <a className='button is-info' onClick={this.copyPriKey}>{t('new-wallet.copy')}</a>
            }
          </p>
        </LabelInputField>
        {copied && <p style={{color: '#07a35a', float: 'right'}}>{t('new-wallet.copied')}</p>}
        <br/>

        <article style={{marginTop: '10px'}} className='message is-warning'>
          <div className='message-body'>
            <p><strong>{t('new-wallet.warn.do-not-lose')}</strong> {t('new-wallet.warn.cant-recover')}</p>
            <p><strong>{t('new-wallet.warn.do-not-share')}</strong> {t('new-wallet.warn.stolen')}</p>
            <p><strong>{t('new-wallet.warn.backup')}</strong> {t('new-wallet.warn.secure')}</p>
          </div>
        </article>

        <br/>
        {this.button(this.unlockWallet, t('new-wallet.button.unlock'))}
      </div>
    );
  }
  render() {
    const {copied, wallet, message, fetching} = this.state;

    if (fetching) {
      return (
        <div>
          <p>{t('new-wallet.loading')}</p>
        </div>
      );
    }

    if (!wallet) {
      return (
        <div>
          {message && <div className='notification is-danger'>{t('wallet.generate.fail')}</div>}
          {this.button(this.generateKeyPair, t('new-wallet.button.generate'))}
        </div>
      );
    }

    return (
      <div>
        <div>
          <p style={{display: 'inline-block'}} className='wallet-title'>{t('new-wallet.created')}</p>
          <p className='private-key'>{t('new-wallet.privateKey')}</p>
        </div>
        {this.walletInfo(copied, wallet)}
      </div>
    );
  }
}
