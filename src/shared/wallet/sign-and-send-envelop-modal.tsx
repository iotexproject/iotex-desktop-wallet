import { message } from "antd";
// @ts-ignore
import window from "global/window";
import { Envelop, SealedEnvelop } from "iotex-antenna/lib/action/envelop";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import ConfirmContractModal from "../common/confirm-contract-modal";
import { getAntenna } from "./get-antenna";
import { setModalGate } from "./wallet-actions";
import {
  IWalletState,
  OriginInfo,
  SignParamAction,
  SignParams,
  WalletAction
} from "./wallet-reducer";
import {
  createWhitelistConfig,
  DataSource,
  deserializeEnvelop,
  getDataSource,
  moveGateState,
  whitelistService
} from "./whitelist";

type Props = {
  envelop?: string;
  fromAddress: string;
  reqId?: number;
  modalGate: number;
  origin: OriginInfo;
} & DispatchProp<SignParamAction | WalletAction> &
  RouteComponentProps;

interface State {
  dataSource: DataSource | null;
}
class SignAndSendEnvelopModalInner extends Component<Props, State> {
  public props: Props;

  public state: State = {
    dataSource: null
  };

  private envelop: Envelop;
  private readonly sendList: Array<number> = [];

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

    if (window.signed && !this.sendList.includes(reqId as number)) {
      window.signed(reqId, JSON.stringify({ actionHash, reqId }));
      this.sendList.push(reqId as number);
      message.success(t("wallet.sign_and_send.success", { actionHash }));
    }
    this.props.history.push(`/wallet/transfer/${actionHash}`);
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

    const nextGate = moveGateState(this.props.modalGate, "00");

    this.props.dispatch(setModalGate(nextGate));
  };

  public componentDidMount(): void {
    this.updateEnvelop();
  }

  public componentDidUpdate(): void {
    this.updateEnvelop();
  }

  public async updateEnvelop(): Promise<void> {
    if (!this.props.envelop || !this.props.fromAddress) {
      return;
    }

    const envelop = await deserializeEnvelop(
      this.props.envelop,
      this.props.fromAddress
    );
    const dataSource = getDataSource(envelop, this.props.fromAddress);
    const isInWhitelistsAndUnexpired = whitelistService.isInWhitelistsAndUnexpired(
      Date.now(),
      createWhitelistConfig(dataSource, this.props.origin)
    );

    this.envelop = envelop;

    if (isInWhitelistsAndUnexpired) {
      this.setState({ dataSource: null });
      this.onOk();
    } else {
      this.setState({ dataSource });
    }
  }

  public render(): JSX.Element | null {
    const { dataSource } = this.state;

    if (!dataSource) {
      return null;
    }

    const { modalGate } = this.props;
    const isVisible = parseInt(modalGate.toString(2).slice(-1), 10) === 1;

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        title={t("wallet.sign.envelop_title")}
        maskClosable={false}
        showModal={isVisible}
        okText={t("wallet.sign.confirm")}
        confirmContractOk={(ok: boolean) =>
          ok ? this.onOk() : this.onCancel()
        }
      />
    );
  }
}

export const SignAndSendEnvelopModal = withRouter(
  connect((state: { signParams: SignParams; wallet: IWalletState }) => ({
    envelop: state.signParams.envelop,
    reqId: state.signParams.reqId,
    modalGate: state.wallet.modalGate,
    origin: state.wallet.origin
  }))(
    // @ts-ignore
    SignAndSendEnvelopModalInner
  )
);
