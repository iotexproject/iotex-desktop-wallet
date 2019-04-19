// tslint:disable:no-empty
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
import Form from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Select from "antd/lib/select";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { formItemLayout } from "../../common/form-item-layout";
import { rulesMap } from "../../common/rules";
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
const { Option } = Select;

export class Interact extends Component {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.interact.title")} icon={"sync"}>
        <InteractForm />
      </ContractLayout>
    );
  }
}

export interface AbiInput {
  name: string;
  type: string;
  indexed: boolean;
}

export interface Abi {
  name: string;
  type: string;
  constant: boolean;
  inputs: Array<AbiInput>;
  outputs: Array<AbiInput>;
}

export interface AbiMap {
  [key: string]: Abi;
}

interface InteractProps extends FormComponentProps {}
type State = {
  abiFunctions: AbiMap | null;
  selectedFunction: string;
};

class InteractFormInner extends Component<InteractProps, State> {
  public state: State = {
    abiFunctions: null,
    selectedFunction: ""
  };

  public handleAccess = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { abi } = values;
        const abiFunctions: AbiMap = {};

        const abis: Array<Abi> = JSON.parse(abi);
        abis.forEach(f => {
          if (f.type === "function") {
            abiFunctions[f.name] = f;
          }
        });
        this.setState({ abiFunctions });
      }
    });
  };

  public handleReadWithInput = () => {};

  public handleWrite = () => {};

  public displayMethods = () => {
    const { abiFunctions } = this.state;
    const { getFieldDecorator } = this.props.form;

    const { selectedFunction } = this.props.form.getFieldsValue();
    if (!abiFunctions) {
      return null;
    }

    const currentFunction = abiFunctions[selectedFunction];

    return (
      <div>
        <Form.Item
          label={<FormItemLabel>{t("wallet.interact.contract")}</FormItemLabel>}
        >
          {getFieldDecorator("selectedFunction", {
            initialValue: "",
            rules: []
          })(
            <Select className="form-input">
              {Object.keys(abiFunctions).map(name => (
                <Option value={name} key={name}>
                  {name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {currentFunction && currentFunction.inputs.length > 0 && (
          <div>
            <Form.Item
              label={<FormItemLabel>{t("abi.input")}</FormItemLabel>}
              {...formItemLayout}
            />
            {currentFunction.inputs.map(input => (
              <Form.Item
                label={<FormItemLabel>{input.name}</FormItemLabel>}
                {...formItemLayout}
              >
                <Input disabled style={inputStyle} />
              </Form.Item>
            ))}
          </div>
        )}
        {currentFunction && currentFunction.outputs.length > 0 && (
          <div>
            <Form.Item
              label={<FormItemLabel>{t("abi.return")}</FormItemLabel>}
              {...formItemLayout}
            />
            {currentFunction.outputs.map(input => (
              <Form.Item
                label={<FormItemLabel>{input.name}</FormItemLabel>}
                {...formItemLayout}
              >
                <Input disabled style={inputStyle} />
              </Form.Item>
            ))}
          </div>
        )}
        <span>
          {
            //@ts-ignore
            <Button type="primary" onClilck={this.handleReadWithInput}>
              {t("wallet.abi.read")}
            </Button>
          }
          {
            //@ts-ignore
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              onCLick={this.handleWrite}
            >
              {t("wallet.abi.write")}
            </Button>
          }
        </span>
        <div style={{ marginTop: "20px" }} />
      </div>
    );
  };

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
            initialValue: "io17mqh2zntqfrq5342c2u082lvkwjvx9qaz583xk",
            rules: rulesMap.address
          })(
            <TextArea
              rows={4}
              style={inputStyle}
              placeholder={t("wallet.placeholder.contractAddress")}
            />
          )}
        </Form.Item>
        {NonceFormInputItem(form, 1)}
        {GasPriceFormInputItem(form, "1")}
        {GasLimitFormInputItem(form, 1)}
        {AbiFormInputItem(form, t("wallet.interact.abiTemplate"))}
        <Form.Item
          {...formItemLayout}
          label={
            //@ts-ignore
            <Button type="primary" onClick={this.handleAccess}>
              {t("wallet.interact.access")}
            </Button>
          }
        />
        {this.displayMethods()}
      </Form>
    );
  }
}

export const InteractForm = Form.create({ name: "interact-contract" })(
  InteractFormInner
);
