import { Checkbox, Form, InputNumber, Modal } from "antd";
import { FormComponentProps } from "antd/es/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { CommonMargin } from "../common/common-margin";
import { colors } from "../common/styles/style-color";
import { setModalGate } from "./wallet-actions";
import { IWalletState, OriginInfo, SignParams } from "./wallet-reducer";
import {
  createWhitelistConfig,
  DataSource,
  deserializeEnvelop,
  getDataSource,
  moveGateState,
  whitelistService
} from "./whitelist";

type WhitelistConfigProps = DispatchProp &
  FormComponentProps & {
    fromAddress: string;
    envelop?: string;
    reqId?: number;
    form: WrappedFormUtils;
    modalGate: number;
    origin: OriginInfo;
  };

interface WhitelistConfigState {
  dataSource: DataSource | null;
}

const P = styled("p", {
  color: colors.black60
});

class WhitelistSetting extends React.Component<
  WhitelistConfigProps,
  WhitelistConfigState
> {
  public state: WhitelistConfigState = {
    dataSource: null
  };

  private readonly onOk = () => {
    const { form } = this.props;

    form.validateFields((_, values) => {
      const {
        duration,
        amount: amountChecked,
        toAddress: toAddressChecked
      } = values;
      const dataSource = this.state.dataSource as DataSource;
      const deadline = Date.now() + duration * 60 * 60 * 1000;
      const data = createWhitelistConfig(
        dataSource,
        this.props.origin,
        deadline
      );

      if (!toAddressChecked) {
        data.recipient = "";
      }

      if (!amountChecked) {
        data.amount = "";
      }

      whitelistService.save(data);
      this.onCancel();
    });
  };

  private readonly onCancel = () => {
    this.props.dispatch(
      setModalGate(moveGateState(this.props.modalGate, "01"))
    );
  };

  public componentDidMount(): void {
    this.updateDataSource();
  }

  public componentDidUpdate(): void {
    this.updateDataSource();
  }

  public async updateDataSource(): Promise<void> {
    if (!this.props.envelop || !this.props.fromAddress) {
      return;
    }

    const envelop = await deserializeEnvelop(
      this.props.envelop,
      this.props.fromAddress
    );
    const dataSource = getDataSource(envelop, this.props.fromAddress);
    const isInWhitelistsAndUnexpired = whitelistService.isInWhitelistsAndUnexpired(
      Date.now(),
      createWhitelistConfig(dataSource, this.props.origin)
    );

    if (isInWhitelistsAndUnexpired) {
      this.props.dispatch(
        setModalGate(moveGateState(this.props.modalGate, "01"))
      );
      this.setState({ dataSource: null });
    } else {
      this.setState({ dataSource });
    }
  }

  private forbidden(): void {
    this.props.dispatch(setModalGate(parseInt("101", 2)));
  }

  public render(): JSX.Element | null {
    if (!this.state.dataSource) {
      return null;
    }

    const { form, modalGate, origin: info } = this.props;
    const { origin, method } = info;
    const isVisible = modalGate === 2; // isVisible modalGate binary number: 010
    const { toAddress, amount, toContract } = this.state.dataSource;
    const { getFieldDecorator } = form;

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
          <a onClick={() => this.forbidden()} href="void:0" role="main">
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
    modalGate: state.wallet.modalGate,
    origin: state.wallet.origin
  })
  // @ts-ignore
)(WhitelistSetting);

// tslint:disable: no-any
export const Whitelist: any = Form.create()(ConnectedWhitelist);
