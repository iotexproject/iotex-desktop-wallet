import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import notification from "antd/lib/notification";

import { WrappedFormUtils } from "antd/lib/form/Form";
import Antenna from "iotex-antenna";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { formItemLayout } from "../common/form-item-layout";
import { rulesMap } from "../common/rules";
import { colors } from "../common/styles/style-color";
import { FormItemLabel } from "./contract/cards";
import { IRPCProvider } from "./wallet-reducer";

const antennaTest = new Antenna("");
export interface IAddCustomRPCFormModalProps {
  onOK(network: IRPCProvider): void;
  onCancel(): void;
  visible?: boolean;
  form: WrappedFormUtils;
}
class AddCustomRPCFormModalCom extends React.PureComponent<
  IAddCustomRPCFormModalProps
> {
  public state: { confirming: boolean } = {
    confirming: false
  };
  public handleOk = async () => {
    const { form, onOK } = this.props;
    if (!onOK) {
      return;
    }
    this.setState({ confirming: true });
    form.validateFields(["name", "url"], async (err, { name, url }) => {
      if (err) {
        return;
      }
      try {
        antennaTest.setProvider(url);
        await antennaTest.iotx.getServerMeta({});
        await onOK({ name, url: "", coreUrl: url });
      } catch (error) {
        notification.error({
          message: t("input.error.rpc.invalid"),
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
    return (
      <Modal
        title={t("account.addCustomRPC")}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={this.state.confirming}
        bodyStyle={{
          paddingTop: "0px !important"
        }}
      >
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.name")} </FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("name", {
            rules: rulesMap.name
          })(
            <Input
              placeholder={t("account.rpc.nameHolder")}
              style={{ width: "100%", background: colors.black10 }}
              name="name"
            />
          )}
        </Form.Item>
        <Form.Item
          label={<FormItemLabel>{t("wallet.input.url")} </FormItemLabel>}
          {...formItemLayout}
        >
          {getFieldDecorator("url", {
            rules: rulesMap.url
          })(
            <Input
              placeholder="https://iotexscan.io/"
              style={{ width: "100%", background: colors.black10 }}
              name="url"
            />
          )}
        </Form.Item>
      </Modal>
    );
  }
}

const AddCustomRPCFormModal = Form.create<IAddCustomRPCFormModalProps>()(
  AddCustomRPCFormModalCom
);
export default AddCustomRPCFormModal;
