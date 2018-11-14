// @flow

import Component from 'inferno-component';
import {fetchPost} from '../../lib/fetch-post';
import {WALLET} from '../common/site-url';
import {t} from '../../lib/iso-i18n';
import {Dialogue} from '../common/dialogue/dialogue';
import {cancelButton, greenButton} from '../common/buttons';

export class TransactionDetailSection extends Component {
  props: {
    buttonName: string,
    rawTransaction: any,
    cleanedTransaction: string,
    signedHash: string,
    type: string,
    broadcast: any,
    children: any,
    title: string,
    isCrossChainTransfer: boolean;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      sending: false,
      message: null,
      txHash: '',
    };

    (this: any).setDialogueActiveButton = this.setDialogueActiveButton.bind(this);
    (this: any).setDialogueNotActiveButton = this.setDialogueNotActiveButton.bind(this);
    (this: any).sendTransactionButton = this.sendTransactionButton.bind(this);
    (this: any).sendTransaction = this.sendTransaction.bind(this);
  }

  sendTransaction(rawTransaction: any, type: string) {
    const {isCrossChainTransfer} = this.props;
    this.setState({sending: true});
    const request = {rawTransaction, type};
    if (isCrossChainTransfer) {
      request.isCrossChainTransfer = isCrossChainTransfer;
    }
    fetchPost(WALLET.SEND_TRANSACTION, request).then(res => {
      if (!res.ok) {
        this.props.broadcast({success: false, error: res.error.message});
        this.setState({message: t(res.error.message), sent: true, txHash: '', sending: false});
      } else {
        this.props.broadcast({success: true, txHash: res.hash});
        this.setState({sent: true, txHash: res.hash, sending: false});
      }
    });
  }

  setDialogueActiveButton() {
    this.setDialogueActive(true);
  }

  setDialogueNotActiveButton() {
    this.setDialogueActive(false);
  }

  sendTransactionButton() {
    const {rawTransaction, type} = this.props;
    this.sendTransaction(rawTransaction, type);
  }

  render() {
    const {cleanedTransaction, signedHash, buttonName, children, title} = this.props;
    const {sending} = this.state;

    return (
      <div>
        <Dialogue
          getSetActiveFn={setDialogueActive => this.setDialogueActive = setDialogueActive}
          title={title}
          cancelButton={cancelButton(this.setDialogueNotActiveButton)}
          submitButton={greenButton(t('wallet.transactioNDetail.yes'), false, this.sendTransactionButton, sending)}>
          {children}
        </Dialogue>
        <div className='column'>
          <label className='label'>{t('wallet.transactionDetail.raw')}</label>
          <pre>{cleanedTransaction}</pre>
        </div>
        <div className='column'>
          <label className='label'>{t('wallet.transactionDetail.signed')}</label>
          <pre>{signedHash}</pre>
        </div>
        {greenButton(buttonName, false, this.setDialogueActiveButton, false)}
      </div>
    );
  }
}
