import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import Form, { FormComponentProps, WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";
import notification from "antd/lib/notification";
import Tag from "antd/lib/tag";
import Upload from "antd/lib/upload";
import { RcFile } from "antd/lib/upload/interface";
// @ts-ignore
import { decrypt } from "iotex-antenna/lib/account/wallet";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { xconf } from "../common/xconf";
import { PasswordFormInputItem } from "./contract/cards";
import { getAntenna } from "./get-antenna";
import { FormItemLabel } from "./wallet";

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

  public unlockWallet = () => {
    const { form } = this.props;
    this.setState({ isDecrypting: true });
    // setTimeout here is to avoid UI stuck while performing decrypting
    setTimeout(() => {
      form.validateFields(async (err, values) => {
        if (err || !values || !values.password || !values.keystore) {
          this.setState({ isDecrypting: false });
          return;
        }
        const { password, keystore } = values;

        try {
          const keyObj = JSON.parse(keystore);
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
    }, 50);
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

          <Button
            htmlType="submit"
            onClick={this.unlockWallet}
            loading={isDecrypting}
          >
            {t("wallet.account.unlock")}
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

type KeystoreProps = { form: WrappedFormUtils };
type KeystoreState = {
  keystores: { [index: string]: string };
  keyname: string;
};

class Keystore extends React.Component<KeystoreProps, KeystoreState> {
  constructor(props: KeystoreProps) {
    super(props);
    this.state = {
      keystores: xconf.getConf("keystores", {}),
      keyname: ""
    };
  }

  public readFileStore = (file: RcFile): boolean => {
    const { keystores } = this.state;
    const { form } = this.props;
    const reader = new FileReader();
    // Safe check for the file size. It should be < 10KB.
    if (file.size > 10 * 1024) {
      notification.error({
        message: t("input.error.keystore.invalid"),
        duration: 5
      });
      return false;
    }
    reader.onload = () => {
      try {
        const result = `${reader.result}`;
        if (JSON.parse(result)) {
          keystores[file.name] = result;
          // Update keystores list
          xconf.setConf("keystores", keystores);
          // Pass to the form
          form.setFieldsValue({
            keystore: result
          });
          // Update component state
          this.setState({
            keyname: file.name,
            keystores: {
              ...keystores
            }
          });
        } else {
          throw new Error(t("input.error.keystore.invalid"));
        }
      } catch (e) {
        notification.error({
          message: t("input.error.keystore.invalid"),
          duration: 5
        });
      }
    };
    reader.readAsText(file);
    return false;
  };

  public renderKeystoreMenu(): JSX.Element {
    const { keystores } = this.state;
    const keystoresList = Object.keys(keystores);
    const uploadProps = {
      beforeUpload: this.readFileStore,
      showUploadList: false,
      accept: ".json,application/json,text/json"
    };

    if (!keystoresList.length) {
      return (
        <Upload {...uploadProps}>
          <Button>
            <Icon type="key" /> {t("unlock_by_keystore_file.browse_file")}
          </Button>
        </Upload>
      );
    }

    const menu = (
      <Menu>
        {keystoresList.map(name => (
          <Menu.Item
            key={name}
            onClick={() => this.selectKeystore(name)}
            style={{ textAlign: "right" }}
          >
            <Tag
              onClose={() => this.deleteKeystore(name)}
              closable={true}
              className="keystore-tag"
            >
              {name}
            </Tag>
          </Menu.Item>
        ))}
        <Menu.Item>
          <Upload {...uploadProps}>
            <Icon type="key" /> {t("unlock_by_keystore_file.browse_file")}
          </Upload>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <Button>
          {t("unlock_by_keystore_file.select_file")} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }

  public selectKeystore(keyname: string): boolean {
    const keystores = xconf.getConf("keystores", {});
    if (keystores[keyname]) {
      this.setState({ keyname });
      const { form } = this.props;
      form.setFieldsValue({
        keystore: this.state.keystores[keyname]
      });
    }
    return true;
  }

  public deleteKeystore(keyname: string): boolean {
    const { keystores } = this.state;
    const newKeystores: { [index: string]: string } = {};
    Object.keys(keystores).forEach(name => {
      if (name !== keyname) {
        newKeystores[name] = keystores[name];
      }
    });
    if (keyname === this.state.keyname) {
      this.clearSelected();
    }
    this.setState({ keystores: newKeystores });
    // Update keystores list
    xconf.setConf("keystores", newKeystores);
    return true;
  }

  public clearSelected = () => {
    const { form } = this.props;
    form.setFieldsValue({
      keystore: ""
    });
    this.setState({ keyname: "" });
  };

  public render(): JSX.Element {
    const { form } = this.props;
    const { keyname } = this.state;
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
        })(this.renderKeystoreMenu())}
        <div>
          {keyname ? (
            <Tag
              onClose={this.clearSelected}
              closable={true}
              className="keystore-tag"
              style={{
                marginTop: 5
              }}
            >
              <Icon type="file" /> {keyname}
            </Tag>
          ) : null}
        </div>
      </Form.Item>
    );
  }
}

export const UnlockByKeystoreFile = Form.create({
  name: "unlock-by-keystore-file"
})(UnlockByKeystoreFileInner);
