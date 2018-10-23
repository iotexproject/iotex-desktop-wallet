// @flow

import Component from 'inferno-component';
import {LabelInputField} from '../common/inputfields/text-input-field';
import type {TWallet} from '../../entities/wallet-types';
import {WALLET} from '../common/site-url';
import {t} from '../../lib/iso-i18n';
import {fetchPost} from '../../lib/fetch-post';
import {cancelButton, greenButton} from '../common/buttons';
import {Dialogue} from '../common/dialogue/dialogue';
import {isValidPrivateKey} from './validator';
import {NewWallet} from './new-wallet';

export class UnlockWallet extends Component {
  props: {
    wallet: TWallet,
    setWallet: any,
    createNew: boolean,
    setCreateNew: any,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      priKey: '',
      message: '',
      priKeyError: '',
      fetching: false,
    };

    (this: any).handleInputChange = this.handleInputChange.bind(this);
    (this: any).unlockWallet = this.unlockWallet.bind(this);
    (this: any).newWalletClick = this.newWalletClick.bind(this);
    (this: any).setDialogueNotActiveButton = this.setDialogueNotActiveButton.bind(this);
  }

  handleInputChange(name: string, value: string) {
    switch (name) {
    case 'priKey': {
      this.setState({[name]: value, priKeyError: isValidPrivateKey(value), message: ''});
      break;
    }
    default: {
      break;
    }
    }
  }

  unlockWallet() {
    const {priKey} = this.state;
    this.setState({fetching: true});

    fetchPost(WALLET.UNLOCK_WALLET, {priKey}).then(res => {
      if (!res.ok) {
        this.setState({priKeyError: res.error.message, message: res.error.message, fetching: false});
      } else {
        this.props.setWallet(res.wallet);
        this.setState({priKey: '', message: '', priKeyError: '', fetching: false});
      }
    });
  }

  newWalletClick() {
    this.props.setCreateNew();
    this.setDialogueActive(true);
  }

  setDialogueNotActiveButton() {
    this.setDialogueActive(false);
  }

  unlock(priKey: string, priKeyError: string, message: string, fetching: boolean) {
    return (
      <div>
        <Dialogue
          getSetActiveFn={setDialogueActive => this.setDialogueActive = setDialogueActive}
          title={t('wallet.unlock.new.title')}
          cancelButton={cancelButton(this.setDialogueNotActiveButton)}
          submitButton={greenButton(t('wallet.unlock.new.yes'), false, this.newWalletClick, false)}>
          <p>{t('wallet.unlock.new.p1')}</p>
          <p>{t('wallet.unlock.new.p2')}</p>
        </Dialogue>
        <p className='wallet-title'>{t('unlock-wallet.title')}</p>

        <article className='message is-warning'>
          <div className='message-body'>{t('unlock-wallet.warn.message')}</div>
        </article>

        {message && <div className='notification is-danger'>{t('wallet.error.fix')}</div>}
        <LabelInputField
          label={t('wallet.account.enterPrivateKey')}
          name='priKey'
          value={priKey}
          error={t(priKeyError)}
          placeholder={t('wallet.account.placehold.privateKey')}
          update={(name, value) => this.handleInputChange(name, value)}/>
        <br/>
        {greenButton(t('wallet.account.unlock'), Boolean(!priKey || priKeyError), this.unlockWallet, fetching)}
        <div style={{paddingTop: '24px'}}>
          <p>{t('unlock-wallet.no-wallet')}
            <a style={{paddingLeft: '10px'}} onClick={() => {
              this.setDialogueActive(true);
            }}>{t('unlock-wallet.create')}</a>
          </p>
        </div>
      </div>
    );
  }

  render() {
    const {wallet, setWallet, createNew} = this.props;
    const {priKey, message, priKeyError, fetching} = this.state;

    if (createNew && !wallet) {
      return (
        <NewWallet setWallet={setWallet}/>
      );
    }

    return (
      <div>
        {wallet ? null : this.unlock(priKey, priKeyError, message, fetching)}
      </div>
    );
  }
}
