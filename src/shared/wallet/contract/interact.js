// @flow

import Component from 'inferno-component';
import {LabelInputField, TextInputField} from '../../common/inputfields/text-input-field';
import type {TRawExecutionRequest, TWallet} from '../../../entities/wallet-types';
import {acceptableNonce, isValidJSON, isValidRawAddress, onlyNumber} from '../validator';
import {t} from '../../../lib/iso-i18n';
import type {TAddressDetails} from '../../../entities/explorer-types';
import {WALLET} from '../../common/site-url';
import {fetchPost} from '../../../lib/fetch-post';
import {BroadcastFail, BroadcastSuccess} from '../broadcastedTransaction';
import {Dialogue} from '../../common/dialogue/dialogue';
import type {GExecution} from '../../../server/gateways/iotex-core/iotex-core-types';
import {cancelButton, clearButton, greenButton} from '../../common/buttons';
import {AbiFunctions} from './abi-functions';

export class Interact extends Component {
  props: {
    wallet: TWallet,
    address: TAddressDetails,
    updateWalletInfo: any,
    serverUrl: string,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      contractAddress: '',
      errors_contractAddress: '',
      nonce: this.props.address ? this.props.address.pendingNonce : 1,
      currentNonce: this.props.address ? this.props.address.nonce : 1,
      errors_nonce: '',
      nonceMessage: t('wallet.input.nonce.suggestion', {nonce: this.props.address ? this.props.address.nonce : 0}),
      abi: '',
      errors_abi: '',
      gasLimit: '100000',
      errors_gasLimit: '',
      amount: '0',
      errors_amount: '',
      sending: false,
      abiFunctions: null,
      selectedFunction: '',
      transactionDetail: null,
      rawTransaction: null,
      broadcast: null,
      signed: false,
      signing: false,
      message: '',
      hasErrors: false,
    };

    (this: any).handleAccess = this.handleAccess.bind(this);
    (this: any).displayMethods = this.displayMethods.bind(this);
    (this: any).writeData = this.writeData.bind(this);
    (this: any).sendContractClick = this.sendContractClick.bind(this);
    (this: any).signTransaction = this.signTransaction.bind(this);
    (this: any).sendTransaction = this.sendTransaction.bind(this);
    (this: any).cancel = this.cancel.bind(this);
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

