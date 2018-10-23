/* eslint-disable no-invalid-this,no-continue */
// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import {TextInputField} from '../../common/inputfields/text-input-field';
import {WALLET} from '../../common/site-url';
import type {TWallet} from '../../../entities/wallet-types';
import {fetchPost} from '../../../lib/fetch-post';
import {TransactionDetailSection} from '../transaction-detail-section';
import {t} from '../../../lib/iso-i18n';
import type {TAddressDetails} from '../../../entities/explorer-types';
import type {TRawExecutionRequest} from '../../../entities/wallet-types';
import {assetURL} from '../../../lib/asset-url';
import {BroadcastFail, BroadcastSuccess} from '../broadcastedTransaction';
import {acceptableNonce, isValidBytes, onlyNumber} from '../validator';
import type {GExecution} from '../../../server/gateways/iotex-core/iotex-core-types';
import {clearButton, greenButton} from '../../common/buttons';

const window = require('global/window');

export function DeployPreloadHeader() {
  return (
    <Helmet
      script={[
        {
          src: 'https://ethereum.github.io/solc-bin/bin/list.js', type: 'text/javascript',
        },
        {
          src: assetURL('/browser-solc.min.js'), type: 'text/javascript',
        }]}
    />
  );
}

export class Deploy extends Component {
  props: {
    wallet: TWallet,
    address: TAddressDetails,
    updateWalletInfo: any,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      solidity: '',
      errors_solidity: '',
      abi: '',
      errors_abi: '',
      byteCode: '',
      errors_byteCode: '',
      gasLimit: '1000000',
      errors_gasLimit: '',
      nonce: this.props.address ? this.props.address.pendingNonce : 1,
      currentNonce: this.props.address ? this.props.address.nonce : 1,
      nonceMessage: t('wallet.input.nonce.suggestion', {nonce: this.props.address ? this.props.address.nonce : 0}),
      errors_nonce: '',
      message: '',
      rawTransaction: null,
      sending: false,
      broadcast: null,
      generatingByte: false,
      deploying: false,
      hasErrors: false,
    };

