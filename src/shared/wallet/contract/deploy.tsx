import React from "react";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Form, Input } from "antd";

import { WALLET } from "../../common/site-url";
import { AccountMeta } from "../../../api-gateway/resolvers/antenna-types";
// import type {TExecution} from '../../../entities/explorer-types';
// import type {TRawExecutionRequest} from '../../../entities/wallet-types';
import { acceptableNonce, isValidBytes, onlyNumber } from "../validator";

const window = require("global/window");
const VERSION = 0x1;

type FieldNames =
  | "solidity"
  | "abi"
  | "byteCode"
  | "gasPrice"
  | "gasLimit"
  | "nonce";

interface Props {
  wallet: Account;
  address: AccountMeta;
  updateWalletInfo: any;
  gasPrice: string;
  gasLimit: number;
}

interface State {
  // solidity: string;
  // abi: string;
  // byteCode: string;
  // gasPrice: string;
  // gasLimit: number;
  // nonce: string | number;

  fieldValues: { [x in FieldNames]: string | number };

  fieldErrors: { [x in FieldNames]: string };

  fieldValidateStatus: { [x in FieldNames]: string };

  currentNonce: string | number;
  nonceMessage: string | number;
  message: string;
  sending: boolean;
  generatingByte: boolean;
  deploying: boolean;
  hasErrors: boolean;
  rawTransaction: any;
}

