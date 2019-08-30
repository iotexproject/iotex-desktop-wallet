import { Checkbox, Form, InputNumber } from "antd";
import { FormComponentProps } from "antd/es/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Board } from "../common/board";
import { CommonMargin } from "../common/common-margin";
import { colors } from "../common/styles/style-color";
import { whitelistService } from "./whitelist";

type Props = FormComponentProps & {
  form: WrappedFormUtils;
  origin: string;
  method: string;
  recipient: string;
  amount: string;
  handleWhitelist?(arg: WhitelistSetting): void;
};

interface State {}

const P = styled("p", {
  color: colors.black60
});

export class WhitelistSetting extends React.Component<Props, State> {
  public state: State = {};

  public readonly onOk = () => {
    const { form } = this.props;

    form.validateFields((_, values) => {
      const {
        duration,
        amount: amountChecked,
        toAddress: toAddressChecked
      } = values;
      const { origin, method, amount, recipient } = this.props;
      const data = {
        origin,
        method,
        amount,
        recipient,
        deadline: Date.now() + duration * 60 * 60 * 1000
      };

      if (!toAddressChecked) {
        data.recipient = "";
      }

      if (!amountChecked) {
        data.amount = "";
      }

      whitelistService.save(data);
    });
  };

  public componentDidMount = (): void => {
    if (this.props.handleWhitelist) {
      this.props.handleWhitelist(this);
    }
  };

  public render(): JSX.Element | null {
    const { form, origin, amount, recipient, method } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div style={{ paddingLeft: "6px" }}>
        <CommonMargin />
        <h3>{t("wallet.whitelist.title")}</h3>
        <P>{t("wallet.whitelist.intro")}</P>
        <CommonMargin />

        <Board>
          <Form style={{ margin: "12px" }}>
            <Form.Item
              label={t("wallet.whitelist.action", {
                origin,
                action: method
              })}
            >
              {getFieldDecorator("origin", {
                valuePropName: "checked",
                initialValue: true
              })(
                <Checkbox name="origin" disabled>
                  {origin} > {method}
                </Checkbox>
              )}
            </Form.Item>

            <Form.Item label={t("wallet.whitelist.amount")}>
              {getFieldDecorator("amount", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox name="amount">{amount}</Checkbox>)}
            </Form.Item>

            <Form.Item label={t("wallet.whitelist.recipient")}>
              {getFieldDecorator("toAddress", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox name="toAddress">{recipient}</Checkbox>)}
            </Form.Item>

            <Form.Item label={t("wallet.whitelist.duration")}>
              {getFieldDecorator("duration", { initialValue: 1 })(
                <InputNumber min={1} max={10} name="duration" />
              )}
              <span>hour</span>
            </Form.Item>
          </Form>
        </Board>
      </div>
    );
  }
}

export const Whitelist = Form.create()(WhitelistSetting);
