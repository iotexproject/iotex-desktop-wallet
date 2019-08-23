import React from "react";
import { Modal, Form, Checkbox, InputNumber } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { connect, DispatchProp } from "react-redux";
import { SignParams, IWalletState } from "./wallet-reducer";
import {
  deserializeEnvelop,
  getDataSource,
  DataSource
} from "./sign-and-send-envelop-modal";
import { Envelop } from "iotex-antenna/lib/action/envelop";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { styled } from "onefx/lib/styletron-react";
import { colors } from "../common/styles/style-color";
import { CommonMargin } from "../common/common-margin";
import { setModalGate } from "./wallet-actions";
import { FormComponentProps } from "antd/es/form";

type WhitelistConfigProps = DispatchProp &
  FormComponentProps & {
    fromAddress: string;
    envelop?: string;
    reqId?: number;
    form: WrappedFormUtils;
    modalGate: number;
  };

interface WhitelistConfigState {
  dataSource: DataSource | null;
}

const P = styled("p", {
  color: colors.black60
});

class WhitelistConfig extends React.Component<
  WhitelistConfigProps,
  WhitelistConfigState
> {
  public state: WhitelistConfigState = {
    dataSource: null
  };

  private readonly onOk = () => {
    const { form } = this.props;

    console.log("prepare to set whitelist");

    form.validateFields((error, values) => {
      const { amount, duration, toAddress } = values;
      const dataSource = this.state.dataSource as DataSource;
      const req = {
        origin: "member.io",
        method: "deposit",
        recipient: toAddress
          ? dataSource.toAddress || dataSource.toContract
          : "",
        amount: amount ? dataSource.amount : "",
        duration
      };
      console.log(req);
      // send to save;

      this.onCancel();
    });
  };

  private readonly onCancel = () => {
    this.props.dispatch(setModalGate(parseInt("101", 2)));
  };

  public componentDidMount() {
    this.updateDataSource();
  }

  public componentDidUpdate() {
    this.updateDataSource();
  }

  public async updateDataSource() {
    if (!this.props.envelop || !this.props.fromAddress) {
      return;
    }

    const envelop = await deserializeEnvelop(
      this.props.envelop as string,
      this.props.fromAddress
    );
    const isValid = await this.isValidOrigin(envelop);
    const { modalGate } = this.props;

    this.setState({
      dataSource: getDataSource(envelop, this.props.fromAddress)
    });
  }

  // valid: in whitelist and not expired;
  public async isValidOrigin(envelop: Envelop): Promise<boolean> {
    const random = Math.random() * 1000;
    //  whether origin is in whitelist and expired;
    let whitelist;
    if (random > 500) {
      whitelist = {
        origin: "member.io",
        expired: true
      };
    } else {
      whitelist = {
        origin: "member.io",
        expired: false
      };
    }
    return true;
  }

  private forbidden() {
    // 001
    this.props.dispatch(setModalGate(1 << 0));
  }

  render(): JSX.Element | null {
    console.log("in render ", this.props);
    if (!this.state.dataSource) {
      return null;
    }

    const { form, modalGate } = this.props;
    // isVisible modalGate: 010
    const isVisible = modalGate === 1 << 1;
    const { toAddress, amount, toContract } = this.state
      .dataSource as DataSource;
    const { getFieldDecorator } = form;
    const origin = "member.io";
    const method = "deposit";

    return (
      <Modal
        title={t("wallet.whitelist.title")}
        maskClosable={false}
        visible={isVisible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        cancelText={t("wallet.whitelist.cancel")}
        okText={t("wallet.whitelist.ok")}
        style={{ minWidth: "800px" }}
      >
        <div>
          <P>{t("wallet.whitelist.intro")}</P>
          <a onClick={() => this.forbidden()}>
            {t("wallet.whitelist.forbidden")}
          </a>
        </div>

        <CommonMargin />

        <Form>
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

          <Form.Item label={t("wallet.whitelist.receipt")}>
            {getFieldDecorator("toAddress", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox name="toAddress">{toAddress || toContract}</Checkbox>)}
          </Form.Item>

          <Form.Item label={t("wallet.whitelist.duration")}>
            {getFieldDecorator("duration", { initialValue: 1 })(
              <InputNumber min={1} max={10} name="duration" />
            )}
            <span>hour</span>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const ConnectedWhitelist = connect(
  (state: { signParams: SignParams; wallet: IWalletState }) => ({
    envelop: state.signParams.envelop,
    reqId: state.signParams.reqId,
    modalGate: state.wallet.modalGate
  })
  // @ts-ignore
)(WhitelistConfig);

export const Whitelist = Form.create<WhitelistConfigProps>()(
  ConnectedWhitelist
);
