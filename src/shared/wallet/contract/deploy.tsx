// tslint:disable:no-empty
// tslint:disable:no-any
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
import Form from "antd/lib/form/Form";
import Input from "antd/lib/input";
// @ts-ignore
import window from "global/window";
// @ts-ignore

// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";

import { isValidBytes } from "../validator";

import Dropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";

import { toRau } from "iotex-antenna/lib/account/utils";
import isElectron from "is-electron";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
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

export class Deploy extends Component<{ address: string }> {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.deploy.title")} icon={"upload"}>
        <DeployForm address={this.props.address} />
      </ContractLayout>
    );
  }
}

interface DeployProps extends FormComponentProps {
  address?: string;
  updateWalletInfo?: any;
}

interface ISolcOutput {
  error?: string;
  errors?: Array<string>;
  contracts?: { [index: string]: any };
}

interface State {
  solidityReleaseVersion: string | undefined;
  message: string;
  sending: boolean;
  generatingByte: boolean;
  deploying: boolean;
  hasErrors: boolean;
  rawTransaction: any;
  showConfirmation: boolean;
  broadcast: {
    success: boolean;
  } | null;
  compiledOutput: any;
  txHash: string;
  constructorArgs: Array<{ name: string; type: string }>;
  loadingSolc: boolean;
}

class DeployFormInner extends Component<DeployProps, State> {
  public state: State = {
    solidityReleaseVersion: undefined,
    message: "",
    sending: false,
    generatingByte: false,
    deploying: false,
    hasErrors: false,
    rawTransaction: null,
    showConfirmation: false,
    broadcast: null,
    compiledOutput: null,
    txHash: "",
    constructorArgs: [],
    loadingSolc: true
  };

  public componentDidMount(): void {
    if (this.state.loadingSolc) {
      if (!window.soljsonReleases) {
        window.BrowserSolc.getVersions(() => {
          this.setState({
            loadingSolc: false
          });
        });
      } else {
        this.setState({
          loadingSolc: false
        });
      }
    }
  }

  public solcRefs: { [index: string]: any } = {};
  public loadSolc(version: string, callback: Function): any {
    if (this.state.loadingSolc) {
      setTimeout(() => this.loadSolc(version, callback), 1000);
      return;
    }
    if (!version) {
      callback(null);
    } else if (this.solcRefs[version]) {
      callback(this.solcRefs[version]);
    } else {
      this.setState({ loadingSolc: true });
      window.BrowserSolc.loadVersion(version, (solc: any) => {
        if (solc && solc.version()) {
          this.solcRefs[solc.version()] = solc;
          this.setState({ loadingSolc: false });
          callback(solc);
        } else {
          callback(null);
        }
      });
    }
  }

  public handleGenerateAbiAndByteCode(contract: any): void {
    const {
      form: { setFieldsValue }
    } = this.props;
    setFieldsValue({
      byteCode: contract.bytecode,
      abi: contract.interface
    });
  }

  private readonly handleSolcOutput = (output: ISolcOutput, cb: Function) => {
    if (output.error) {
      cb(t(output.error));
    } else if (
      output.errors &&
      output.errors.length > 0 &&
      output.errors.some((err: any) => err.indexOf("Warning:") === -1)
    ) {
      cb(JSON.stringify(output.errors));
    } else {
      cb();
      return output;
    }
    return null;
  };

  private readonly solidityValidator = (
    _: any,
    value: any,
    callback: Function
  ): void => {
    // reset compiledOutput
    this.setState({ compiledOutput: null });
    if (!value) {
      return callback();
    }

    if (isElectron()) {
      window.solidityCompile(value, (output: ISolcOutput) => {
        const compiledOutput = this.handleSolcOutput(output, callback);
        this.setState({ compiledOutput });
      });
      return;
    }

    const verFound = /pragma solidity \^(.*);/.exec(value);
    if (!verFound || !verFound[1]) {
      return callback(t("wallet.missing_solidity_pragma"));
    }

    const inputVersion = verFound[1];
    const solidityVersion = (window.soljsonReleases || {})[inputVersion];
    if (!solidityVersion) {
      return callback(t("wallet.cannot_find_solidity_version"));
    }
    if (solidityVersion !== this.state.solidityReleaseVersion) {
      this.setState({ solidityReleaseVersion: solidityVersion });
    }
    this.loadSolc(solidityVersion, (solc: any) => {
      if (!solc) {
        // Just incase loading solc failed
        callback(t("wallet.cannot_load_solidity_version"));
        return;
      }
      const output = solc.compile(value);
      const compiledOutput = this.handleSolcOutput(output, callback);
      this.setState({ compiledOutput });
    });
  };

