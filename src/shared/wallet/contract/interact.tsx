// tslint:disable:no-empty
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import notification from "antd/lib/notification";
import Select from "antd/lib/select";
import { toRau } from "iotex-antenna/lib/account/utils";
import { Contract } from "iotex-antenna/lib/contract/contract";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import { copyCB } from "text-to-clipboard";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { rulesMap } from "../../common/rules";
import { BroadcastFailure, BroadcastSuccess } from "../broadcast-status";
import { getAntenna } from "../get-antenna";
import { inputStyle } from "../wallet";
import { QueryParams } from "../wallet-reducer";
import {
  AbiFormInputItem,
  AmountFormInputItem,
  FormItemLabel,
  GasLimitFormInputItem,
  GasPriceFormInputItem
} from "./cards";
import { ContractLayout } from "./contract-layout";

const { Option } = Select;

type Props = {
  fromAddress: string;
};

export class Interact extends Component<Props> {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.interact.title")} icon={"sync"}>
        {/*
        @ts-ignore */}
        <InteractForm fromAddress={this.props.fromAddress} />
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
  fromAddress: string;
  amount?: number;
  gasPrice?: string;
  gasLimit?: number;
  abi?: string;
  contractAddress?: string;
  method?: string;
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

const ContractAddressFormInputItem = ({
  form,
  initialValue
}: {
  form: WrappedFormUtils;
  initialValue: string;
}): JSX.Element => {
  const { getFieldDecorator } = form;

  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.contractAddress")}</FormItemLabel>}
    >
      {getFieldDecorator("contractAddress", {
        rules: rulesMap.address,
        initialValue
      })(
        <Input
          className="form-input"
          placeholder={t("wallet.placeholder.contractAddress")}
          name="contractAddress"
        />
      )}
    </Form.Item>
  );
};

class InteractFormInner extends Component<InteractProps, State> {
  public state: State;

  constructor(props: InteractProps) {
    super(props);
    this.state = {
      abiFunctions: null,
      selectedFunction: props.method || "",
      outputValues: [],
      broadcast: null,
      txHash: "",
      showConfirmInteract: false,
      confirmInteractFunction: () => {}
    };
  }

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

  public componentDidMount(): void {
    if (this.props.method) {
      this.handleAccess();
    }
  }

  public handleReadWithInput = () => {
    const { fromAddress } = this.props;
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
          from: fromAddress,
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
            from: fromAddress,
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
    const { fromAddress } = this.props;
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
          from: fromAddress,
          amount,
          abi,
          contractAddress,
          method: selectedFunction,
          gasPrice,
          gasLimit
        })},`,
        ...(args || []),
        ")"
      );

      try {
        const txHash = await antenna.iotx.executeContract(
          {
            from: fromAddress,
            amount: toRau(amount, "Iotx"),
            abi,
            contractAddress,
            method: selectedFunction,
            gasPrice,
            gasLimit
          },
          ...(args || [])
        );
        this.setState({
          broadcast: {
            success: Boolean(txHash)
          },
          txHash
        });
      } catch (e) {
        notification.error({
          message: `failed to executeContract: ${e}`
        });
      }
    });
  };

  private readonly renderInteractConfirmation = () => {
    const { fromAddress, form } = this.props;
    const { showConfirmInteract, confirmInteractFunction } = this.state;

    const { recipient, amount, gasLimit, gasPrice } = form.getFieldsValue();
    const dataSource = {
      address: fromAddress,
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

  private readonly copyByteCode = () => {
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const { contractAddress, abi, selectedFunction, args = [] } = values;
      const contract = new Contract(JSON.parse(abi), contractAddress);
      const bytecode = contract
        .pureEncodeMethod("0", selectedFunction, ...args)
        .data.toString("hex");
      copyCB(bytecode);
    });
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

  public renderContractMethods = () => {
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
          {getFieldDecorator("selectedFunction", {
            initialValue: this.state.selectedFunction
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
        {this.contractActions()}
      </div>
    );
  };

  public contractActions = (): JSX.Element => {
    return (
      <div>
        <div>
          {
            //@ts-ignore
            <Button type="link" onClick={this.copyByteCode}>
              {t("wallet.bytecode.copy")}
            </Button>
          }
        </div>
        <div style={{ marginTop: "10px", display: "flex" }}>
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
        </div>
        <div style={{ marginTop: "20px" }} />
      </div>
    );
  };

  public render(): JSX.Element | null {
    const { broadcast } = this.state;
    if (broadcast) {
      return this.renderBroadcast();
    }

    const { form, gasPrice, gasLimit, abi, contractAddress } = this.props;

    return (
      <Form layout={"vertical"}>
        <ContractAddressFormInputItem
          form={form}
          initialValue={contractAddress || ""}
        />
        <AmountFormInputItem form={form} initialValue={0} required={false} />
        <GasPriceFormInputItem form={form} initialValue={gasPrice} />
        <GasLimitFormInputItem form={form} initialValue={gasLimit || 1000000} />
        <AbiFormInputItem form={form} initialValue={abi} />
        <Form.Item
          {...formItemLayout}
          label={
            //@ts-ignore
            <Button type="primary" onClick={this.handleAccess}>
              {t("wallet.interact.access")}
            </Button>
          }
        />
        {this.renderContractMethods()}
        {this.renderInteractConfirmation()}
      </Form>
    );
  }
}

export const InteractForm = Form.create({ name: "interact-contract" })(
  connect((state: { queryParams: QueryParams }) => {
    return state.queryParams;
  })(InteractFormInner)
);
