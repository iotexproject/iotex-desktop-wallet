import Button from "antd/lib/button";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Row from "antd/lib/row";
// @ts-ignore
import Mnemonic from "bitcore-mnemonic";
import { get } from "dottie";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { connect, DispatchProp } from "react-redux";
import { getAntenna } from "./get-antenna";
import { FormItemLabel } from "./wallet";
import { setAccount } from "./wallet-actions";

export interface State {
  mnemonicPhrase: string;
}

export interface Props extends DispatchProp {}

class UnlockByMnemonicInner extends PureComponent<
  Props & FormComponentProps,
  State
> {
  public state: State = {
    mnemonicPhrase: ""
  };

  public handleInputChange = (e: React.FormEvent) => {
    const name: string = get(e, "target.name");
    const value = get(e, "target.value");
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  public unlockWallet = async () => {
    this.props.form.validateFields(async err => {
      if (!err) {
        const { mnemonicPhrase } = this.state;
        const antenna = getAntenna();
        const code = new Mnemonic(mnemonicPhrase);
        code.toString();
        const xpriv = code.toHDPrivateKey();
        const account = await antenna.iotx.accounts.privateKeyToAccount(
          xpriv.privateKey.toString()
        );
        this.props.dispatch(setAccount(account));
      }
    });
  };

  public render(): JSX.Element {
    const { mnemonicPhrase } = this.state;
    const { getFieldDecorator } = this.props.form;
    const validMnemonicPhrase = mnemonicPhrase.trim().split(" ").length === 12;

    return (
      <React.Fragment>
        <div style={{ margin: "24px" }} />
        <Form layout="vertical">
          <Row className="ant-form-item">
            <div className="ant-form-item-label">
              <label className="ant-form-item-required" title="">
                <FormItemLabel>{t("input.error.mnemonic.label")}</FormItemLabel>
              </label>
            </div>

            {getFieldDecorator("mnemonicPhrase", {
              rules: [
                {
                  required: true,
                  message: t("input.error.mnemonic.invalid")
                },
                {
                  validator: (_, value, callback) => {
                    value.trim().length === 0 ||
                    value.trim().split(" ").length === 12
                      ? callback()
                      : callback(t("input.error.mnemonic.length"));
                  }
                }
              ]
            })(
              <Input
                className="form-input"
                placeholder={t("input.error.mnemonic.placeholder")}
                name="mnemonicPhrase"
                onChange={e => this.handleInputChange(e)}
              />
            )}
          </Row>
          <Button
            htmlType="submit"
            disabled={!validMnemonicPhrase}
            onClick={this.unlockWallet}
          >
            {t("wallet.account.unlock")}
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

export const UnlockByMnemonic = Form.create()(connect()(UnlockByMnemonicInner));
