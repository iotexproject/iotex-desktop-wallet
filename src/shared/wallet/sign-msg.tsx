import { message } from "antd";
import Modal from "antd/lib/modal/Modal";
// @ts-ignore
import window from "global/window";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Board } from "../common/board";
import { ModalBody } from "../common/modal-body";
import { getAntenna } from "./get-antenna";
import {
  actionClearSignMsg,
  IRPCProvider,
  IWalletState,
  SignParams
} from "./wallet-reducer";

type Props = {
  fromAddress: string;
} & {
  actionClearSignMsg?: Function;
  msg?: string;
  type?: "SIGN_AND_SEND" | "GET_ACCOUNTS" | "SIGN_MSG";
  reqId?: number;
  network?: IRPCProvider;
};

class SignMsg extends Component<Props> {
  private readonly onOk = async () => {
    const { fromAddress, msg, reqId, network } = this.props;
    const acct = getAntenna().iotx.accounts.getAccount(fromAddress);
    if (!acct) {
      return;
    }
    const sig = await acct.sign(msg || "");
    window.signed(
      reqId,
      JSON.stringify({ sig: sig.toString("hex"), reqId, network })
    );
    message.success(t("wallet.sign.success"));
    // tslint:disable-next-line:no-unused-expression
    this.props.actionClearSignMsg && this.props.actionClearSignMsg();
  };

  private readonly onCancel = () => {
    // tslint:disable-next-line:no-unused-expression
    this.props.actionClearSignMsg && this.props.actionClearSignMsg();
  };

  public render(): JSX.Element | null {
    const { msg, type } = this.props;
    const visible = Boolean(type === "SIGN_MSG" && msg);
    return (
      <>
        <Modal
          visible={visible}
          title={t("wallet.sign_msg")}
          okText={t("wallet.confirm.contract.yes")}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <ModalBody>
            <Board>{msg}</Board>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export const SignMsgContainer = connect(
  (state: { signParams: SignParams; wallet: IWalletState }) => {
    return {
      msg: state.signParams.msg,
      type: state.signParams.type,
      reqId: state.signParams.reqId,
      network: state.wallet.network
    };
  },
  dispatch => {
    return {
      actionClearSignMsg: () => dispatch(actionClearSignMsg())
    };
  }
)(SignMsg);
