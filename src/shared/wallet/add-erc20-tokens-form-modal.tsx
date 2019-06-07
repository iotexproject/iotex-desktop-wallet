import { Form, Input, Modal } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { rulesMap } from "../common/rules";
import { colors } from "../common/styles/style-color";

export interface IAddCustomTokensFormModalProps {
  onOK(erc20Address: string): void;
  onCancel(): void;
  visible?: boolean;
  form: WrappedFormUtils;
}
class AddCustomTokensFormModal extends React.PureComponent<
  IAddCustomTokensFormModalProps
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
    form.validateFields(["erc20Address"], async (err, { erc20Address }) => {
      if (err) {
        return;
      }
      await onOK(erc20Address);
      this.setState({ confirming: false });
    });
  };
  public render(): JSX.Element {
    const { form, onCancel, visible = false } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={t("account.erc20.addCustom")}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={this.state.confirming}
        bodyStyle={{
          paddingTop: "0px !important"
        }}
      >
        <Form.Item
          label={t("wallet.input.fromErc20")}
          wrapperCol={{
            xs: 24
          }}
        >
          {getFieldDecorator("erc20Address", {
            rules: rulesMap.erc20Address
          })(
            <Input
              placeholder="io..."
              style={{ width: "100%", background: colors.black10 }}
              name="erc20Address"
            />
          )}
        </Form.Item>
      </Modal>
    );
  }
}

export default Form.create<AddCustomTokensFormModal>()(
  AddCustomTokensFormModal
);
