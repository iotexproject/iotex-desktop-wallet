import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import { toRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import * as React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import ConfirmContractModal from "../../common/confirm-contract-modal";
import { formItemLayout } from "../../common/form-item-layout";
import { PageTitle } from "../../common/page-title";
import { rulesMap } from "../../common/rules";
import { colors } from "../../common/styles/style-color";
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

type State = {
  sending: boolean;
  txHash: string;
  broadcast: {
    success: boolean;
  } | null;
  showConfirmTransfer: boolean;
};

export const actionBtnStyle = {
  height: "40px",
  border: "none",
  background: colors.black10,
  color: colors.secondary,
  fontWeight: 500,
  lineHeight: "40px"
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
    const { form, address } = this.props;
    if (!status) {
      return this.setState({
        showConfirmTransfer: false
      });
    }

    form.validateFields(async (err, value) => {
      if (!err) {
        const { recipient, amount, gasLimit, gasPrice, dataInHex } = value;

        this.setState({ sending: true, showConfirmTransfer: false });

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

        const txHash = await antenna.iotx.sendTransfer({
          from: address,
          to: recipient,
          value: toRau(amount, "Iotx"),
          payload: dataInHex,
          gasLimit: gasLimit || undefined,
          gasPrice: gasPrice || undefined
        });

        this.setState({
          sending: false,
          broadcast: {
            success: Boolean(txHash)
          },
          txHash
        });
      }
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

  public input = () => {
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
          })(<Input placeholder="io..." style={inputStyle} name="recipient" />)}
        </Form.Item>
        <AmountFormInputItem form={form} />
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
        return (
          <BroadcastSuccess
            type="transfer"
            txHash={txHash}
            action={this.sendNewIOTX}
          />
        );
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
          title={`${t("wallet.transfer.title")} - ${t("meta.description")}`}
        />
        <PageTitle>
          <Icon type="pushpin" /> {t("wallet.transfer.title")}
        </PageTitle>
        {this.input()}
        {this.confirmTransfer()}
      </div>
    );
  }
}

export default withRouter(Form.create<TransferForm>()(TransferForm));
