// tslint:disable:no-empty
import { Form, Input } from "antd";
import Button from "antd/lib/button";
import { FormComponentProps } from "antd/lib/form";
// @ts-ignore
import window from "global/window";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";

import { isValidBytes } from "../validator";

import { AccountMeta } from "../../../api-gateway/resolvers/antenna-types";
import { formItemLayout } from "../../common/form-item-layout";
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

export class Deploy extends Component {
  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.deploy.title")} icon={"upload"}>
        <DeployForm />
      </ContractLayout>
    );
  }
}

interface DeployProps extends FormComponentProps {
  wallet?: Account;
  address?: AccountMeta;
  updateWalletInfo?: any;
  gasPrice?: string;
  gasLimit?: number;
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
    rawTransaction: null
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

  public handleSignTransaction = () => {};

  public render(): JSX.Element {
    const { form, gasPrice, gasLimit } = this.props;
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
                validator: (rule, value, callback) => {
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
                }
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
        <Button
          href="#"
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
                validator: (rule, value, callback) => {
                  const isValidMessageKey = isValidBytes(value);

                  if (isValidMessageKey) {
                    callback(t(isValidMessageKey));
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
        {GasPriceFormInputItem(form, gasPrice || "0")}
        {GasLimitFormInputItem(form, gasLimit || 1000000)}
        {NonceFormInputItem(
          form,
          this.props.address ? this.props.address.pendingNonce : 1
        )}
        <Button
          href="#"
          type="primary"
          onClick={this.handleSignTransaction}
          style={{ marginBottom: "32px" }}
        >
          {t("wallet.deploy.signTransaction")}
        </Button>
      </Form>
    );
  }
}

export const DeployForm = Form.create({ name: "deploy-contract" })(
  DeployFormInner
);
