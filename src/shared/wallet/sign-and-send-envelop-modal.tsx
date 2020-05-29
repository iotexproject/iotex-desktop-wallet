import { message } from "antd";
// @ts-ignore
import window from "global/window";
import { Envelop, SealedEnvelop } from "iotex-antenna/lib/action/envelop";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { N2E_ABI } from "../../erc20/abi";
import ConfirmContractModal from "../common/confirm-contract-modal";
import { getAntenna } from "./get-antenna";
import {
  IWalletState,
  SignParamAction,
  SignParams,
  WalletAction
} from "./wallet-reducer";
import {
  createWhitelistConfig,
  DataSource,
  deserializeEnvelop,
  getDataSource,
  whitelistService
} from "./whitelist";
import { Whitelist, WhitelistSetting } from "./whitelist-setting";

type Props = {
  envelop?: string;
  fromAddress: string;
  reqId?: number;
  origin: string;
  network: {
    name: string;
    url: string;
  };
} & DispatchProp<SignParamAction | WalletAction> &
  RouteComponentProps;

interface State {
  dataSource: DataSource | null;
  showWhitelist: boolean;
  saveWhitelist: boolean;
  isWhitelistEnable: boolean;
}
class SignAndSendEnvelopModalInner extends Component<Props, State> {
  public props: Props;

  public state: State = {
    dataSource: null,
    showWhitelist: false,
    saveWhitelist: false,
    isWhitelistEnable: false
  };

  private envelop: Envelop;
  private readonly sendList: Array<number> = [];

  private whitelist: WhitelistSetting;

  public async signAndSend(): Promise<void> {
    const { fromAddress, reqId, network } = this.props;
    const antenna = getAntenna();
    let signed;
    if (!antenna.iotx.signer || !antenna.iotx.signer.signOnly) {
      const acct = getAntenna().iotx.accounts.getAccount(fromAddress);
      signed = SealedEnvelop.sign(
        String(acct && acct.privateKey),
        String(acct && acct.publicKey),
        this.envelop
      );
    } else {
      signed = await antenna.iotx.signer.signOnly(this.envelop);
    }
    const { actionHash } = await getAntenna().iotx.sendAction({
      action: signed.action()
    });

    if (window.signed && !this.sendList.includes(reqId as number)) {
      window.signed(reqId, JSON.stringify({ actionHash, reqId, network }));
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
    if (this.state.showWhitelist) {
      this.whitelist.onOk();
    }
  };

  public componentDidMount(): void {
    this.updateEnvelop();
  }

  public componentDidUpdate(nextProps: Props): void {
    this.updateEnvelop(nextProps);
  }

  public async updateEnvelop(nextProps?: Props): Promise<void> {
    if (
      !this.props.envelop ||
      !this.props.fromAddress ||
      (nextProps && this.props.reqId === nextProps.reqId)
    ) {
      return;
    }

    const envelop = await deserializeEnvelop(
      this.props.envelop,
      this.props.fromAddress
    );
    const dataSource = getDataSource(envelop, this.props.fromAddress, N2E_ABI);
    const { origin } = this.props;
    const isInWhitelistsAndUnexpired = whitelistService.isInWhitelistsAndUnexpired(
      Date.now(),
      createWhitelistConfig(dataSource, origin)
    );
    const isWhitelistEnable = whitelistService.isWhitelistEnable();

    this.envelop = envelop;

    if (isWhitelistEnable && isInWhitelistsAndUnexpired) {
      this.setState({ dataSource: null, isWhitelistEnable });
      this.onOk();
    } else {
      this.setState({ dataSource, isWhitelistEnable });
    }
  }

  public render(): JSX.Element | null {
    const { dataSource } = this.state;

    if (!dataSource) {
      return null;
    }

    const { method, toAddress, amount, toContract } = dataSource;
    const recipient = (toAddress || toContract) as string;
    const showWhitelistBtn = isElectron() && this.state.isWhitelistEnable;
    const showWhitelistForm =
      this.state.showWhitelist && whitelistService.isWhitelistEnable();

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        title={t("wallet.sign.envelop_title")}
        maskClosable={false}
        showModal={!!this.props.envelop}
        okText={t("wallet.sign.confirm")}
        showWhitelistBtn={showWhitelistBtn}
        onWhitelistBtnClick={() =>
          this.setState({ showWhitelist: !this.state.showWhitelist })
        }
        confirmContractOk={(ok: boolean) =>
          ok ? this.onOk() : this.onCancel()
        }
      >
        {showWhitelistForm && (
          <Whitelist
            origin={this.props.origin}
            method={method}
            amount={amount}
            recipient={recipient}
            handleWhitelist={ref => (this.whitelist = ref)}
          />
        )}
      </ConfirmContractModal>
    );
  }
}

// tslint:disable: no-any
export const SignAndSendEnvelopModal: any = withRouter(
  connect((state: { signParams: SignParams; wallet: IWalletState }) => ({
    envelop: state.signParams.envelop,
    reqId: state.signParams.reqId,
    origin: state.signParams.origin,
    network: state.wallet.network
  }))(
    // @ts-ignore
    SignAndSendEnvelopModalInner
  )
);
