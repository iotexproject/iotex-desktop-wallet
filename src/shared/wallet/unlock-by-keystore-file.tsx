import Button from "antd/lib/button";
import Form, { FormComponentProps, WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Upload from "antd/lib/upload";
import { RcFile } from "antd/lib/upload/interface";
import { decrypt } from "iotex-antenna/lib/account/wallet";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { PasswordFormInputItem } from "./contract/cards";
import { getAntenna } from "./get-antenna";
import { FormItemLabel } from "./wallet";

function getBase64(file: RcFile, done: Function): void {
  const reader = new FileReader();
  reader.addEventListener("load", () => done(reader.result));
  reader.readAsDataURL(file);
}

export interface State {
  priKey: string;
  isDecrypting: boolean;
}

export interface Props {
  setWallet: Function;
}

class UnlockByKeystoreFileInner extends PureComponent<
  Props & FormComponentProps,
  State
> {
  public state: State = {
    priKey: "",
    isDecrypting: false
  };

  public unlockWallet = async () => {
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const { password, keystore } = values;
      if (!password || !keystore) {
        return;
      }

      this.setState({ isDecrypting: true });

      getBase64(keystore.file, async (dataUrl: string) => {
        try {
          const regex = /^data:.+\/(.+);base64,(.*)$/;

          const matches = String(dataUrl).match(regex) || "";
          const data = matches[2];
          const keyObj = JSON.parse(
            Buffer.from(data, "base64").toString("utf8")
          );

          const { privateKey } = decrypt(keyObj, password);

          const antenna = getAntenna();
          const account = await antenna.iotx.accounts.privateKeyToAccount(
            privateKey
          );

          this.props.setWallet(account);
        } catch (e) {
          const msg = String(e);
          if (msg.indexOf("SyntaxError") !== -1) {
            notification.error({
              message: t("input.error.keystore.invalid"),
              duration: 5
            });
          } else if (msg.indexOf("derivation failed")) {
            notification.error({
              message: t("input.error.keystore.failed_to_derive"),
              duration: 5
            });
          } else {
            notification.error({ message: String(e), duration: 5 });
          }
        } finally {
          this.setState({ isDecrypting: false });
        }
      });
    });
  };

  public render(): JSX.Element {
    const { form } = this.props;
    const { isDecrypting } = this.state;

    return (
      <React.Fragment>
        <div style={{ margin: "24px" }} />
        <Form layout="vertical">
          <p>{t("unlock_by_keystore_file.never_upload")}</p>

          <Keystore form={form} />

          <PasswordFormInputItem form={form} />

          <Button onClick={this.unlockWallet} loading={isDecrypting}>
            {t("wallet.account.unlock")}
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

type KeystoreProps = { form: WrappedFormUtils };
type KeystoreState = { fileList: Array<RcFile> };

class Keystore extends React.Component<KeystoreProps, KeystoreState> {
  public state: KeystoreState = {
    fileList: []
  };

  public render(): JSX.Element {
    const { form } = this.props;
    const { fileList } = this.state;
    const props = {
      multiple: false,
      onRemove: () => {
        this.setState({
          fileList: []
        });
      },

      beforeUpload: (file: RcFile) => {
        this.setState({
          fileList: [file]
        });
        return false;
      },

      fileList
    };

    return (
      <Form.Item
        label={<FormItemLabel>{t("wallet.input.keystore")}</FormItemLabel>}
      >
        {form.getFieldDecorator("keystore", {
          rules: [
            {
              required: true,
              message: t("input.error.keystore.required")
            }
          ]
        })(
          <Upload {...props}>
            <Button>
              <Icon type="key" /> {t("unlock_by_keystore_file.select_file")}
            </Button>
          </Upload>
        )}
      </Form.Item>
    );
  }
}

export const UnlockByKeystoreFile = Form.create({
  name: "unlock-by-keystore-file"
})(UnlockByKeystoreFileInner);
