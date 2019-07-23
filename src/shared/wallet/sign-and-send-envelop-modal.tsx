import { Modal } from "antd";
// @ts-ignore
import window from "global/window";
import { Envelop, SealedEnvelop } from "iotex-antenna/lib/action/envelop";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
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

  public state: { envelop: String };
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
  };

  public componentDidMount(): void {
    this.shouldComponentUpdate();
  }

  // @ts-ignore
  public async shouldComponentUpdate(): Promise<boolean> {
    const meta = await getAntenna().iotx.getAccount({
      address: this.props.fromAddress
    });
    const nonce = String(
      (meta.accountMeta && meta.accountMeta.pendingNonce) || ""
    );

    const envelop = Envelop.deserialize(
      Buffer.from(this.props.envelop || "", "hex")
    );
    envelop.nonce = nonce;
    this.envelop = envelop;
    this.setState({ envelop: JSON.stringify(envelop, null, 2) });
    return true;
  }

  public render(): JSX.Element | null {
    const { envelop } = this.props;
    if (!envelop) {
      return null;
    }
    const envelopText = this.state && this.state.envelop;
    return (
      <Modal
        title={t("wallet.sign.envelop_title")}
        visible={Boolean(envelopText)}
        okText={t("wallet.sign.confirm")}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <pre>
          <code>{envelopText}</code>
        </pre>
      </Modal>
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
