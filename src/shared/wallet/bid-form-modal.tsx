import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import notification from "antd/lib/notification";

import BigNumber from "bignumber.js";
import { Account } from "iotex-antenna/lib/account/account";
import { fromRau, toRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Token } from "../../erc20/token";
import { colors } from "../common/styles/style-color";

export interface IBidFormProps {
  onCancel(): void;
  onOK(amount: string): void;
  visible?: boolean;
  form: WrappedFormUtils;
  account: Account;
  bidContractAddress: string;
}

class BidForm extends React.PureComponent<IBidFormProps> {
  public state: {
    confirming: boolean;
    authMessage: string;
    maxBidAmount: string;
    initialValue: string;
  } = {
    confirming: false,
    authMessage: "",
    maxBidAmount: "",
    initialValue: "1"
  };

  public async pollMaxBidAmount(): Promise<string> {
    const { bidContractAddress, account } = this.props;
    const maxBidAmount = await Token.getBiddingToken(
      bidContractAddress
    ).estimateMaxBidAmount(account);
    if (this.state.maxBidAmount !== maxBidAmount) {
      this.setState({ maxBidAmount });
    }
    return maxBidAmount;
  }

  public componentDidMount(): void {
    this.pollMaxBidAmount();
  }

  public handleOk = async () => {
    const { form, onOK } = this.props;
    this.setState({ confirming: true });
    form.validateFields(["amount"], async (err, { amount }) => {
      if (err) {
        this.setState({ confirming: false });
        return;
      }
      try {
        await onOK(amount);
      } catch (error) {
        notification.error({
          message: t("Error!"),
          description: `${error.message}`,
          duration: 3
        });
      }
      this.setState({ confirming: false });
    });
  };
  public render(): JSX.Element {
    const { form, onCancel, visible = false } = this.props;
    const { getFieldDecorator } = form;
    const { initialValue } = this.state;
    return (
      <Modal
        title={t("account.placeBid")}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        okText={t("account.bid")}
        confirmLoading={this.state.confirming}
        bodyStyle={{
          paddingTop: "0px !important"
        }}
      >
        <Form.Item
          label={t("wallet.input.amount")}
          wrapperCol={{
            xs: 24
          }}
        >
          {getFieldDecorator("amount", {
            initialValue,
            rules: [
              {
                required: true,
                transform: (value: string) => {
                  return new BigNumber(toRau(value, "IoTx"));
                },
                validator: async (_, value: BigNumber, callback) => {
                  const maxBidAmount = await this.pollMaxBidAmount();
                  if (value.isGreaterThan(new BigNumber(maxBidAmount))) {
                    return callback(t("account.error.notEnoughBalance"));
                  }
                  callback();
                }
              }
            ]
          })(
            <div>
              <Input
                placeholder={initialValue}
                style={{ width: "100%", background: colors.black10 }}
                name="amount"
                addonAfter="IOTX"
              />
              {this.state.maxBidAmount && (
                <small>
                  {t("account.availableForBid")}{" "}
                  <strong
                    style={{ cursor: "pointer" }}
                    role="main"
                    onClick={() => {
                      this.setState({
                        initialValue: fromRau(this.state.maxBidAmount, "IoTx")
                      });
                    }}
                  >{`${fromRau(this.state.maxBidAmount, "IoTx") ||
                    "0"} IOTX`}</strong>
                </small>
              )}
            </div>
          )}
        </Form.Item>
      </Modal>
    );
  }
}

const BidFormModal = Form.create<BidForm>()(BidForm);
export default BidFormModal;
