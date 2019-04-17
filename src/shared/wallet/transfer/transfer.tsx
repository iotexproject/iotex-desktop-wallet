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
import { BroadcastFailure, BroadcastSuccess } from "../broadcast-status";
import { getAntenna } from "../get-antenna";
import { FormItemLabel, inputStyle } from "../wallet";

type Props = {
  form: WrappedFormUtils;
  wallet: Account;
  address: AccountMeta;
  chainId?: number;
  updateWalletInfo?: Function;
} & RouteComponentProps;

type State = {
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
  },
  addressLength: {
    len: 41,
    message: t("input.error.raw_address.length")
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
    sending: false,
    txHash: "",
    broadcast: null,
    showConfirmTransfer: false
  };
  public generateTransfer = async (status: boolean) => {
    const antenna = getAntenna();
    const { wallet, form } = this.props;
    if (!status) {
      return this.setState({
        showConfirmTransfer: false
      });
    }

    form.validateFields(async (err, value) => {
      if (!err) {
        const { recipient, amount, gasLimit, gasPrice, dataInHex } = value;

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

  public showConfirmTransfer = () => {
    this.props.form.validateFields(err => {
      if (err) {
        return;
      }
      this.setState({
        showConfirmTransfer: true
      });
    });
  };
  public input = () => {
    const { getFieldDecorator } = this.props.form;
    const { sending } = this.state;
    return (
      <Form layout="vertical">
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.to")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("recipient", {
            rules: [rules.required, rules.addressLength]
          })(<Input placeholder="io..." style={inputStyle} name="recipient" />)}
        </Form.Item>
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.amount")} </FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("amount", {
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
            rules: [rules.number, rules.required]
          })(<Input style={inputStyle} placeholder="0" name="gasLimit" />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.gasPrice")}</FormItemLabel>}
        >
          {getFieldDecorator("gasPrice", {
            rules: [rules.required]
          })(<Input style={inputStyle} placeholder="0" name="gasPrice" />)}
        </Form.Item>
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.dib")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("dataInHex", {
            rules: [rules.required]
          })(
            <Input style={inputStyle} placeholder="0x1234" name="dataInHex" />
          )}
        </Form.Item>
        {
          // @ts-ignore
          <Button
            type="primary"
            loading={sending}
            onClick={this.showConfirmTransfer}
          >
            {t("wallet.transactions.send")}
          </Button>
        }
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
    const { wallet, form } = this.props;
    const { showConfirmTransfer } = this.state;

    const {
      recipient,
      amount,
      gasLimit,
      gasPrice,
      dataInHex
    } = form.getFieldsValue();
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
      <div style={{ paddingRight: 2 }}>
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