    (this: any).deploy = this.deploy.bind(this);
    (this: any).broadcast = this.broadcast.bind(this);
    (this: any).sendContractClick = this.sendContractClick.bind(this);
    (this: any).generateClick = this.generateClick.bind(this);
    (this: any).checkFormErrors = this.checkFormErrors.bind(this);
    (this: any).hasErrors = this.hasErrors.bind(this);
  }

  componentDidMount() {
    this.setState({nonce: this.props.address ? this.props.address.nonce + 1 : this.state.nonce});
  }

  componentWillReceiveProps(nextProps: { address: TAddressDetails }, nextContext: any) {
    if (this.state.nonce <= nextProps.address.nonce) {
      this.setState({nonceMessage: t('wallet.input.nonce.suggestion', {nonce: nextProps.address.nonce}), currentNonce: nextProps.address.nonce});
    }
  }

  handleInputChange(name: string, value: string) {
    this.checkFormErrors(name, value);
  }

  checkFormErrors(name: string, value: ?string) {
    const {currentNonce} = this.state;

    switch (name) {
    case 'byteCode': {
      this.updateFormState(name, value, value && isValidBytes(value));
      break;
    }
    case 'gasLimit': {
      this.updateFormState(name, value, value && onlyNumber(value));
      break;
    }
    case 'solidity': {
      this.updateFormState(name, value);
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

  updateFormState(name: string, value: ?string, error: ?string) {
    if (value !== undefined) {
      this.setState({[name]: value, [`errors_${name}`]: error ? error : '', rawTransaction: null});
    } else {
      this.setState({[`errors_${name}`]: t('wallet.input.required'), rawTransaction: null});
    }
    this.hasErrors();
  }

  resetErrors() {
    this.setState({
      errors_byteCode: '',
      errors_nonce: '',
      errors_gasLimit: '',
      errors_solidity: '',
      errors_abi: '',
      message: '',
    });
  }

  deploy() {
    const {wallet} = this.props;
    const {byteCode, nonce, gasLimit} = this.state;

    const rawSmartContractRequest: TRawExecutionRequest = {
      byteCode: byteCode.replace(/^(0x)/, ''),
      nonce,
      gasLimit,
      version: 0x1,
      contract: '',
      amount: 0,
    };

    this.setState({deploying: true});
    fetchPost(WALLET.GENERATE_EXECUTION, {rawSmartContractRequest, wallet}).then(res => {
      this.resetErrors();
      if (!res.ok) {
        if (res.errors && res.errors.length > 0) {
          res.errors.forEach(key => {
            this.checkFormErrors(key);
          });
          this.setState({message: t('wallet.input.fix'), deploying: false, rawTransaction: null});
        } else {
          this.setState({message: t(res.error ? res.error.message : 'error.unknown'), deploying: false, rawTransaction: null});
        }
      } else {
        this.setState({rawTransaction: res.rawTransaction, deploying: false});
      }
    });
  }

  displayRawSmartContract(rawSmartContract: GExecution) {
    const signature = rawSmartContract.signature;
    const cleanedSmartContract = {
      ...rawSmartContract,
      data: `0x${rawSmartContract.data}`,
    };
    delete cleanedSmartContract.signature;
    delete cleanedSmartContract.contract;
    delete cleanedSmartContract.executorPubKey;
    delete cleanedSmartContract.gasPrice;
    delete cleanedSmartContract.gas;
    delete cleanedSmartContract.ID;
    delete cleanedSmartContract.amount;
    delete cleanedSmartContract.timestamp;
    delete cleanedSmartContract.blockID;
    delete cleanedSmartContract.isPending;
    cleanedSmartContract.gasLimit = rawSmartContract.gas;

    const rows = [
      {c1: 'Executor', c2: cleanedSmartContract.executor},
      {c1: 'Nonce', c2: cleanedSmartContract.nonce},
      {c1: 'Gas limit', c2: cleanedSmartContract.gasLimit},
      {c1: 'Data', c2: cleanedSmartContract.data},
    ];
    return (
      <TransactionDetailSection
        rawTransaction={rawSmartContract}
        cleanedTransaction={JSON.stringify(cleanedSmartContract, null, 2)}
        signedHash={signature}
        buttonName={t('wallet.transactions.send')}
        type={'contract'}
        broadcast={this.broadcast}
        title={t('wallet.deploy.detail-title')}
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

  generateClick() {
    this.setState({generatingByte: true});
    this.generateAbiAndByteCode();
  }

  generateAbiAndByteCode = () => {
    const verFound = /pragma solidity \^(.*);/.exec(this.state.solidity);
    if (!verFound || !verFound[1]) {
      return this.setState({errors_solidity: t('wallet.missing_solidity_pragma'), generatingByte: false});
    }

    const rel = (window.soljsonReleases || {})[verFound[1]];
    if (!rel) {
      return this.setState({errors_solidity: t('wallet.cannot_find_solidity_version'), generatingByte: false});
    }

    // eslint-disable-next-line no-unused-expressions
    window.BrowserSolc && window.BrowserSolc.loadVersion(rel, sloc => {
      const output = sloc.compile(this.state.solidity);
      if (output.errors && output.errors.length > 0) {
        return this.setState({errors_solidity: JSON.stringify(output.errors, null, 2), generatingByte: false});
      }

      for (const contractName in output.contracts) {
        if (!output.contracts.hasOwnProperty(contractName)) {
          continue;
        }
        // code and ABI that are needed by web3
        this.setState({
          byteCode: output.contracts[contractName].bytecode,
          abi: output.contracts[contractName].interface,
          generatingByte: false,
        });

        // TODO(tian) we process just one contract
        break;
      }
    });
  };

  sendContractClick() {
    this.setState({
      broadcast: null,
      rawTransaction: null,
      nonce: this.props.address ? this.props.address.nonce + 1 : this.state.nonce,
    });
  }

  hasErrors() {
    const {errors_recipient, errors_solidity, errors_byteCode, errors_nonce, errors_gasLimit} = this.state;
    this.setState({hasErrors: errors_recipient || errors_nonce || errors_solidity || errors_byteCode || errors_gasLimit});
  }

  render() {
    const {wallet} = this.props;

    if (!wallet) {
      return null;
    }

    const {rawTransaction, broadcast, message, generatingByte, deploying} = this.state;

    if (broadcast) {
      const sendNewContract = clearButton(t('wallet.deploy.send-new'), this.sendContractClick);
      if (broadcast.success) {
        return BroadcastSuccess(broadcast.txHash, 'contract', sendNewContract);
      }
      return BroadcastFail(broadcast.error, t('wallet.deploy.broadcast.fail'), sendNewContract);
    }

    return (
      <div>
        <p className='wallet-title'>{t('wallet.deploy.title')}</p>
        {message && <div className='notification is-danger'>{message}</div>}
        <form>
          <TextInputField
            label={t('wallet.input.solidity')}
            name='solidity'
            value={this.state.solidity}
            error={t(this.state.errors_solidity)}
            textArea={true}
            placeholder={'pragma solidity ^0.4.23;\n...'}
            update={(name, value) => this.handleInputChange(name, value)}
          />
          <div style={{margin: '8px'}}/>
          {greenButton(t('wallet.deploy.generateAbiAndByteCode'), false, this.generateClick, generatingByte)}
          <div style={{margin: '4px'}}/>
          <TextInputField
            label={t('wallet.input.abi')}
            name='solidity'
            value={this.state.abi}
            error={t(this.state.errors_abi)}
            textArea={true}
            readOnly={true}
            placeholder={'...'}
          />

          <TextInputField
            label={t('wallet.input.byteCode')}
            name='byteCode'
            value={this.state.byteCode}
            error={t(this.state.errors_byteCode)}
            placeholder='0x1234...'
            textArea={true}
            update={(name, value) => this.handleInputChange(name, value)}/>

          <TextInputField
            label={t('wallet.input.gasLimit')}
            name='gasLimit'
            value={this.state.gasLimit}
            error={t(this.state.errors_gasLimit)}
            placeholder='100000'
            update={(name, value) => this.handleInputChange(name, value)}/>

          <TextInputField
            label={t('wallet.input.nonce')}
            name='nonce'
            value={this.state.nonce}
            error={t(this.state.errors_nonce)}
            placeholder='1'
            extra={this.state.nonceMessage}
            update={(name, value) => this.handleInputChange(name, value)}>
          </TextInputField>
          <br/>
          {greenButton(t('wallet.deploy.signTransaction'), this.state.hasErrors, this.deploy, deploying)}
        </form>
        <br/>
        {rawTransaction && this.displayRawSmartContract(rawTransaction)}
      </div>
    );
  }
}
