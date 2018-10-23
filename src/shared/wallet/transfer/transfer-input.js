// @flow

import Component from 'inferno-component';
import {TextInputField} from '../../common/inputfields/text-input-field';
import type {TWallet, TRawTransfer} from '../../../entities/wallet-types';
import {WALLET} from '../../common/site-url';
import {fetchPost} from '../../../lib/fetch-post';
import {TransactionDetailSection} from '../transaction-detail-section';
import {t} from '../../../lib/iso-i18n';
import type {Error} from '../../../entities/common-types';
import type {TAddressDetails} from '../../../entities/explorer-types';
import {acceptableNonce, isValidBytes, isValidRawAddress, onlyNumber} from '../validator';
import type {TRawTransferRequest} from '../../../entities/explorer-types';
import {BroadcastFail, BroadcastSuccess} from '../broadcastedTransaction';
import {clearButton, greenButton} from '../../common/buttons';

export class TransferInput extends Component {
  props: {
    wallet: TWallet,
    address: TAddressDetails,
    updateWalletInfo: any,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      recipient: '',
      amount: '',
      nonce: this.props.address ? this.props.address.pendingNonce : 1,
      currentNonce: this.props.address ? this.props.address.nonce : 1,
      nonceMessage: t('wallet.input.nonce.suggestion', {nonce: this.props.address ? this.props.address.nonce : 0}),
      dataInBytes: '',
      errors_recipient: '',
      errors_amount: '',
      errors_nonce: '',
      errors_dataInBytes: '',
      message: '',
      rawTransaction: null,
      broadcast: null,
      generating: false,
      hasErrors: false,
    };

