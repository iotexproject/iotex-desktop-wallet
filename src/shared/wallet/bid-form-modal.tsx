import { Form, Input, Modal, notification } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import BigNumber from "bignumber.js";
import { Account } from "iotex-antenna/lib/account/account";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { colors } from "../common/styles/style-color";
import { getAntenna } from "./get-antenna";

export interface IBidFormProps {
  onCancel(): void;
  onOK(amount: string): void;
  visible?: boolean;
  form: WrappedFormUtils;
  account: Account;
}

class BidForm extends React.PureComponent<IBidFormProps> {
  public state: { confirming: boolean; authMessage: string } = {
    confirming: false,
    authMessage: ""
  };
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
    const { form, onCancel, visible = false, account } = this.props;
    const { getFieldDecorator } = form;
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
            initialValue: 1,
            rules: [
              {
                required: true,
                transform: (value: string) => {
                  return new BigNumber(value);
                },
                validator: async (_, value: BigNumber, callback) => {
                  const addressRes = await getAntenna().iotx.getAccount({
                    address: account.address
                  });
                  if (!addressRes || !addressRes.accountMeta) {
                    return callback(t("unlock-wallet.no-wallet"));
                  }
                  if (
                    !(value instanceof BigNumber) ||
                    !value.isGreaterThan(0)
                  ) {
                    return callback(t("wallet.error.number"));
                  }
                  const iotxBalance = new BigNumber(
                    fromRau(addressRes.accountMeta.balance, "")
                  );
                  if (iotxBalance.isLessThan(value.toNumber())) {
                    return callback(t("account.error.notEnoughBalance"));
                  }
                  callback();
                }
              }
            ]
          })(
            <Input
              placeholder={"1"}
              style={{ width: "100%", background: colors.black10 }}
              name="amount"
              addonAfter="IOTX"
            />
          )}
        </Form.Item>
      </Modal>
    );
  }
}

const BidFormModal = Form.create<BidForm>()(BidForm);
export default BidFormModal;
