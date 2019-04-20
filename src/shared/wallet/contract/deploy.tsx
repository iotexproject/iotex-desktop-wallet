// tslint:disable:no-empty
// tslint:disable:no-any
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
import Form from "antd/lib/form/Form";
import Input from "antd/lib/input";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";

import { isValidBytes } from "../validator";

import { toRau } from "iotex-antenna/lib/account/utils";
import { AccountMeta } from "../../../api-gateway/resolvers/antenna-types";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { BroadcastFailure, BroadcastSuccess } from "../broadcast-status";
import { getAntenna } from "../get-antenna";
import { actionBtnStyle } from "../transfer/transfer";
import {
  AbiFormInputItem,
  AmountFormInputItem,
  FormItemLabel,
  GasLimitFormInputItem,
  GasPriceFormInputItem,
  inputStyle
} from "./cards";
import { ContractLayout } from "./contract-layout";

const { TextArea } = Input;

export function DeployPreloadHeader(): JSX.Element {
  return (
    <Helmet
      script={[
        {
          src: "https://ethereum.github.io/solc-bin/bin/list.js",
          type: "text/javascript"
        },
        {
          src: assetURL("/browser-solc.min.js"),
          type: "text/javascript"
        }
      ]}
    />
  );
}

export class Deploy extends Component<{ wallet: Account }> {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.deploy.title")} icon={"upload"}>
        <DeployForm wallet={this.props.wallet} />
      </ContractLayout>
    );
  }
}

interface DeployProps extends FormComponentProps {
  wallet?: Account;
  address?: AccountMeta;
  updateWalletInfo?: any;
}

interface State {
  solidityReleaseVersion: string | undefined;
  currentNonce: string | number;
  nonceMessage: string | number;
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
}

class DeployFormInner extends Component<DeployProps, State> {
  public state: State = {
    solidityReleaseVersion: undefined,
    currentNonce: this.props.address ? this.props.address.nonce : 1,
    nonceMessage: t("wallet.input.nonce.suggestion", {
      nonce: this.props.address ? this.props.address.nonce : 0
    }),
    message: "",
    sending: false,
    generatingByte: false,
    deploying: false,
    hasErrors: false,
    rawTransaction: null,
    showConfirmation: false,
    broadcast: null,
    txHash: ""
  };

  public handleGenerateAbiAndByteCode = () => {
    const {
      form: { getFieldValue, setFields, setFieldsValue }
    } = this.props;

    const { solidityReleaseVersion } = this.state;

    window.BrowserSolc.loadVersion(solidityReleaseVersion, (sloc: any) => {
      const output = sloc.compile(getFieldValue("solidity"));
      if (
        output.errors &&
        output.errors.length > 0 &&
        output.errors.some((err: any) => err.indexOf("Warning:") === -1)
      ) {
        setFields({
          solidity: { errors: JSON.stringify(output.errors, null, 2) }
        });
        return;
      }

      for (const contractName of Object.keys(output.contracts)) {
        // code and ABI that are needed by web3
        setFieldsValue({
          byteCode: output.contracts[contractName].bytecode,
          abi: output.contracts[contractName].interface
        });

        // TODO(tian) we process just one contract
        break;
      }
    });
  };

  private readonly solidityValidator = (
    _: any,
    value: any,
    callback: Function
  ): void => {
    if (!value) {
      return callback();
    }
    const verFound = /pragma solidity \^(.*);/.exec(value);
    if (!verFound || !verFound[1]) {
      return callback(t("wallet.missing_solidity_pragma"));
    }

    const rel = (window.soljsonReleases || {})[verFound[1]];
    if (!rel) {
      return callback(t("wallet.cannot_find_solidity_version"));
    } else {
      this.setState({ solidityReleaseVersion: rel });
    }

    callback();
  };

  public renderConfirmation = () => {
    const { form, wallet } = this.props;
    const { showConfirmation } = this.state;

    const { byteCode, amount, gasLimit, gasPrice } = form.getFieldsValue();
    const dataSource = {
      address: wallet && wallet.address,
      data: byteCode,
      amount: toRau(amount, "Iotx"),
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
    const { form, wallet } = this.props;
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

      const { byteCode, amount, gasLimit, gasPrice } = value;

      window.console.log(
        `antenna.iotx.deployContract(${JSON.stringify({
          from: String(wallet && wallet.address),
          amount: toRau(amount, "Iotx"),
          data: Buffer.from(byteCode, "hex"),
          gasPrice: gasPrice || undefined,
          gasLimit: gasLimit || undefined
        })})`
      );

      const txHash = await antenna.iotx.deployContract({
        from: String(wallet && wallet.address),
        amount: toRau(amount, "Iotx"),
        data: Buffer.from(byteCode, "hex"),
        gasPrice: gasPrice || undefined,
        gasLimit: gasLimit || undefined
      });

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

  public deployNewContract: JSX.Element = (
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

  private renderBroadcast(): JSX.Element | null {
    const { txHash, broadcast } = this.state;
    if (!broadcast) {
      return null;
    }
    if (broadcast.success) {
      return (
        <BroadcastSuccess
          type="transfer"
          txHash={txHash}
          action={this.deployNewContract}
        />
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
        {/*
          // @ts-ignore */}
        <Button
          type="primary"
          style={{ fontSize: "0.8em", padding: "0 5px", marginBottom: "32px" }}
          onClick={this.handleGenerateAbiAndByteCode}
        >
          {t("wallet.deploy.generateAbiAndByteCode")}
        </Button>
        {AbiFormInputItem(form)}
        <Form.Item
          {...formItemLayout}
          label={<FormItemLabel>{t("wallet.input.byteCode")}</FormItemLabel>}
        >
          {getFieldDecorator("byteCode", {
            initialValue: "",
            rules: [
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

export const DeployForm = Form.create({ name: "deploy-contract" })(
  DeployFormInner
);