    (this: any).generateTransfer = this.generateTransfer.bind(this);
    (this: any).broadcast = this.broadcast.bind(this);
    (this: any).sendNewIOTXClick = this.sendNewIOTXClick.bind(this);
    (this: any).checkFormErrors = this.checkFormErrors.bind(this);
    (this: any).hasErrors = this.hasErrors.bind(this);
  }

  componentDidMount() {
    this.setState({nonce: this.props.address ? this.props.address.nonce + 1 : this.state.nonce});
  }

  componentWillReceiveProps(nextProps: {address: TAddressDetails}, nextContext: any) {
    if (this.state.nonce <= nextProps.address.nonce) {
      this.setState({nonceMessage: t('wallet.input.nonce.suggestion', {nonce: nextProps.address.nonce}), currentNonce: nextProps.address.nonce});
    }
  }

  handleInputChange(name: string, value: string) {
    this.checkFormErrors(name, value);
  }

  updateFormState(name: string, value: ?string, error: ?string) {
    if (value !== undefined) {
      this.setState({[name]: value, [`errors_${name}`]: error ? error : '', rawTransaction: null});
    } else {
      this.setState({[`errors_${name}`]: t('wallet.error.required'), rawTransaction: null});
    }
    this.hasErrors();
  }

  // eslint-disable-next-line max-statements
  checkFormErrors(name: string, value: ?string) {
    const {currentNonce} = this.state;

    switch (name) {
    case 'recipient': {
      this.updateFormState(name, value, value && isValidRawAddress(value));
      break;
    }
    case 'nonce': {
      if (value) {
        if (onlyNumber(value)) {
          this.updateFormState(name, value, onlyNumber(value));
        } else {
          this.updateFormState(name, value, acceptableNonce(value, currentNonce));
        }
      } else {
        this.updateFormState(name, value, '');
      }
      break;
    }
    case 'amount': {
      this.updateFormState(name, value, value && onlyNumber(value));
      break;
    }
    case 'dataInBytes': {
      this.updateFormState(name, value, value && isValidBytes(value));
      break;
    }
    default: {
      break;
    }
    }
  }

  resetErrors() {
    this.setState({
      errors_recipient: '',
      errors_nonce: '',
      errors_amount: '',
      errors_dataInBytes: '',
      message: '',
    });
  }

  receiveResponse(res: {ok: boolean, rawTransaction: any, errors: Array<string>, error: ?Error}) {
    if (!res.ok) {
      if (res.errors && res.errors.length > 0) {
        res.errors.forEach(key => {
          this.checkFormErrors(key);
        });
        this.setState({message: t('wallet.error.fix'), generating: false, rawTransaction: null});
      } else {
        this.setState({message: t(res.error ? res.error.message : t('error.unknown')), generating: false, rawTransaction: null});
      }
    } else {
      this.resetErrors();
      this.setState({rawTransaction: res.rawTransaction, generating: false});
    }
  }

  hasErrors() {
    const {errors_recipient, errors_amount, errors_nonce, errors_dataInBytes} = this.state;
    this.setState({hasErrors: errors_recipient || errors_nonce || errors_amount || errors_dataInBytes});
  }

  generateTransfer() {
    const {wallet} = this.props;
    const {recipient, amount, nonce, dataInBytes} = this.state;

    this.setState({generating: true});
    const rawTransfer: TRawTransferRequest = {
      version: 0x01,
      nonce,
      amount,
      sender: wallet.rawAddress,
      recipient,
      payload: dataInBytes.replace(/^(0x)/, ''),
      isCoinbase: false,
    };
    fetchPost(WALLET.GENERATE_TRANSFER, {rawTransfer, wallet}).then(res => {
      this.receiveResponse(res);
    });
  }

  inputFields(generating: boolean) {
    return (
      <div>
        <form>
          <TextInputField
            label={t('wallet.input.to')}
            name='recipient'
            value={this.state.recipient}
            error={t(this.state.errors_recipient)}
            placeholder='io...'
            update={(name, value) => this.handleInputChange(name, value)}
          />

          <TextInputField
            label={t('wallet.input.amount')}
            name='amount'
            value={this.state.amount}
            error={t(this.state.errors_amount)}
            placeholder='1'
            update={(name, value) => this.handleInputChange(name, value)}>
            <p className='control'>
              <a className='button is-static'>{t('account.testnet.token')}</a>
            </p>
          </TextInputField>

          <TextInputField
            label={t('wallet.input.nonce')}
            name='nonce'
            value={this.state.nonce}
            error={t(this.state.errors_nonce)}
            placeholder='10'
            extra={this.state.nonceMessage}
            update={(name, value) => this.handleInputChange(name, value)}
          />

          <TextInputField
            label={t('wallet.input.dib')}
            name='dataInBytes'
            value={this.state.dataInBytes}
            error={t(this.state.errors_dataInBytes)}
            placeholder='0x1234'
            textArea={true}
            update={(name, value) => this.handleInputChange(name, value)}
          />
          <br/>
          {greenButton(t('wallet.input.generate'), this.state.hasErrors, this.generateTransfer, generating)}
        </form>
      </div>
    );
  }

  displayRawTransfer(rawTransfer: TRawTransfer, balance: number) {
    const signature = rawTransfer.signature;
    const cleanedTransfer = {
      ...rawTransfer,
      payload: `0x${rawTransfer.payload}`,
    };
    delete cleanedTransfer.signature;
    delete cleanedTransfer.isCoinbase;
    delete cleanedTransfer.senderPubKey;

    const rows = [
      {c1: t('wallet.transfer.fromAddress'), c2: cleanedTransfer.sender},
      {c1: t('wallet.transfer.toAddress'), c2: cleanedTransfer.recipient},
      {c1: t('wallet.transfer.nonce'), c2: cleanedTransfer.nonce},
      {c1: t('wallet.transfer.data'), c2: cleanedTransfer.payload},
    ];

    return (
      <TransactionDetailSection
        rawTransaction={rawTransfer}
        cleanedTransaction={JSON.stringify(cleanedTransfer, null, 2)}
        signedHash={signature}
        buttonName={t('wallet.transactions.send')}
        type={'transfer'}
        broadcast={this.broadcast}
        title={t('wallet.transfer.detail-title')}
      >
        <div>
          <table className='dialogue-table'>
            <tr>
              <td style={{lineHeight: '3.5'}}>{t('wallet.transfer.amount')}</td>
              <td className='c2-table'><p style={{fontSize: '32px', display: 'inline-block'}}>{cleanedTransfer.amount}</p> {t('account.testnet.token')}</td>
            </tr>
            {rows.map(r =>
              (<tr>
                <td>{r.c1}</td>
                <td className='c2-table'>{r.c2}</td>
              </tr>
              )
            )}
          </table>
          <div>
            <p>{t('wallet.transfer.balance-after', {balance: balance - cleanedTransfer.amount})} {t('account.testnet.token')}<br/>{t('wallet.detail.are-you-sure')}</p>
          </div>
        </div>
      </TransactionDetailSection>
    );
  }

  broadcast(result: any) {
    this.props.updateWalletInfo();
    this.setState({broadcast: result});
  }

  sendNewIOTXClick() {
    this.setState({broadcast: null, rawTransaction: null, nonce: this.props.address ? this.props.address.nonce + 1 : this.state.nonce});
  }

  render() {
    const {wallet, address} = this.props;
    const {generating} = this.state;

    if (!wallet) {
      return null;
    }

    const {message, rawTransaction, broadcast} = this.state;

    if (broadcast) {
      const sendNewIOTX = clearButton(`${t('wallet.transfer.sendNew')} ${t('account.testnet.token')}`, this.sendNewIOTXClick);
      if (broadcast.success) {
        return BroadcastSuccess(broadcast.txHash, 'transfer', sendNewIOTX);
      }
      return BroadcastFail(broadcast.error, t('wallet.transfer.broadcast.fail', {token: t('account.testnet.token')}), sendNewIOTX);
    }

    return (
      <div>
        <p className='wallet-title'>{`${t('wallet.transfer.send')} ${t('account.testnet.token')}`}</p>
        {message && <div className='notification is-danger'>{message}</div>}
        {this.inputFields(generating)}
        {rawTransaction ? this.displayRawTransfer(rawTransaction, address.totalBalance) : null}
      </div>
    );
  }
}
