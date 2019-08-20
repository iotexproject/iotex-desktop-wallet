// @ts-ignore
import window from "global/window";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { Envelop, SealedEnvelop } from "iotex-antenna/lib/action/envelop";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import ConfirmContractModal from "../common/confirm-contract-modal";
import { getAntenna } from "./get-antenna";
import { SignParamAction, SignParams } from "./wallet-reducer";

type Props = {
  envelop?: string;
  fromAddress: string;
  reqId?: number;
  deserialize?: Function;
} & DispatchProp<SignParamAction>;

class SignAndSendEnvelopModalInner extends Component<Props> {
  public props: Props;

  public state: {
    // tslint:disable-next-line:no-any
    envelop: { [key: string]: any };
    reqId?: number;
    showModal: boolean;
  } = {
    envelop: {},
    showModal: false
  };
  private envelop: Envelop;

  public async signAndSend(): Promise<void> {
    const { fromAddress, reqId } = this.props;
    const acct = getAntenna().iotx.accounts.getAccount(fromAddress);
    const sealed = SealedEnvelop.sign(
      String(acct && acct.privateKey),
      String(acct && acct.publicKey),
      this.envelop
    );
    const { actionHash } = await getAntenna().iotx.sendAction({
      action: sealed.action()
    });
    // @ts-ignore
    if (window.signed) {
      // @ts-ignore
      window.signed(reqId, JSON.stringify({ actionHash, reqId }));
    }
  }

  private readonly onOk = () => {
    this.signAndSend();
    this.onCancel();
  };

  private readonly onCancel = () => {
    this.props.dispatch({
      type: "SIGN_PARAMS",
      payload: {
        envelop: undefined,
        id: undefined
      }
    });
    this.setState({ showModal: false });
  };

  public componentDidUpdate(): void {
    const { reqId } = this.props;
    if (reqId === this.state.reqId) {
      return;
    }
    this.updateSignRequest();
  }

  public async updateSignRequest(): Promise<void> {
    const { fromAddress, reqId } = this.props;
    const meta = await getAntenna().iotx.getAccount({
      address: fromAddress
    });
    const nonce = String(
      (meta.accountMeta && meta.accountMeta.pendingNonce) || ""
    );

    const envelop = Envelop.deserialize(
      Buffer.from(this.props.envelop || "", "hex")
    );
    if (!envelop || !envelop.gasPrice || !envelop.gasLimit) {
      return;
    }
    envelop.nonce = nonce;
    this.envelop = envelop;
    this.setState({ envelop, reqId, showModal: true });
  }

  public render(): JSX.Element | null {
    const { gasPrice = "", gasLimit = "", transfer = null, execution = null } =
      this.state.envelop || {};

    const dataSource: { [index: string]: string } = {
      address: this.props.fromAddress,
      limit: gasLimit,
      price: `${gasPrice} (${fromRau(gasPrice, "Qev")} Qev)`
    };

    if (transfer) {
      dataSource.toAddress = transfer.recipient;
      dataSource.amount = `${fromRau(transfer.amount, "IOTX")} IOTX`;
      dataSource.dataInHex = `${Buffer.from(transfer.payload).toString("hex")}`;
    }

    if (execution) {
      dataSource.toContract = execution.contract;
      dataSource.amount = `${fromRau(execution.amount, "IOTX")} IOTX`;
      dataSource.dataInHex = `${Buffer.from(execution.data).toString("hex")}`;
    }

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        title={t("wallet.sign.envelop_title")}
        showModal={this.state.showModal}
        okText={t("wallet.sign.confirm")}
        confirmContractOk={(ok: boolean) =>
          ok ? this.onOk() : this.onCancel()
        }
      />
    );
  }
}

export const SignAndSendEnvelopModal = connect(
  (state: { signParams: SignParams }) => ({
    envelop: state.signParams.envelop,
    reqId: state.signParams.reqId
  })
)(
  // @ts-ignore
  SignAndSendEnvelopModalInner
);
