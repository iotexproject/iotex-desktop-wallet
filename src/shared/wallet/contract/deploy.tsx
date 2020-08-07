// tslint:disable:no-empty
// tslint:disable:no-any
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
import Form from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Select from "antd/lib/select";
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
import { Query, QueryResult } from "react-apollo";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { numberFromCommaString } from "../../common/vertical-table";
import { COMPILE_SOLIDITY, GET_SOLC_VERSIONS } from "../../queries";
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

interface SolcVersion {
  name: string;
  version: string;
  type: string;
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
  txHash: string;
  constructorArgs: Array<{ name: string; type: string }>;
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
    txHash: "",
    constructorArgs: []
  };

  public handleGenerateAbiAndByteCode(contract: any): void {
    const {
      form: { setFieldsValue }
    } = this.props;
    setFieldsValue({
      byteCode: contract.bytecode,
      abi: contract.abi
    });
  }

  public renderConfirmation = () => {
    const { form, address } = this.props;
    const { showConfirmation } = this.state;

    const {
      byteCode,
      gasLimit,
      gasPrice,
      amount: commaAmount
    } = form.getFieldsValue();
    const amount = numberFromCommaString(commaAmount);

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
      const { byteCode, gasLimit, gasPrice, abi } = value;
      const amount = numberFromCommaString(value.amount);
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

  public renderContractMenu(
    contracts: Array<{ name: string; abi: string; bytecode: string }>
  ): JSX.Element {
    const contractMenu = (
      <Menu>
        {contracts.map(contract => (
          <Menu.Item
            key={`contract-${contract.name}`}
            onClick={() => this.handleGenerateAbiAndByteCode(contract)}
          >
            {`Contract ${contract.name.substr(1)}`}
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

  public renderGenerateAbiButton(): JSX.Element {
    const { setFields, getFieldsValue, getFieldError } = this.props.form;
    const source = getFieldsValue().solidity;
    const version = this.state.solidityReleaseVersion;
    if (!source || !version) {
      return (
        <Button
          disabled={true}
          style={{ fontSize: "0.8em", padding: "0 5px", marginBottom: "32px" }}
        >
          {t("wallet.deploy.generateAbiAndByteCode")}
        </Button>
      );
    }
    return (
      <Query query={COMPILE_SOLIDITY} variables={{ source, version }}>
        {({ data, loading, error }: QueryResult) => {
          if (loading) {
            return (
              <Button
                loading={true}
                disabled={true}
                style={{
                  fontSize: "0.8em",
                  padding: "0 15px",
                  marginBottom: "32px"
                }}
              >
                {t("wallet.contract.loadindSolc")}
              </Button>
            );
          }
          const returnGetFieldError = getFieldError("solidity");
          if (error && (!returnGetFieldError || !returnGetFieldError.length)) {
            setFields({
              solidity: {
                value: source,
                errors: [error]
              }
            });
          }
          if (!error && returnGetFieldError && returnGetFieldError.length) {
            setFields({
              solidity: {
                value: source,
                errors: error ? [error] : []
              }
            });
          }

          if (
            error ||
            !data ||
            !data.compileSolidity ||
            data.compileSolidity.length === 0
          ) {
            return (
              <Button
                disabled={true}
                style={{
                  fontSize: "0.8em",
                  padding: "0 5px",
                  marginBottom: "32px"
                }}
              >
                {t("wallet.deploy.generateAbiAndByteCode")}
              </Button>
            );
          }
          if (data.compileSolidity.length === 1) {
            return (
              // @ts-ignore
              <Button
                type="primary"
                style={{
                  fontSize: "0.8em",
                  padding: "0 5px",
                  marginBottom: "32px"
                }}
                onClick={() =>
                  this.handleGenerateAbiAndByteCode(data.compileSolidity[0])
                }
              >
                {t("wallet.deploy.generateAbiAndByteCode")}
              </Button>
            );
          }
          return this.renderContractMenu(data.compileSolidity);
        }}
      </Query>
    );
  }

  private validateTimeoutID: NodeJS.Timeout;
  public onABIChange = () => {
    const { form } = this.props;
    clearTimeout(this.validateTimeoutID);
    this.validateTimeoutID = setTimeout(() => {
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
    }, 250);
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

  public updateInputVersion = (version: string) => {
    this.setState({ solidityReleaseVersion: version });
  };

  public renderVersionInput(): JSX.Element | null {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form.Item
        {...formItemLayout}
        label={<FormItemLabel>{t("wallet.input.solVersion")}</FormItemLabel>}
      >
        <Query query={GET_SOLC_VERSIONS}>
          {({ data, loading }: QueryResult) => {
            if (loading) {
              return (
                <div style={{ textAlign: "center" }}>
                  <Icon type="loading" spin={true} />
                </div>
              );
            }
            if (
              data &&
              data.getSolcVersions &&
              data.getSolcVersions.length > 0
            ) {
              return getFieldDecorator("solVersion")(
                <Select
                  showSearch={true}
                  placeholder={t("wallet.placeholder.compile")}
                  onChange={(value: string) => {
                    this.updateInputVersion(value);
                  }}
                >
                  {data.getSolcVersions.map((solcVersion: SolcVersion) => {
                    return (
                      <Option
                        value={solcVersion.version}
                        key={solcVersion.name}
                      >
                        {`${solcVersion.name}`}
                      </Option>
                    );
                  })}
                </Select>
              );
            }
            return null;
          }}
        </Query>
      </Form.Item>
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
        {this.renderVersionInput()}
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.solidity")}</FormItemLabel>}
        >
          {getFieldDecorator("solidity", {
            initialValue: ""
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
