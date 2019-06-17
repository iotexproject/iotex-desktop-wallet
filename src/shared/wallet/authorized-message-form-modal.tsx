import { Form, Input, Modal, notification } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { IAuthorizedMessage } from "../../erc20/vita";
import { rulesMap } from "../common/rules";
import { colors } from "../common/styles/style-color";

export interface IClaimAsFormModalProps {
  onOK(authMessage: IAuthorizedMessage): void;
  onCancel(): void;
  visible?: boolean;
  form: WrappedFormUtils;
}
class AuthorizedMessageForm extends React.PureComponent<
  IClaimAsFormModalProps
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
    form.validateFields(["authMessage"], async (err, { authMessage }) => {
      if (err) {
        return;
      }
      try {
        const auth: IAuthorizedMessage = JSON.parse(authMessage);
        await onOK(auth);
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
    return (
      <Modal
        title={t("account.claimAs")}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={this.state.confirming}
        bodyStyle={{
          paddingTop: "0px !important"
        }}
      >
        <Form.Item
          label={t("account.claimAs.authorizedMessage")}
          wrapperCol={{
            xs: 24
          }}
        >
          {getFieldDecorator("authMessage", {
            rules: rulesMap.authMessage
          })(
            <TextArea
              placeholder={t("account.claimAs.authorizedTemplate")}
              style={{ width: "100%", background: colors.black10 }}
              name="authMessage"
              rows={7}
            />
          )}
        </Form.Item>
      </Modal>
    );
  }
}

const AuthorizedMessageFormModal = Form.create<AuthorizedMessageForm>()(
  AuthorizedMessageForm
);
export default AuthorizedMessageFormModal;
