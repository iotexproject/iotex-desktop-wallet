import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import * as React from "react";
import { AccountMeta } from "../../../api-gateway/resolvers/antenna-types";
import { formItemLayout } from "../../common/form-item-layout";
import { FormItemLabel, inputStyle } from "../wallet";
export interface Props {
  form: WrappedFormUtils;
  wallet: Account;
  address: AccountMeta;
  chainId?: number;
  updateWalletInfo?: Function;
}
export interface State {
  recipient: string;
  amount: number;
  gasLimit: number;
  dataInHex: string;
  generating: boolean;
}

export const rules = {
  required: {
    required: true,
    message: t("wallet.error.required")
  }
};

class TransferComponent extends React.Component<Props, State> {
  public state: State = {
    recipient: "",
    amount: 0,
    gasLimit: 0,
    dataInHex: "",
    generating: false
  };
  public generateTransfer = () => {
    this.setState({ generating: true });
  };
  public input = () => {
    const { getFieldDecorator } = this.props.form;
    const { recipient, amount, gasLimit, dataInHex, generating } = this.state;
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
            rules: [
              {
                type: "number",
                message: t("wallet.error.number"),
                transform: value => {
                  return Number(value);
                }
              },
              rules.required
            ]
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
            rules: [
              {
                type: "number",
                message: t("wallet.error.number")
              },
              rules.required
            ]
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
          href="#"
          type="primary"
          loading={generating}
          onClick={this.generateTransfer}
        >
          {t("wallet.input.generate")}
        </Button>
      </Form>
    );
  };
  public render(): JSX.Element {
    return (
      <div>
        <Helmet title={`${t("wallet.transfer.title")} - IoTeX`} />
        {this.input()}
      </div>
    );
  }
}

export default Form.create<TransferComponent>()(TransferComponent);
