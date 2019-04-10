// tslint:disable:no-empty
import { Form, Input } from "antd";
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { formItemLayout } from "../common/form-item-layout";
import {
  AbiFormInputItem,
  FormItemLabel,
  GasLimitFormInputItem,
  GasPriceFormInputItem,
  inputStyle,
  NonceFormInputItem
} from "./cards";
import { ContractLayout } from "./contract-layout";

const { TextArea } = Input;

export class Deploy extends Component {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.deploy.title")}>
        <DeployForm />
      </ContractLayout>
    );
  }
}

interface DeployProps extends FormComponentProps {}
type State = {};

class DeployFormInner extends Component<DeployProps, State> {
  public state: State = {};

  public handleGenerateAbiAndByteCode = () => {};

  public handleSignTransaction = () => {};

  public render(): JSX.Element {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout={"vertical"}>
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.solidity")}</FormItemLabel>}
        >
          {getFieldDecorator("generateAbiAndByteCode", {
            initialValue: "",
            rules: []
          })(
            <TextArea
              rows={4}
              style={inputStyle}
              placeholder={t("wallet.placeholder.solidity")}
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={
            <Button
              href="#"
              type="primary"
              style={{ fontSize: "0.8em", padding: "0 5px" }}
              onClick={this.handleGenerateAbiAndByteCode}
            >
              {t("wallet.deploy.generateAbiAndByteCode")}
            </Button>
          }
        />
        {AbiFormInputItem(form)}
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.byteCode")}</FormItemLabel>}
        >
          {getFieldDecorator("byteCode", {
            initialValue: "",
            rules: []
          })(
            <TextArea
              rows={4}
              style={inputStyle}
              placeholder={t("wallet.placeholder.byteCode")}
            />
          )}
        </Form.Item>
        {GasPriceFormInputItem(form)}
        {GasLimitFormInputItem(form)}
        {NonceFormInputItem(form)}
        <Form.Item
          {...formItemLayout}
          label={
            <Button
              href="#"
              type="primary"
              onClick={this.handleSignTransaction}
            >
              {t("wallet.deploy.signTransaction")}
            </Button>
          }
        />
      </Form>
    );
  }
}

export const DeployForm = Form.create({ name: "deploy-contract" })(
  DeployFormInner
);
