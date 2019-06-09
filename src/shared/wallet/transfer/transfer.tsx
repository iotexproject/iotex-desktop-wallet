import { Icon, notification, Select } from "antd";
import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Input from "antd/lib/input";
import BigNumber from "bignumber.js";
import { Account } from "iotex-antenna/lib/account/account";
import { toRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { ERC20Token, IERC20TokenInfoDict } from "../../../erc20/erc20Token";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { rulesMap } from "../../common/rules";
import { BroadcastFailure, BroadcastSuccess } from "../broadcast-status";
import {
  GasLimitFormInputItem,
  GasPriceFormInputItem
} from "../contract/cards";
import { getAntenna } from "../get-antenna";
import { FormItemLabel, inputStyle } from "../wallet";
import { IWalletState } from "../wallet-reducer";

type Props = {
  form: WrappedFormUtils;
  account?: Account;
  chainId?: number;
  updateWalletInfo?: Function;
  erc20Tokens?: IERC20TokenInfoDict;
} & RouteComponentProps;

type State = {
  sending: boolean;
  txHash: string;
  broadcast: {
    success: boolean;
  } | null;
  showConfirmTransfer: boolean;
};

class TransferForm extends React.PureComponent<Props, State> {
  public state: State = {
    sending: false,
    txHash: "",
    broadcast: null,
    showConfirmTransfer: false
  };

  public sendTransfer = async (status: boolean) => {
    const antenna = getAntenna();
    const { form, account, erc20Tokens = {} } = this.props;
    if (!status || !account) {
      return this.setState({
        showConfirmTransfer: false
      });
    }

    const { address } = account;

    form.validateFields(async (err, value) => {
      if (err) {
        return this.setState({
          showConfirmTransfer: false
        });
      }
      const {
        recipient,
        amount,
        gasLimit,
        gasPrice,
        dataInHex,
        symbol
      } = value;

      const erc20 = symbol.match(/iotx/) ? null : ERC20Token.getToken(symbol);

      this.setState({ sending: true, showConfirmTransfer: false });
      let txHash = "";
      if (!erc20) {
        window.console.log(
          `antenna.iotx.sendTransfer(${JSON.stringify({
            from: address,
            to: recipient,
            value: toRau(amount, "Iotx"),
            payload: dataInHex,
            gasLimit: gasLimit || undefined,
            gasPrice: gasPrice || undefined
          })})`
        );
        try {
          txHash = await antenna.iotx.sendTransfer({
            from: address,
            to: recipient,
            value: toRau(amount, "Iotx"),
            payload: dataInHex,
            gasLimit: gasLimit || undefined,
            gasPrice: gasPrice || undefined
          });
        } catch (error) {
          notification.error({
            message: `${error.message}`,
            duration: 3
          });
        }
      } else {
        const erc20Info = erc20Tokens[symbol];
        const erc20Amount = new BigNumber(amount).multipliedBy(
          10 ** erc20Info.decimals.toNumber()
        );
        const gasPriceRau = toRau(gasPrice, "Qev");
        window.console.log(
          `erc20.transfer(
                ${recipient},
                ${erc20Amount},
                <wallet>,
                ${gasPriceRau},
                ${gasLimit}
              )`
        );
        try {
          txHash = await erc20.transfer(
            recipient,
            erc20Amount,
            account,
            gasPriceRau,
            gasLimit
          );
        } catch (error) {
          notification.error({
            message: `${error.message}`,
            duration: 3
          });
        }
      }
      this.setState({
        sending: false,
        broadcast: {
          success: Boolean(txHash)
        },
        txHash
      });
    });
  };

  public showConfirmTransfer = () => {
    this.props.form.validateFields(err => {
      if (err) {
        return;
      }
      this.setState({
        showConfirmTransfer: true
      });
    });
  };

  public renderSelectTokenSymbol(): JSX.Element | null {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { Option } = Select;
    const { erc20Tokens = {} } = this.props;
    const tokenTypes = [
      {
        label: "IOTX",
        key: "iotx"
      }
    ];
    Object.keys(erc20Tokens).forEach(addr => {
      const info = erc20Tokens[addr];
      if (info) {
        tokenTypes.push({
          label: info.symbol,
          key: addr
        });
      }
    });
    return (
      <>
        {getFieldDecorator("symbol", {
          initialValue: tokenTypes[0].key
        })(
          <Select style={{ width: 100 }}>
            {tokenTypes.map(type => (
              <Option value={type.key}>{type.label}</Option>
            ))}
          </Select>
        )}
      </>
    );
  }

  public renderAmountFormItem(): JSX.Element {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form.Item
        label={<FormItemLabel>{t("wallet.input.amount")} </FormItemLabel>}
        {...formItemLayout}
      >
        {getFieldDecorator("amount", {
          initialValue: 1,
          rules: rulesMap.amount
        })(
          <Input
            className="form-input"
            placeholder="1"
            addonAfter={this.renderSelectTokenSymbol()}
            name="amount"
          />
        )}
      </Form.Item>
    );
  }

  public renderTransferForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { sending } = this.state;

    return (
      <Form layout="vertical">
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.to")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("recipient", {
            rules: rulesMap.address
          })(
            <Input
              placeholder="io..."
              style={inputStyle}
              name="recipient"
              addonAfter={<Icon type="wallet" />}
            />
          )}
        </Form.Item>
        {this.renderAmountFormItem()}
        <GasPriceFormInputItem form={form} />
        <GasLimitFormInputItem form={form} />
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.dib")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("dataInHex", {
            rules: rulesMap.dataIndex
          })(
            <Input style={inputStyle} placeholder="0x1234" name="dataInHex" />
          )}
        </Form.Item>
        {
          // @ts-ignore
          <Button
            type="primary"
            loading={sending}
            onClick={this.showConfirmTransfer}
          >
            {t("wallet.transactions.send")}
          </Button>
        }
      </Form>
    );
  };

  public sendNewIOTX: JSX.Element = (
    <Button
      onClick={() => {
        this.setState({
          broadcast: null
        });
      }}
    >
      {`${t("wallet.transfer.sendNew")} ${t("account.testnet.token")}`}
    </Button>
  );

  public displayRawTransfer = () => {
    return (
      <Row gutter={4}>
        <Col span={12}>
          <label>{t("wallet.transactionDetail.raw")}</label>
          <pre />
        </Col>
        <Col span={12}>
          <label>{t("wallet.transactionDetail.raw")}</label>
          <pre />
        </Col>
      </Row>
    );
  };

  public confirmTransfer = () => {
    const { account, form, erc20Tokens = {} } = this.props;
    if (!account) {
      return null;
    }
    const { address } = account;
    const { showConfirmTransfer } = this.state;

    const {
      recipient,
      amount,
      gasLimit,
      gasPrice,
      symbol
    } = form.getFieldsValue();
    const tokenSymbol = symbol === "iotx" ? "IOTX" : erc20Tokens[symbol].symbol;
    const dataSource = {
      address: address,
      toAddress: recipient,
      amount: `${new BigNumber(amount).toString()} ${tokenSymbol}`,
      limit: gasLimit,
      price: toRau(gasPrice, "Qev")
    };

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        confirmContractOk={this.sendTransfer}
        showModal={showConfirmTransfer}
      />
    );
  };

  public render(): JSX.Element {
    const { txHash, broadcast } = this.state;

    if (broadcast) {
      if (broadcast.success) {
        return <BroadcastSuccess txHash={txHash} action={this.sendNewIOTX} />;
      }
      return (
        <BroadcastFailure
          suggestedMessage={t("wallet.transfer.broadcast.fail", {
            token: t("account.testnet.token")
          })}
          errorMessage={""}
          action={this.sendNewIOTX}
        />
      );
    }

    return (
      <div style={{ paddingRight: 2, paddingTop: 20 }}>
        <Helmet
          title={`${t("wallet.transfer.title")} - ${t("meta.description")}`}
        />
        {this.renderTransferForm()}
        {this.confirmTransfer()}
      </div>
    );
  }
}

const mapStateToProps = (state: {
  wallet: IWalletState;
}): { account?: Account; erc20Tokens?: IERC20TokenInfoDict } => ({
  account: (state.wallet || {}).account,
  erc20Tokens: (state.wallet || {}).erc20Tokens || {}
});

const TransferFormComp = Form.create<TransferForm>()(TransferForm);

export default connect(mapStateToProps)(withRouter(TransferFormComp));