  // eslint-disable-next-line max-statements,complexity
  checkFormErrors(name: string, value: ?string) {
    const {currentNonce} = this.state;

    switch (name) {
    case 'contractAddress': {
      this.updateFormState(name, value, value && isValidRawAddress(value));
      break;
    }
    case 'gasLimit': {
      this.updateFormState(name, value, value && onlyNumber(value));
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
    case 'abi': {
      const json = isValidJSON(value);
      let error = '';
      if (!json) {
        error = t('wallet.interact.invalidABI');
      }
      this.updateFormState(name, value, error);
      break;
    }
    case 'amount': {
      this.updateFormState(name, value, value && onlyNumber(value));
      break;
    }
    default: {
      break;
    }
    }
  }

  updateFormState(name: string, value: ?string, error: ?string) {
    if (value !== undefined) {
      this.setState({[name]: value, [`errors_${name}`]: error ? error : '', message: ''});
    } else {
      this.setState({[`errors_${name}`]: t('wallet.input.required'), message: ''});
    }

    if (name !== 'amount') {
      this.setState({rawTransaction: null, abiFunctions: null});
    }
    this.hasErrors();
  }

  // eslint-disable-next-line max-statements
  handleAccess() {
    const {abi, errors_abi, errors_contractAddress, contractAddress, gasLimit, nonce} = this.state;
    let error = false;

    if (!abi) {
      this.checkFormErrors('abi');
      error = true;
    }

    if (!contractAddress) {
      this.checkFormErrors('contractAddress');
      error = true;
    }

    if (!gasLimit) {
      this.checkFormErrors('gasLimit');
      error = true;
    }

    if (!nonce) {
      this.checkFormErrors('nonce');
      error = true;
    }

    if (errors_abi || errors_contractAddress || error) {
      this.setState({message: t('wallet.input.fix')});
      return;
    }

    const abiFunctions = {};
    let slotCounter = 0;
    JSON.parse(abi).forEach(f => {
      if (f.type === 'function') {
        if (f.constant) {
          f.slot = slotCounter;
          slotCounter += 1;
        }
        abiFunctions[f.name] = f;
      }
    });
    this.setState({abiFunctions});
  }

  displayMethods(abiFunctions: any, selectedFunction: string, contractAddress: string, wallet: TWallet) {
    const {nonce, gasLimit} = this.state;

    return (
      <div>
        <div className='select'>
          <select
            className='custom-select custom-select-sm'
            onChange={e => this.setState({selectedFunction: e.target.value, transactionDetail: null})}>
            <option value=''>Select a function</option>
            {Object.keys(abiFunctions).map(name => (
              <option value={name} selected={selectedFunction === name}>{name}</option>
            ))}
          </select>
        </div>
        <br/>
        <br/>
        <AbiFunctions
          abiFunctions={abiFunctions}
          selectedFunction={selectedFunction}
          writeData={this.writeData}
          contractAddress={contractAddress}
          wallet={wallet}
          nonce={nonce}
          gas={gasLimit}
        />
      </div>
    );
  }

  signTransaction() {
    const {wallet} = this.props;
    const {rawTransaction, amount} = this.state;
    rawTransaction.amount = amount;

    this.setState({signing: true});
    fetchPost(WALLET.SIGN_CONTRACT_ABI, {rawTransaction, wallet}).then(res => {
      if (!res.ok) {
        if (res.errors && res.errors.length > 0) {
          res.errors.forEach(key => {
            this.checkFormErrors(key);
          });
          this.setState({message: t('wallet.error.fix'), signing: false, rawTransaction: null});
        } else {
          this.setState({message: t(res.error ? res.error.message : 'error.unknown'), signing: false, rawTransaction: null});
        }
      } else {
        this.setState({rawTransaction: res.rawTransaction, signed: true, signing: false});
      }
    });
  }

  displayRawTransaction(rawTransaction: GExecution) {
    const cleanedTransaction = {
      ...rawTransaction,
      data: `0x${rawTransaction.data}`,
    };
    const signedHash = rawTransaction.signature;

    delete cleanedTransaction.signature;
    delete cleanedTransaction.executorPubKey;
    delete cleanedTransaction.gasPrice;
    delete cleanedTransaction.gas;
    delete cleanedTransaction.ID;
    delete cleanedTransaction.timestamp;
    delete cleanedTransaction.blockID;
    delete cleanedTransaction.isPending;
    cleanedTransaction.gasLimit = rawTransaction.gas;

    return (
      <div>
        <div style={{marginLeft: '-0.75rem'}} className='column'>
          <label className='label'>{t('wallet.transactionDetail.raw')}</label>
          <pre>{JSON.stringify(cleanedTransaction, null, 2)}</pre>
        </div>
        <div className='column'>
          <label className='label'>{t('wallet.transactionDetail.signed')}</label>
          <pre>{signedHash}</pre>
        </div>
      </div>
    );
  }

  sendTransaction() {
    const {rawTransaction} = this.state;

    fetchPost(WALLET.SEND_TRANSACTION, {rawTransaction, type: 'contract'}).then(res => {
      if (!res.ok) {
        this.broadcast({success: false, error: res.error.message});
        this.setState({message: t(res.error.message), sent: true, txHash: ''});
      } else {
        this.broadcast({success: true, txHash: res.hash});
        this.setState({sent: true, txHash: res.hash});
      }
    });
  }

  writeData(data: string) {
    const {nonce, gasLimit, contractAddress, amount} = this.state;

    const rawTransaction: TRawExecutionRequest = {
      byteCode: data.replace(/^(0x)/, ''),
      nonce,
      gasLimit,
      version: 0x1,
      contract: contractAddress,
      amount,
    };

    this.setState({rawTransaction, signed: false});
    this.setDialogueActive(true);
  }

  broadcast(result: any) {
    this.props.updateWalletInfo();
    this.setState({broadcast: result});
  }

  sendContractClick() {
    this.setState({broadcast: null, rawTransaction: null, nonce: this.props.address ? this.props.address.nonce + 1 : this.state.nonce});
  }

  cancel() {
    this.setState({broadcast: null, rawTransaction: null, signed: false});
    this.setDialogueActive(false);
  }

  hasErrors() {
    const {errors_recipient, errors_contractAddress, errors_nonce, errors_gasLimit, errors_abi} = this.state;
    this.setState({hasErrors: errors_recipient || errors_nonce || errors_contractAddress || errors_gasLimit || errors_abi});
  }

  // eslint-disable-next-line complexity
  render() {
    const {wallet} = this.props;
    const {abiFunctions, selectedFunction, message, rawTransaction, broadcast, signed, signing, sending, contractAddress} = this.state;

    if (broadcast) {
      const sendNewContract = clearButton(t('wallet.interact.button'), this.sendContractClick);
      if (broadcast.success) {
        return BroadcastSuccess(broadcast.txHash, 'contract', sendNewContract);
      }
      return BroadcastFail(broadcast.error, t('wallet.interact.broadcast.fail'), sendNewContract);
    }

    return (
      <div>
        <Dialogue
          getSetActiveFn={setDialogueActive => this.setDialogueActive = setDialogueActive}
          title={t('wallet.interact.warning')}
          cancelButton={rawTransaction && signed && cancelButton(this.cancel)}
          submitButton={rawTransaction && signed && (greenButton(t('wallet.interact.yes-button'), false, this.sendTransaction, sending))}>
          <div>
            <p>{t('wallet.interact.execute-fn')}</p>
            <p>{t('wallet.interact.deployed-to-testnet')}</p>
            <br/>
            <LabelInputField
              label={t('wallet.interact.amount-to-send')}
              name='amount'
              value={this.state.amount}
              error={t(this.state.errors_amount)}
              placeholder={0}
              readOnly={signed}
              update={(name, value) => this.handleInputChange(name, value)}/>
            <br/>
            {signed && rawTransaction ?
              this.displayRawTransaction(rawTransaction) :
              greenButton('Generate transaction', this.state.errors_amount || !this.state.amount, this.signTransaction, signing)
            }
          </div>
        </Dialogue>
        <p className='wallet-title'>{t('wallet.interact.title')}</p>
        {message && <div className='notification is-danger'>{message}</div>}
        <div>
          <TextInputField
            label={t('wallet.input.contract')}
            name='contractAddress'
            value={this.state.contractAddress}
            error={t(this.state.errors_contractAddress)}
            placeholder='io...'
            update={(name, value) => this.handleInputChange(name, value)}/>

          <TextInputField
            label={t('wallet.input.nonce')}
            name='nonce'
            value={this.state.nonce}
            error={t(this.state.errors_nonce)}
            placeholder='1'
            extra={this.state.nonceMessage}
            update={(name, value) => this.handleInputChange(name, value)}/>

          <TextInputField
            label={t('wallet.input.gasLimit')}
            name='gasLimit'
            value={this.state.gasLimit}
            error={t(this.state.errors_gasLimit)}
            placeholder='100000'
            update={(name, value) => this.handleInputChange(name, value)}/>

          <TextInputField
            label={t('wallet.input.abi')}
            name='abi'
            value={this.state.abi}
            error={t(this.state.errors_abi)}
            placeholder={t('wallet.interact.abiTemplate')}
            textArea={true}
            update={(name, value) => this.handleInputChange(name, value)}/>
          <br/>
          {greenButton(t('wallet.interact.access'), this.state.hasErrors, this.handleAccess, false)}
        </div>
        <br/>
        {abiFunctions && this.displayMethods(abiFunctions, selectedFunction, contractAddress, wallet)}
      </div>
    );
  }
}