  public renderConfirmation = () => {
    const { form, address } = this.props;
    const { showConfirmation } = this.state;

    const { byteCode, gasLimit, gasPrice, amount } = form.getFieldsValue();

    const dataSource = {
      address: address,
      data: byteCode,
      amount: `${Number(amount).toLocaleString()} IOTX`,
      price: toRau(gasPrice, "Qev"),
      limit: gasLimit
    };

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        confirmContractOk={this.sendContract}
        showModal={showConfirmation}
      />
    );
  };

  public sendContract = async (shouldContinue: boolean) => {
    const { form, address } = this.props;
    const antenna = getAntenna();

    if (!shouldContinue) {
      return this.setState({
        showConfirmation: false
      });
    }

    form.validateFields(async (err, value) => {
      if (err) {
        return;
      }

      const { constructorArgs } = this.state;
      const { byteCode, amount, gasLimit, gasPrice, abi } = value;
      const trimmed0xHex = String(byteCode).replace(/^0x/, "");

      const args = constructorArgs.map(arg => value[`ctor${arg.name}`]);

      const price = gasPrice ? toRau(gasPrice, "Qev") : undefined;

      window.console.log(
        `antenna.iotx.deployContract(${JSON.stringify({
          from: String(address),
          amount: toRau(amount, "Iotx"),
          data: Buffer.from(trimmed0xHex, "hex"),
          gasPrice: price,
          gasLimit: gasLimit || undefined
        })}${args.length ? ["", ...args].join(",") : ""})`
      );

      const txHash = await antenna.iotx.deployContract(
        {
          abi: abi,
          from: String(address),
          amount: toRau(amount, "Iotx"),
          data: Buffer.from(trimmed0xHex, "hex"),
          gasPrice: price,
          gasLimit: gasLimit || undefined
        },
        ...args
      );

      this.setState({
        sending: false,
        broadcast: {
          success: Boolean(txHash)
        },
        txHash
      });
    });
  };

  private readonly onClickSubmit = () => {
    this.props.form.validateFields(err => {
      if (err) {
        return;
      }

      this.setState({ showConfirmation: true });
    });
  };

  private readonly deployNewContract: JSX.Element = (
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
      return (
        <BroadcastSuccess txHash={txHash} action={this.deployNewContract} />
      );
    }
    return (
      <BroadcastFailure
        suggestedMessage={t("wallet.transfer.broadcast.fail", {
          token: t("account.testnet.token")
        })}
        errorMessage={""}
        action={this.deployNewContract}
      />
    );
  }

  public renderGenerateAbiButton(): JSX.Element {
    const { compiledOutput, loadingSolc } = this.state;
    const { contracts = {} } = compiledOutput || {};
    const contractList = Object.keys(contracts).map(contractName => ({
      ...contracts[contractName],
      contractName
    }));
    if (loadingSolc) {
      return (
        <Button
          loading={true}
          disabled={true}
          style={{ fontSize: "0.8em", padding: "0 15px", marginBottom: "32px" }}
        >
          {t("wallet.contract.loadindSolc")}
        </Button>
      );
    }
    if (!compiledOutput || !contractList.length) {
      return (
        <Button
          disabled={true}
          style={{ fontSize: "0.8em", padding: "0 5px", marginBottom: "32px" }}
        >
          {t("wallet.deploy.generateAbiAndByteCode")}
        </Button>
      );
    }
    if (contractList.length === 1) {
      return (
        // @ts-ignore
        <Button
          type="primary"
          style={{
            fontSize: "0.8em",
            padding: "0 5px",
            marginBottom: "32px"
          }}
          onClick={() => this.handleGenerateAbiAndByteCode(contractList[0])}
        >
          {t("wallet.deploy.generateAbiAndByteCode")}
        </Button>
      );
    }
    const contractMenu = (
      <Menu>
        {contractList.map(contract => (
          <Menu.Item
            key={`contract-${contract.contractName}`}
            onClick={() => this.handleGenerateAbiAndByteCode(contract)}
          >
            {`Contract ${contract.contractName.substr(1)}`}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={contractMenu}>
        {/*
          // @ts-ignore */}
        <Button
          type="primary"
          style={{
            fontSize: "0.8em",
            padding: "0 5px",
            marginBottom: "32px"
          }}
        >
          {t("wallet.deploy.generateAbiAndByteCode")} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }

  public onABIChange = () => {
    const { form } = this.props;
    setTimeout(() => {
      form.validateFields(["abi"], (error, { abi }) => {
        this.setState({ constructorArgs: [] });
        if (error) {
          return;
        }
        const jsonABI = JSON.parse(abi);
        const ctor = jsonABI.find(
          (a: { type: string }) => a.type === "constructor"
        );
        if (!ctor) {
          return;
        }
        const { inputs } = ctor;
        this.setState({ constructorArgs: [...inputs] });
      });
    }, 1);
  };

  public renderConstructorArgsForm(): JSX.Element | null {
    const { constructorArgs } = this.state;
    if (!constructorArgs.length) {
      return null;
    }
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        <h3 style={{ marginBottom: 30 }}>
          {t("wallet.contract.executeParameter")}
        </h3>
        {constructorArgs.map((arg, key) => {
          const { name, type } = arg;
          return (
            <Form.Item
              {...formItemLayout}
              label={<FormItemLabel>{name}</FormItemLabel>}
              key={key}
            >
              {getFieldDecorator(`ctor${name}`, {
                rules: [{ required: true, message: t("wallet.error.required") }]
              })(<Input className="form-input" addonAfter={type} />)}
            </Form.Item>
          );
        })}
      </>
    );
  }

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
          label={<FormItemLabel>{t("wallet.input.solidity")}</FormItemLabel>}
        >
          {getFieldDecorator("solidity", {
            initialValue: "",
            rules: [
              {
                validator: this.solidityValidator
              }
            ]
          })(
            <TextArea
              rows={4}
              style={inputStyle}
              placeholder={t("wallet.placeholder.solidity")}
            />
          )}
        </Form.Item>
        {this.renderGenerateAbiButton()}
        <AbiFormInputItem
          form={form}
          initialValue=""
          onChange={this.onABIChange}
        />
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.byteCode")}</FormItemLabel>}
        >
          {getFieldDecorator("byteCode", {
            initialValue: "",
            rules: [
              { required: true, message: t("wallet.error.required") },
              {
                validator: (_, value, callback) => {
                  const isValidErrorMessageKey = isValidBytes(value);

                  if (isValidErrorMessageKey) {
                    callback(t(isValidErrorMessageKey));
                  }

                  callback();
                }
              }
            ]
          })(
            <TextArea
              rows={4}
              style={inputStyle}
              placeholder={t("wallet.placeholder.byteCode")}
            />
          )}
        </Form.Item>
        <AmountFormInputItem form={form} initialValue={0} />
        <GasPriceFormInputItem form={form} />
        <GasLimitFormInputItem form={form} />
        {this.renderConstructorArgsForm()}
        {/*
          // @ts-ignore */}
        <Button
          type="primary"
          onClick={() => this.onClickSubmit()}
          style={{ marginBottom: "32px" }}
        >
          {t("wallet.deploy.signTransaction")}
        </Button>
        {this.renderConfirmation()}
      </Form>
    );
  }
}

export const DeployForm = Form.create<DeployProps>({ name: "deploy-contract" })(
  DeployFormInner
);
