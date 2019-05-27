import { Statistic } from "antd";
import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import BigNumber from "bignumber.js";
// @ts-ignore
import window from "global/window";
import { toRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import * as React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { ERC20 } from "../../../erc20";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { PageTitle } from "../../common/page-title";
import { rulesMap } from "../../common/rules";
import { BroadcastFailure, BroadcastSuccess } from "../broadcast-status";
import {
  AmountFormInputItem,
  GasLimitFormInputItem,
  GasPriceFormInputItem
} from "../contract/cards";
import { getAntenna } from "../get-antenna";
import { FormItemLabel, inputStyle } from "../wallet";

type Props = {
  form: WrappedFormUtils;
  address: string;
  chainId?: number;
  updateWalletInfo?: Function;
} & RouteComponentProps;

type ERC20Info = {
  name: string;
  balance: BigNumber;
  symbol: string;
};

type State = {
  sending: boolean;
  txHash: string;
  broadcast: {
    success: boolean;
  } | null;
  showConfirmTransfer: boolean;
  erc20Address: string;
  erc20Info: ERC20Info | null;
};

class ERC20TransferForm extends React.PureComponent<Props, State> {
  public state: State = {
    sending: false,
    txHash: "",
    broadcast: null,
    showConfirmTransfer: false,
    erc20Address: "",
    erc20Info: null
  };

  public sendTransfer = async (status: boolean) => {
    if (!status) {
      return this.setState({
        showConfirmTransfer: false
      });
    }
    // TODO: Implement for ERC20
    // const antenna = getAntenna();
    // const { form, address } = this.props;
    // form.validateFields(async (err, value) => {
    //   if (!err) {
    //     const { recipient, amount, gasLimit, gasPrice, dataInHex } = value;
    //     this.setState({ sending: true, showConfirmTransfer: false });
    //     window.console.log(
    //       `antenna.iotx.sendTransfer(${JSON.stringify({
    //         from: address,
    //         to: recipient,
    //         value: toRau(amount, "Iotx"),
    //         payload: dataInHex,
    //         gasLimit: gasLimit || undefined,
    //         gasPrice: gasPrice || undefined
    //       })})`
    //     );
    //     const txHash = await antenna.iotx.sendTransfer({
    //       from: address,
    //       to: recipient,
    //       value: toRau(amount, "Iotx"),
    //       payload: dataInHex,
    //       gasLimit: gasLimit || undefined,
    //       gasPrice: gasPrice || undefined
    //     });
    //     this.setState({
    //       sending: false,
    //       broadcast: {
    //         success: Boolean(txHash)
    //       },
    //       txHash
    //     });
    //   }
    // });
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

  public transferForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { sending } = this.state;
    return (
      <>
        {" "}
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.to")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("recipient", {
            rules: rulesMap.address
          })(<Input placeholder="io..." style={inputStyle} name="recipient" />)}
        </Form.Item>
        <AmountFormInputItem form={form} />
        <GasPriceFormInputItem form={form} />
        <GasLimitFormInputItem form={form} />
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
      </>
    );
  };

  public getERC20TokenInfo = async () => {
    const { form, address } = this.props;
    const erc20Address = form.getFieldValue("erc20Address");
    const erc20 = ERC20.create(address, getAntenna().iotx);
    const balance = await erc20.balanceOf(erc20Address, erc20Address);
    const name = await erc20.name(erc20Address);
    const symbol = await erc20.symbol(erc20Address);
    this.setState({
      erc20Address,
      erc20Info: {
        name,
        balance,
        symbol
      }
    });
  };

  public renderERC20Info = () => {
    const { erc20Info } = this.state;
    if (!erc20Info) {
      return null;
    }
    return (
      <Statistic
        title={t("wallet.input.balance")}
        value={erc20Info.balance.toString(10)}
        style={{ marginBottom: 20 }}
      />
    );
  };

  public erc20AddressForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { sending } = this.state;
    return (
      <>
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.fromErc20")}</FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("erc20Address", {
            rules: rulesMap.erc20Address
          })(
            <Input placeholder="0x..." style={inputStyle} name="erc20Address" />
          )}
        </Form.Item>
        {this.renderERC20Info()}
        {
          // @ts-ignore
          <Button
            type="primary"
            loading={sending}
            onClick={this.getERC20TokenInfo}
            style={{ marginBottom: 30 }}
          >
            {t("wallet.input.getInfo")}
          </Button>
        }
      </>
    );
  };

  public input = () => {
    return (
      <Form layout="vertical">
        {this.erc20AddressForm()}
        {this.transferForm()}
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
    const { address, form } = this.props;
    const { showConfirmTransfer } = this.state;

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
      <div style={{ paddingRight: 2 }}>
        <Helmet
          title={`${t("wallet.erc20.title")} - ${t("meta.description")}`}
        />
        <PageTitle>
          <Icon type="wallet" /> {t("wallet.erc20.title")}
        </PageTitle>
        {this.input()}
        {this.confirmTransfer()}
      </div>
    );
  }
}

export default withRouter(Form.create<ERC20TransferForm>()(ERC20TransferForm));
