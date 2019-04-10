// tslint:disable:no-empty
import { Form, Input } from "antd";
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
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

export class Interact extends Component {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.interact.title")}>
        <InteractForm />
      </ContractLayout>
    );
  }
}

interface InteractProps extends FormComponentProps {}
type State = {};

class InteractFormInner extends Component<InteractProps, State> {
  public state: State = {};

  public handleAccess = () => {};

  public render(): JSX.Element {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout={"vertical"}>
        <Form.Item
          {...formItemLayout}
          label={
            <FormItemLabel>{t("wallet.input.contractAddress")}</FormItemLabel>
          }
        >
          {getFieldDecorator("contractAddress", {
            initialValue: "",
            rules: []
          })(
            <TextArea
              rows={4}
              style={inputStyle}
              placeholder={t("wallet.placeholder.contractAddress")}
            />
          )}
        </Form.Item>
        {NonceFormInputItem(form)}
        {GasPriceFormInputItem(form)}
        {GasLimitFormInputItem(form)}
        {AbiFormInputItem(form)}
        <Form.Item
          {...formItemLayout}
          label={
            <Button href="#" type="primary" onClick={this.handleAccess}>
              {t("wallet.interact.access")}
            </Button>
          }
        />
      </Form>
    );
  }
}

export const InteractForm = Form.create({ name: "interact-contract" })(
  InteractFormInner
);
