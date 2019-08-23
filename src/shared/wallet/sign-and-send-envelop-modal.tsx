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
import {
  SignParamAction,
  SignParams,
  WalletAction,
  IWalletState
} from "./wallet-reducer";
import { ITransfer, IExecution } from "iotex-antenna/lib/rpc-method/types";
import { setModalGate } from "./wallet-actions";

export interface DataSource {
  address: string;
  limit: string;
  price: string;
  amount: string;
  dataInHex: string;
  toAddress?: string;
  toContract?: string;
}

type Props = {
  envelop?: string;
  fromAddress: string;
  reqId?: number;
  modalGate: number;
} & DispatchProp<SignParamAction | WalletAction>;

interface State {
  dataSource: DataSource | null;
}

export function getDataSource(
  envelop: Envelop,
  fromAddress: string
): DataSource {
  const { gasPrice = "", gasLimit = "", transfer = null, execution = null } =
    envelop || {};

  const dataSource: Partial<DataSource> = {
    address: fromAddress,
    limit: gasLimit,
    price: `${gasPrice} (${fromRau(gasPrice, "Qev")} Qev)`
  };

  if (transfer) {
    const { recipient, amount, payload } = (transfer as unknown) as ITransfer;
    dataSource.toAddress = recipient;
    dataSource.amount = `${fromRau(amount, "IOTX")} IOTX`;
    dataSource.dataInHex = `${Buffer.from(payload as Buffer).toString("hex")}`;
  }

  if (execution) {
    const { contract, amount, data } = (execution as unknown) as IExecution;
    dataSource.toContract = contract;
    dataSource.amount = `${fromRau(amount, "IOTX")} IOTX`;
    dataSource.dataInHex = `${Buffer.from(data as Buffer).toString("hex")}`;
  }

  return dataSource as DataSource;
}

export async function deserializeEnvelop(
  source: string,
  fromAddress: string
): Promise<Envelop> {
  const meta = await getAntenna().iotx.getAccount({ address: fromAddress });
  const nonce = String(
    (meta.accountMeta && meta.accountMeta.pendingNonce) || ""
  );
  const envelop = Envelop.deserialize(Buffer.from(source || "", "hex"));

  envelop.nonce = nonce;
  return envelop;
}

class SignAndSendEnvelopModalInner extends Component<Props, State> {
  public props: Props;

  public state: State = {
    dataSource: null
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

    const { modalGate } = this.props;

    // 001 ? 0 : 100
    this.props.dispatch(setModalGate(modalGate < 1 << 2 ? 0 : 1 << 2));
  };

  public componentDidMount(): void {
    this.updateEnvelop();
  }

  public componentDidUpdate(): void {
    this.updateEnvelop();
  }

  public async updateEnvelop() {
    if (!this.props.envelop || !this.props.fromAddress) {
      return;
    }

    const envelop = await deserializeEnvelop(
      this.props.envelop as string,
      this.props.fromAddress
    );
    const dataSource = getDataSource(envelop, this.props.fromAddress);

    this.envelop = envelop;

    this.setState({ dataSource });
  }

  public render(): JSX.Element | null {
    const { dataSource } = this.state;

    if (!dataSource) {
      return null;
    }

    const { modalGate } = this.props;
    const isVisible = parseInt(modalGate.toString(2).slice(-1), 10) === 1;
    console.log("sign-and-send-envelop render ", modalGate);

    return (
      <ConfirmContractModal
        dataSource={dataSource as { [key: string]: any }}
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

export const SignAndSendEnvelopModal = connect(
  (state: { signParams: SignParams; wallet: IWalletState }) => ({
    envelop: state.signParams.envelop,
    reqId: state.signParams.reqId,
    modalGate: state.wallet.modalGate
  })
)(
  // @ts-ignore
  SignAndSendEnvelopModalInner
);
