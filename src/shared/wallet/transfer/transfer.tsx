import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import { Account } from "iotex-antenna/lib/account/account";
import { toRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import * as React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { AccountMeta } from "../../../api-gateway/resolvers/antenna-types";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { PageTitle } from "../../common/page-title";
import { colors } from "../../common/styles/style-color";
import { BroadcastFailure, BroadcastSuccess } from "../broadcastedTransaction";
import { getAntenna } from "../get-antenna";
import { buttonStyle, FormItemLabel, inputStyle } from "../wallet";

type Props = {
  form: WrappedFormUtils;
  wallet: Account;
  address: AccountMeta;
  chainId?: number;
  updateWalletInfo?: Function;
} & RouteComponentProps;

type State = {
  recipient: string;
  amount: string;
  gasLimit: number;
  gasPrice: string;
  dataInHex: string;
  sending: boolean;
  txHash: string;
  broadcast: {
    success: boolean;
  } | null;
  showConfirmTransfer: boolean;
};

export const rules = {
  required: {
    required: true,
    message: t("wallet.error.required")
  },
  number: {
    type: "number",
    message: t("wallet.error.number"),
    transform: (value: string) => {
      return Number(value);
    }
  }
};

export const actionBtnStyle = {
  height: "40px",
  border: "none",
  background: colors.black10,
  color: colors.secondary,
  fontWeight: 500,
  lineHeight: "40px"
};
class TransferForm extends React.PureComponent<Props, State> {
  public state: State = {
    recipient:
      "bace9b2435db45b119e1570b4ea9c57993b2311e0c408d743d87cd22838ae892",
    amount: "0",
    gasLimit: 0,
    gasPrice: "0",
    dataInHex: "0x123",
    sending: false,
    txHash: "",
    broadcast: null,
    showConfirmTransfer: false
  };
  public generateTransfer = async () => {
    const antenna = getAntenna();
    const { wallet, form } = this.props;
    const { recipient, amount, gasLimit, gasPrice, dataInHex } = this.state;

    form.validateFields(async err => {
      if (!err) {
        this.setState({ sending: true, showConfirmTransfer: false });
        const txHash = await antenna.iotx.sendTransfer({
          from: wallet.address,
          to: recipient,
          value: toRau(amount, "Iotx"),
          payload: dataInHex,
          gasLimit: String(gasLimit),
          gasPrice: String(gasPrice)
        });

        this.setState({
          sending: false,
          broadcast: {
            success: txHash ? true : false
          },
          txHash
        });
      }
    });
  };
  public input = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      recipient,
      amount,
      gasLimit,
      dataInHex,
      sending,
      gasPrice
    } = this.state;
    return (
      <Form layout="vertical">
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.to")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("recipient", {
            initialValue: recipient,
            rules: [rules.required]
          })(<Input placeholder="io..." style={inputStyle} name="recipient" />)}
        </Form.Item>
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.amount")} </FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("amount", {
            initialValue: amount,
            rules: [rules.number, rules.required]
          })(
            <Input
              className="form-input"
              placeholder="1"
              addonAfter="IOTX"
              name="amount"
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.gasLimit")}</FormItemLabel>}
          help={
            <span style={{ color: "#faad14" }}>
              {t("wall.input.gasLimit-help")}
            </span>
          }
        >
          {getFieldDecorator("gasLimit", {
            initialValue: gasLimit,
            rules: [rules.number, rules.required]
          })(
            <Input
              style={inputStyle}
              placeholder="0"
              disabled={true}
              name="gasLimit"
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.gasPrice")}</FormItemLabel>}
        >
          {getFieldDecorator("gasPrice", {
            initialValue: gasPrice,
            rules: [rules.required]
          })(<Input style={inputStyle} placeholder="0" name="gasPrice" />)}
        </Form.Item>
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.dib")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("dataInHex", {
            initialValue: dataInHex,
            rules: [rules.required]
          })(
            <Input style={inputStyle} placeholder="0x1234" name="dataInHex" />
          )}
        </Form.Item>
        <Button
          style={buttonStyle}
          loading={sending}
          onClick={() => {
            this.setState({
              showConfirmTransfer: true
            });
          }}
        >
          {t("wallet.transactions.send")}
        </Button>
      </Form>
    );
  };

  public sendNewIOTX: JSX.Element = (
    <Button
      style={{ ...actionBtnStyle, marginLeft: "10px" }}
      onClick={() => {
        this.setState({
          broadcast: null
        });
      }}
    >
      {`${t("wallet.transfer.sendNew")} ${t("account.testnet.token")}`}
    </Button>
  );

  public displayRawTransfer = () => {
    return (
      <Row gutter={4}>
        <Col span={12}>
          <label>{t("wallet.transactionDetail.raw")}</label>
          <pre />
        </Col>
        <Col span={12}>
          <label>{t("wallet.transactionDetail.raw")}</label>
          <pre />
        </Col>
      </Row>
    );
  };

  public confirmTransfer = () => {
    const { wallet } = this.props;
    const {
      showConfirmTransfer,
      recipient,
      amount,
      gasLimit,
      gasPrice,
      dataInHex
    } = this.state;
    const dataSource = {
      address: wallet.address,
      toAddress: recipient,
      amount,
      limit: gasLimit,
      price: gasPrice,
      nonce: dataInHex
    };

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        confirmContractOk={this.generateTransfer}
        showModal={showConfirmTransfer}
      />
    );
  };
  public render(): JSX.Element {
    const { txHash, broadcast } = this.state;

    if (broadcast) {
      if (broadcast.success) {
        return (
          <BroadcastSuccess
            type="transfer"
            txHash={txHash}
            action={this.sendNewIOTX}
          />
        );
      }
      return (
        <BroadcastFailure
          suggestedMessage={t("wallet.transfer.broadcast.fail", {
            token: t("account.testnet.token")
          })}
          errorMessage={""}
          action={this.sendNewIOTX}
        />
      );
    }

    return (
      <div>
        <Helmet
          title={`${t("wallet.transfer.title")} - ${t("meta.description")}`}
        />
        <PageTitle>
          <Icon type="pushpin" /> {t("wallet.transfer.title")}
        </PageTitle>
        {this.input()}
        {this.confirmTransfer()}
      </div>
    );
  }
}

export default withRouter(Form.create<TransferForm>()(TransferForm));
