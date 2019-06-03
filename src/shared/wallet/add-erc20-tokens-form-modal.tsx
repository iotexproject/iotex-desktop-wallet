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
  form: WrappedFormUtils;
}
class AddCustomTokensFormModal extends React.PureComponent<
  IAddCustomTokensFormModalProps
> {
  public handleOk = () => {
    const { form, onOK } = this.props;
    form.validateFields(
      ["erc20Address"],
      (err, { erc20Address }) => !err && onOK(erc20Address)
    );
  };
  public render(): JSX.Element {
    const { form, onCancel } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={t("account.erc20.addCustom")}
        visible={true}
        onOk={this.handleOk}
        onCancel={onCancel}
        bodyStyle={{
          padding: "0px 20px !important"
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
