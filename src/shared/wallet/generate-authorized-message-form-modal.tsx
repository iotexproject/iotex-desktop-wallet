import { Form, Input, Modal, notification } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { ITokenInfo } from "../../erc20/token";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { rulesMap } from "../common/rules";
import { colors } from "../common/styles/style-color";
import { toETHAddress } from "./address";
import { FormItemLabel } from "./contract/cards";

export interface IGenerateAuthorizedMessageFormProps {
  onClose(): void;
  visible?: boolean;
  form: WrappedFormUtils;
  account?: Account;
  token: ITokenInfo;
}
class GenerateAuthorizedMessageForm extends React.PureComponent<
  IGenerateAuthorizedMessageFormProps
> {
  public state: { confirming: boolean; authMessage: string } = {
    confirming: false,
    authMessage: ""
  };
  public handleOk = async () => {
    const { form } = this.props;

    form.validateFields(["nonce"], async (err, { nonce }) => {
      if (err) {
        return;
      }
      try {
        this.setState({
          authMessage: this.generateMessage(nonce)
        });
      } catch (error) {
        notification.error({
          message: t("Error!"),
          description: `${error.message}`,
          duration: 3
        });
      }
    });
  };

  private generateMessage(nonce: string): string {
    const { account } = this.props;
    const { token } = this.props;
    if (!nonce || !account || !token) {
      return "";
    }
    return `${nonce}I authorize ${toETHAddress(
      account.address
    )} to claim in ${toETHAddress(token.tokenAddress)}`;
  }

  public render(): JSX.Element {
    const { form, onClose, visible = false } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={t("account.claimAs.generateAuthMessage")}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onClose}
        okText={t("account.claimAs.generate")}
        cancelText={t("account.claimAs.close")}
        confirmLoading={this.state.confirming}
        bodyStyle={{
          paddingTop: "0px !important"
        }}
      >
        <Form.Item
          label={t("wallet.input.nonce")}
          wrapperCol={{
            xs: 24
          }}
        >
          {getFieldDecorator("nonce", {
            rules: rulesMap.nonce
          })(
            <Input
              placeholder={"1"}
              style={{ width: "100%", background: colors.black10 }}
              name="nonce"
            />
          )}
        </Form.Item>
        {this.state.authMessage && (
          <>
            <FormItemLabel>
              {t("account.claimAs.authMessage")}{" "}
              <CopyButtonClipboardComponent
                text={this.state.authMessage}
                size="small"
              />
            </FormItemLabel>
            <textarea
              readOnly={true}
              style={{
                width: "100%",
                background: colors.black10,
                borderColor: colors.black60,
                margin: "10px 0px"
              }}
              value={this.state.authMessage}
              placeholder={""}
              rows={3}
            />
          </>
        )}
      </Modal>
    );
  }
}

const GenerateAuthorizedMessageFormModal = Form.create<
  GenerateAuthorizedMessageForm
>()(GenerateAuthorizedMessageForm);
export default GenerateAuthorizedMessageFormModal;