class Deploy extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fieldValues: {
        solidity: "",
        abi: "",
        byteCode: "",
        gasPrice: this.props.gasPrice || "0",
        gasLimit: this.props.gasLimit || 1000000,
        nonce: this.props.address ? this.props.address.pendingNonce : 1
      },

      fieldErrors: {
        solidity: "",
        abi: "",
        byteCode: "",
        gasPrice: "",
        gasLimit: "",
        nonce: ""
      },

      fieldValidateStatus: {
        solidity: "",
        abi: "",
        byteCode: "",
        gasPrice: "",
        gasLimit: "",
        nonce: ""
      },

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
  }

  setFieldValue = (name: FieldNames, value: string) => {
    this.setState(prevState => ({
      fieldValues: {
        ...prevState.fieldValues,
        [name]: value
      }
    }));
  };

  handleInputChange = (name: FieldNames, value: string) => {
    this.checkFormErrors(name, value);
  };

  checkFormErrors = (name: FieldNames, value?: string) => {
    const { currentNonce } = this.state;

    switch (name) {
      case "byteCode": {
        this.updateFormState(name, value, value && isValidBytes(value));
        break;
      }
      case "gasLimit": {
        this.updateFormState(name, value, value && onlyNumber(value));
        break;
      }
      case "gasPrice": {
        this.updateFormState(name, value);
        break;
      }
      case "solidity": {
        this.updateFormState(name, value);
        break;
      }
      case "nonce": {
        if (value) {
          if (onlyNumber(value)) {
            this.updateFormState(name, value, onlyNumber(value));
          } else {
            this.updateFormState(
              name,
              value,
              acceptableNonce(value, currentNonce as string)
            );
          }
        } else {
          this.updateFormState(name, value, "");
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  updateFormState = (name: FieldNames, value?: string, error?: string) => {
    if (value !== undefined) {
      this.setState({
        [name]: value,
        [`errors_${name}`]: error ? error : "",
        rawTransaction: null
      });
    } else {
      this.setState({
        [`errors_${name}`]: t("wallet.input.required"),
        rawTransaction: null
      });
    }
    this.hasErrors();
  };

  resetErrors = () => {
    this.setState({
      errors_byteCode: "",
      errors_nonce: "",
      errors_gasLimit: "",
      errors_solidity: "",
      errors_abi: "",
      message: ""
    });
  };

  deploy = () => {
    const { wallet } = this.props;
    const { byteCode, nonce, gasLimit, gasPrice } = this.state;

    const rawSmartContractRequest: TRawExecutionRequest = {
      data: byteCode.replace(/^(0x)/, ""),
      nonce,
      gasLimit,
      gasPrice,
      // TODO(tian): those fields are strange
      version: VERSION,
      contract: "",
      amount: "0",
      ID: "ID"
    };

    this.setState({ deploying: true });
    fetchPost(WALLET.GENERATE_EXECUTION, {
      rawSmartContractRequest,
      wallet
    }).then(res => {
      this.resetErrors();
      if (!res.ok) {
        if (res.errors && res.errors.length > 0) {
          res.errors.forEach(key => {
            this.checkFormErrors(key);
          });
          this.setState({
            message: t("wallet.input.fix"),
            deploying: false,
            rawTransaction: null
          });
        } else {
          this.setState({
            message: t(res.error ? res.error.message : "error.unknown"),
            deploying: false,
            rawTransaction: null
          });
        }
      } else {
        this.setState({ rawTransaction: res.rawTransaction, deploying: false });
      }
    });
  };

  broadcast = (result: any) => {
    this.props.updateWalletInfo();
    this.setState({ broadcast: result });
  };

  generateClick = () => {
    this.setState({ generatingByte: true });
    this.generateAbiAndByteCode();
  };

  generateAbiAndByteCode = () => {
    const verFound = /pragma solidity \^(.*);/.exec(this.state.solidity);
    if (!verFound || !verFound[1]) {
      return this.setState({
        errors_solidity: t("wallet.missing_solidity_pragma"),
        generatingByte: false
      });
    }

    const rel = (window.soljsonReleases || {})[verFound[1]];
    if (!rel) {
      return this.setState({
        errors_solidity: t("wallet.cannot_find_solidity_version"),
        generatingByte: false
      });
    }

    // eslint-disable-next-line no-unused-expressions
    window.BrowserSolc &&
      window.BrowserSolc.loadVersion(rel, (sloc: any) => {
        const output = sloc.compile(this.state.solidity);
        if (
          output.errors &&
          output.errors.length > 0 &&
          output.errors.some(err => err.indexOf("Warning:") === -1)
        ) {
          return this.setState({
            errors_solidity: JSON.stringify(output.errors, null, 2),
            generatingByte: false
          });
        }

        for (const contractName in output.contracts) {
          if (!output.contracts.hasOwnProperty(contractName)) {
            continue;
          }
          // code and ABI that are needed by web3
          this.setState({
            byteCode: output.contracts[contractName].bytecode,
            abi: output.contracts[contractName].interface,
            generatingByte: false
          });

          // TODO(tian) we process just one contract
          break;
        }
      });
  };

  sendContractClick = () => {
    this.setState({
      broadcast: null,
      rawTransaction: null,
      nonce: this.props.address
        ? (this.props.address.nonce as number) + 1
        : this.state.nonce
    });
  };

  hasErrors = () => {
    const {
      errors_recipient,
      errors_solidity,
      errors_byteCode,
      errors_nonce,
      errors_gasLimit
    } = this.state;
    this.setState({
      hasErrors:
        errors_recipient ||
        errors_nonce ||
        errors_solidity ||
        errors_byteCode ||
        errors_gasLimit
    });
  };

  componentDidMount() {
    this.setState({
      nonce: this.props.address
        ? (this.props.address.nonce as number) + 1
        : this.state.nonce
    });
  }

  componentWillReceiveProps(nextProps: { address: AccountMeta }) {
    if (this.state.nonce <= nextProps.address.nonce) {
      this.setState({
        nonceMessage: t("wallet.input.nonce.suggestion", {
          nonce: nextProps.address.nonce
        }),
        currentNonce: nextProps.address.nonce
      });
    }
  }

  render() {
    const { message, generatingByte } = this.state;

    return (
      <div>
        <p className="wallet-title">{t("wallet.deploy.title")}</p>
        {message && <div className="notification is-danger">{message}</div>}
        <Form layout="horizontal">
          <Form.Item
            label={t("wallet.input.solidity")}
            validateStatus={t(this.state.fieldValidateStatus.solidity)}
            help={this.state.fieldErrors.solidity}
          >
            <Input.TextArea
              name="solidity"
              value={this.state.solidity}
              placeholder={"pragma solidity ^0.4.23;\n..."}
              onChange={event =>
                this.handleInputChange("solidity", event.target.value)
              }
            />
          </Form.Item>
          <div style={{ margin: "8px" }} />
          {greenButton(
            t("wallet.deploy.generateAbiAndByteCode"),
            false,
            this.generateClick,
            generatingByte
          )}
          <div style={{ margin: "4px" }} />
          <Input.TextArea
            label={t("wallet.input.abi")}
            name="solidity"
            value={this.state.abi}
            error={t(this.state.errors_abi)}
            textArea={true}
            readOnly={true}
            placeholder={"..."}
          />

          <Input.TextArea
            label={t("wallet.input.byteCode")}
            name="byteCode"
            value={this.state.byteCode}
            error={t(this.state.errors_byteCode)}
            placeholder="0x1234..."
            textArea={true}
            update={(name, value) => this.handleInputChange(name, value)}
          />

          <TextInputField
            label={t("wallet.input.gasPrice")}
            name="gasPrice"
            value={this.state.gasPrice}
            error={t(this.state.errors_gasPrice)}
            placeholder="0"
            readOnly={INPUT_READONLY}
            update={(name, value) => this.handleInputChange(name, value)}
          />

          <TextInputField
            label={t("wallet.input.gasLimit")}
            name="gasLimit"
            value={this.state.gasLimit}
            error={t(this.state.errors_gasLimit)}
            placeholder="100000"
            readOnly={INPUT_READONLY}
            update={(name, value) => this.handleInputChange(name, value)}
          />

          <TextInputField
            label={t("wallet.input.nonce")}
            name="nonce"
            value={this.state.nonce}
            error={t(this.state.errors_nonce)}
            placeholder="1"
            extra={this.state.nonceMessage}
            update={(name, value) => this.handleInputChange(name, value)}
          />
          <br />
        </Form>
        <br />
      </div>
    );
  }
}

export default Deploy;
