// @flow

import Component from 'inferno-component';
import serialize from 'form-serialize';
import {hexToDec} from 'hex2dec';
import converter from 'hex2ascii';
import {boolInput, textInput} from '../../common/inputfields/stateless-inputs';
import {t} from '../../../lib/iso-i18n';
import {greenButton} from '../../common/buttons';
import {WALLET} from '../../common/site-url';
import {fetchPost} from '../../../lib/fetch-post';
import {isINTType} from '../validator';
import type {GExecution} from '../../../server/gateways/iotex-core/iotex-core-types';
import type {TWallet} from '../../../entities/wallet-types';
import {encodeInputData} from './abi-to-byte';

export class AbiFunctions extends Component {
  props: {
    abiFunctions: any,
    selectedFunction: string,
    writeData: any,
    readData: any,
    contractAddress: string,
    wallet: TWallet,
    nonce: number,
    gas: number,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      formData: null,
      fetching: false,
      message: '',
      returnValue: '',
      selectedFunction: '',
    };

    (this: any).handleWrite = this.handleWrite.bind(this);
    (this: any).handleRead = this.handleRead.bind(this);
    (this: any).handleReadWithInput = this.handleReadWithInput.bind(this);
  }

  componentWillReceiveProps(nextProps: {selectedFunction: string, abiFunctions: any, contractAddress: string, wallet: TWallet}, nextContext: any) {
    if (nextProps.selectedFunction !== this.state.selectedFunction) {
      this.setState({selectedFunction: nextProps.selectedFunction, message: '', returnValue: '', fetching: false});
    }
  }

  handleWrite() {
    const {abiFunctions, selectedFunction, writeData} = this.props;

    const input = serialize(this._form, {hash: true});
    this.setState({formData: input});

    const data = encodeInputData(abiFunctions, selectedFunction, input);
    writeData(data);
  }

  handleReadWithInput() {
    const {abiFunctions, selectedFunction, contractAddress, wallet} = this.props;
    this.handleRead(abiFunctions, selectedFunction, contractAddress, wallet, true);
  }

  handleRead(abiFunctions: any, selectedFunction: string, contractAddress: string, wallet: TWallet, hasInput: boolean) {
    const {nonce, gas} = this.props;

    let data = '';
    if (hasInput) {
      const input = serialize(this._form, {hash: true});
      data = encodeInputData(abiFunctions, selectedFunction, input);
    }

    const rawTransaction: GExecution = {
      ID: '',
      amount: 0,
      version: 0x1,
      nonce: parseInt(nonce, 10),
      signature: '',
      executor: wallet.rawAddress,
      contract: contractAddress,
      executorPubKey: wallet.publicKey,
      gas: parseInt(gas, 10),
      gasPrice: 0,
      data,
      timestamp: 0,
      blockID: '',
      isPending: false,
    };

    this.setState({fetching: true});
    fetchPost(WALLET.READ_EXECUTION, {rawTransaction}).then(res => {
      if (!res.ok) {
        this.setState({fetching: false, message: res.error.message});
      } else {
        this.setState({returnValue: res.result, fetching: false, message: ''});
      }
    });
  }

  convertByteToValue(type: string, bytes: string): string {
    if (type === 'bool') {
      const value = hexToDec(`0x${bytes}`);
      if (value) {
        return 'true';
      }
      return 'false';
    }

    if (isINTType(type)) {
      return hexToDec(`0x${bytes}`).toString();
    }
    return converter.hex2ascii(`0x${bytes}`);
  }

  render() {
    const {abiFunctions, selectedFunction} = this.props;
    const {message, fetching, returnValue} = this.state;

    if (!abiFunctions[selectedFunction]) {
      return null;
    }

    const isRead = abiFunctions[selectedFunction].constant;

    return (
      <div>
        <form name={selectedFunction} ref={r => (this._form = r)}>
          {abiFunctions[selectedFunction].inputs.length > 0 && <p><strong>{t('abi.input')}</strong></p>}
          <div>
            {abiFunctions[selectedFunction].inputs.map(input => {
              if (input.type === 'bool') {
                return boolInput(input.name);
              }
              return textInput(input.name, input.type);
            })}
          </div>
          <br/>
          {abiFunctions[selectedFunction].outputs.length > 0 && <p><strong>{t('abi.return')}</strong></p>}
          <div>
            {message && <div className='notification is-danger'>{t(message)}</div>}
            {fetching ? <p>Fetching return value ...</p> :
              <div>
                {abiFunctions[selectedFunction].outputs.map(output =>
                  textInput(`↳ ${output.name}`, output.type, true, message ? '' : this.convertByteToValue(output.type, returnValue))
                )}
              </div>
            }
          </div>
          <br/>
          {isRead ?
            greenButton(t('wallet.abi.read'), false, this.handleReadWithInput, false) :
            greenButton(t('wallet.abi.write'), false, this.handleWrite, false)
          }
        </form>
      </div>
    );
  }
}
