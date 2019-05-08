// tslint:disable:no-empty
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
import Form from "antd/lib/form/Form";
import Input from "antd/lib/input";
import notification from "antd/lib/notification";
import Select from "antd/lib/select";
import { toRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { rulesMap } from "../../common/rules";
import { BroadcastFailure, BroadcastSuccess } from "../broadcast-status";
import { getAntenna } from "../get-antenna";
import { inputStyle } from "../wallet";
import {
  AbiFormInputItem,
  AmountFormInputItem,
  FormItemLabel,
  GasLimitFormInputItem,
  GasPriceFormInputItem
} from "./cards";
import { ContractLayout } from "./contract-layout";

const { TextArea } = Input;
const { Option } = Select;

export class Interact extends Component<{ address: string }> {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.interact.title")} icon={"sync"}>
        <InteractForm address={this.props.address} />
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

interface InteractProps extends FormComponentProps {
  address: string;
}

type State = {
  abiFunctions: AbiMap | null;
  selectedFunction: string;
  // tslint:disable-next-line:no-any
  outputValues: Array<any>;
  broadcast: {
    success: boolean;
  } | null;
  txHash: string;
  showConfirmInteract: boolean;
  confirmInteractFunction: Function;
};

class InteractFormInner extends Component<InteractProps, State> {
  public state: State = {
    abiFunctions: null,
    selectedFunction: "",
    outputValues: [],
    broadcast: null,
    txHash: "",
    showConfirmInteract: false,
    confirmInteractFunction: () => {}
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

  public handleReadWithInput = () => {
    const { address } = this.props;
    const antenna = getAntenna();

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const {
        contractAddress,
        amount,
        gasPrice,
        gasLimit,
        abi,
        selectedFunction,
        args = []
      } = values;

      window.console.log(
        `antenna.iotx.readContractByMethod(${JSON.stringify({
          from: address,
          amount,
          abi,
          contractAddress,
          method: selectedFunction,
          gasPrice,
          gasLimit
        })},`,
        ...args,
        ")"
      );

      try {
        // TODO(tian): what if multiple values returned?
        const result = await antenna.iotx.readContractByMethod(
          {
            from: address,
            amount: toRau(amount, "Iotx"),
            abi,
            contractAddress,
            method: selectedFunction,
            gasPrice,
            gasLimit
          },
          ...args
        );
        this.setState({ outputValues: [result] });
      } catch (e) {
        notification.error({
          message: e.message
        });
      }
    });
  };

  private readonly handleWrite = () => {
    const { address } = this.props;
    const antenna = getAntenna();

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const {
        contractAddress,
        amount,
        gasPrice,
        gasLimit,
        abi,
        selectedFunction,
        args
      } = values;

      window.console.log(
        `antenna.iotx.executeContract(${JSON.stringify({
          from: address,
          amount,
          abi,
          contractAddress,
          method: selectedFunction,
          gasPrice,
          gasLimit
        })},`,
        ...args,
        ")"
      );

      try {
        const txHash = await antenna.iotx.executeContract(
          {
            from: address,
            amount: toRau(amount, "Iotx"),
            abi,
            contractAddress,
            method: selectedFunction,
            gasPrice,
            gasLimit
          },
          ...args
        );
        this.setState({
          broadcast: {
            success: Boolean(txHash)
          },
          txHash
        });
      } catch (e) {
        notification.error({
          message: e.message
        });
      }
    });
  };

  private readonly confirmInteract = () => {
    const { address, form } = this.props;
    const { showConfirmInteract, confirmInteractFunction } = this.state;

    const { recipient, amount, gasLimit, gasPrice } = form.getFieldsValue();
    const dataSource = {
      address: address,
      toAddress: recipient,
      amount: toRau(amount, "Iotx"),
      limit: gasLimit,
      price: toRau(gasPrice, "Qev")
    };

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        confirmContractOk={(ok: boolean) => {
          if (ok) {
            confirmInteractFunction();
          }
          this.setState({
            showConfirmInteract: false
          });
        }}
        showModal={showConfirmInteract}
      />
    );
  };

  private readonly newInteraction: JSX.Element = (
    <Button
      onClick={() => {
        this.setState({
          broadcast: null
        });
      }}
    >
      {t("wallet.transfer.sendNew")}
    </Button>
  );

  private renderBroadcast(): JSX.Element | null {
    const { txHash, broadcast } = this.state;
    if (!broadcast) {
      return null;
    }
    if (broadcast.success) {
      return <BroadcastSuccess txHash={txHash} action={this.newInteraction} />;
    }
    return (
      <BroadcastFailure
        suggestedMessage={t("wallet.transfer.broadcast.fail", {
          token: t("account.testnet.token")
        })}
        errorMessage={""}
        action={this.newInteraction}
      />
    );
  }

  public displayMethods = () => {
    const { abiFunctions, outputValues } = this.state;
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
          {getFieldDecorator("selectedFunction")(
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
            {currentFunction.inputs.map((input, i) => (
              <Form.Item
                key={i}
                label={<FormItemLabel>{input.name}</FormItemLabel>}
                {...formItemLayout}
                help={<span>{input.type}</span>}
              >
                {getFieldDecorator(`args.${i}`, {
                  rules: rulesMap[input.type]
                })(<Input style={inputStyle} />)}
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
            {currentFunction.outputs.map((input, i) => (
              <Form.Item
                key={i}
                label={<FormItemLabel>{input.name}</FormItemLabel>}
                {...formItemLayout}
              >
                <Input disabled style={inputStyle} value={outputValues[i]} />
              </Form.Item>
            ))}
          </div>
        )}
        <span>
          {
            //@ts-ignore
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  showConfirmInteract: true,
                  confirmInteractFunction: this.handleReadWithInput
                });
              }}
            >
              {t("wallet.abi.read")}
            </Button>
          }
          {
            //@ts-ignore
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                this.setState({
                  showConfirmInteract: true,
                  confirmInteractFunction: this.handleWrite
                });
              }}
            >
              {t("wallet.abi.write")}
            </Button>
          }
        </span>
        <div style={{ marginTop: "20px" }} />
      </div>
    );
  };

  public render(): JSX.Element | null {
    const { broadcast } = this.state;
    if (broadcast) {
      return this.renderBroadcast();
    }

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
            rules: rulesMap.address
          })(
            <TextArea
              rows={4}
              style={inputStyle}
              placeholder={t("wallet.placeholder.contractAddress")}
            />
          )}
        </Form.Item>
        <AmountFormInputItem form={form} initialValue={0} />
        <GasPriceFormInputItem form={form} />
        <GasLimitFormInputItem form={form} initialValue={1000000} />
        {AbiFormInputItem(form)}
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
        {this.confirmInteract()}
      </Form>
    );
  }
}

export const InteractForm = Form.create({ name: "interact-contract" })(
  InteractFormInner
);
