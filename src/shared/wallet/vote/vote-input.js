// @flow

import Component from 'inferno-component';
import {TextInputField} from '../../common/inputfields/text-input-field';
import type {TWallet, TRawVote} from '../../../entities/wallet-types';
import {WALLET} from '../../common/site-url';
import {fetchPost} from '../../../lib/fetch-post';
import {TransactionDetailSection} from '../transaction-detail-section';
import {t} from '../../../lib/iso-i18n';
import type {Error} from '../../../entities/common-types';
import type {TAddressDetails} from '../../../entities/explorer-types';
import {acceptableNonce, isValidRawAddress, onlyNumber} from '../validator';
import type {TRawVoteRequest} from '../../../entities/explorer-types';
import {BroadcastFail, BroadcastSuccess} from '../broadcastedTransaction';
import {clearButton, greenButton} from '../../common/buttons';

const PROTOCOL_VERSION = 0x01;

export class VoteInput extends Component {
  props: {
    wallet: TWallet,
    address: TAddressDetails,
    updateWalletInfo: any,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      votee: '',
      nonce: this.props.address ? this.props.address.pendingNonce : 1,
      currentNonce: this.props.address ? this.props.address.nonce : 1,
      errors_votee: '',
      errors_nonce: '',
      nonceMessage: t('wallet.input.nonce.suggestion', {nonce: this.props.address ? this.props.address.nonce : 0}),
      message: '',
      rawTransaction: null,
      broadcast: null,
      generating: false,
      hasErrors: false,
    };

    (this: any).handleInputChange = this.handleInputChange.bind(this);
    (this: any).generateVote = this.generateVote.bind(this);
    (this: any).broadcast = this.broadcast.bind(this);
    (this: any).sendNewVoteClick = this.sendNewVoteClick.bind(this);
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
    case 'votee': {
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
    default: {
      break;
    }
    }
  }

  hasErrors() {
    const {errors_votee, errors_nonce} = this.state;
    this.setState({hasErrors: errors_votee || errors_nonce});
  }

  resetErrors() {
    this.setState({
      errors_votee: '',
      errors_nonce: '',
      message: '',
    });
  }

  receiveResponse(res: {ok: boolean, rawTransaction: any, errors: Array<string>, error: ?Error}) {
    if (!res.ok) {
      if (res.errors && res.errors.length > 0) {
        res.errors.forEach(key => {
          this.checkFormErrors(key);
        });
        this.setState({message: t('wallet.error.fix'), rawTransaction: null});
      } else {
        this.setState({message: t(res.error ? res.error.message : 'error.unknown'), rawTransaction: null});
      }
    } else {
      this.resetErrors();
      this.setState({rawTransaction: res.rawTransaction});
    }
  }

  generateVote() {
    const {wallet} = this.props;
    const {votee, nonce} = this.state;

    const rawVote: TRawVoteRequest = {
      version: PROTOCOL_VERSION,
      nonce,
      voter: wallet.rawAddress,
      votee,
    };
    fetchPost(WALLET.GENERATE_VOTE, {rawVote, wallet}).then(res => {
      this.receiveResponse(res);
    });
  }

  inputFields(generating: boolean) {
    return (
      <div>
        <form>
          <TextInputField
            label={t('wallet.input.to')}
            name='votee'
            value={this.state.votee}
            error={t(this.state.errors_votee)}
            placeholder='io...'
            update={(name, value) => this.handleInputChange(name, value)}
          />

          <TextInputField
            label={t('wallet.input.nonce')}
            name='nonce'
            value={this.state.nonce}
            error={t(this.state.errors_nonce)}
            placeholder='10'
            extra={this.state.nonceMessage}
            update={(name, value) => this.handleInputChange(name, value)}>
          </TextInputField>

          <br/>
          {greenButton(t('wallet.input.generate'), this.state.hasErrors, this.generateVote, generating)}
        </form>
      </div>
    );
  }

  displayRawVote(rawVote: TRawVote) {
    const signature = rawVote.signature;
    const cleanedVote = {...rawVote};
    delete cleanedVote.signature;
    delete cleanedVote.voterPubKey;

    const rows = [
      {c1: t('wallet.vote.voter'), c2: cleanedVote.voter},
      {c1: t('wallet.vote.votee'), c2: cleanedVote.votee},
      {c1: t('wallet.vote.nonce'), c2: cleanedVote.nonce},
    ];

    return (
      <TransactionDetailSection
        rawTransaction={rawVote}
        cleanedTransaction={JSON.stringify(cleanedVote, null, 2)}
        signedHash={signature}
        buttonName={t('wallet.transactions.send')}
        type={'vote'}
        broadcast={this.broadcast}
        title={t('wallet.vote.detail-title')}
      >
        <div>
          <table className='dialogue-table'>
            {rows.map(r =>
              (<tr>
                <td>{r.c1}</td>
                <td className='c2-table'>{r.c2}</td>
              </tr>
              )
            )}
          </table>
          <div>
            <p>{t('wallet.detail.are-you-sure')}</p>
          </div>
        </div>
      </TransactionDetailSection>
    );
  }

  broadcast(result: any) {
    this.props.updateWalletInfo();
    this.setState({broadcast: result});
  }

  sendNewVoteClick() {
    this.setState({broadcast: null, rawTransaction: null, nonce: this.props.address ? this.props.address.nonce + 1 : this.state.nonce});
  }

  render() {
    const {wallet} = this.props;
    const {generating} = this.state;

    if (!wallet) {
      return null;
    }

    const {message, rawTransaction, broadcast} = this.state;

    if (broadcast) {
      const sendNewVote = clearButton(t('wallet.vote.button.new'), this.sendNewVoteClick);
      if (broadcast.success) {
        return BroadcastSuccess(broadcast.txHash, 'vote', sendNewVote);
      }
      return BroadcastFail(broadcast.error, t('wallet.vote.fail'), sendNewVote);
    }

    return (
      <div>
        <p className='wallet-title'>{t('wallet.vote.input.title')}</p>
        {message && <div className='notification is-danger'>{message}</div>}
        {this.inputFields(generating)}
        {rawTransaction ? this.displayRawVote(rawTransaction) : null}
      </div>
    );
  }
}
