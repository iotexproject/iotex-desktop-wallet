// @flow
import Alert from "antd/lib/alert";
import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
// @ts-ignore
import Mnemonic from "bitcore-mnemonic";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { copyCB } from "text-to-clipboard";
import { CommonMargin } from "../common/common-margin";
import { DownloadKeystoreForm } from "./download-keystore-form";
import { getAntenna } from "./get-antenna";
import { FormItemLabel, inputStyle } from "./wallet";
import { setAccount } from "./wallet-actions";

export interface Props extends DispatchProp {
  form: WrappedFormUtils;
}

export interface State {
  copiedPriKey: boolean;
  copiedMnemonic: boolean;
  account: Account;
  mnemonicPhrase: string;
}

class NewWallet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const code = new Mnemonic();
    const xpriv = code.toHDPrivateKey();
    const account = getAntenna().iotx.accounts.privateKeyToAccount(
      xpriv.privateKey.toString()
    );
    this.state = {
      copiedMnemonic: false,
      copiedPriKey: false,
      mnemonicPhrase: code.toString(),
      account
    };
  }

  public copyPriKey = () => {
    const { account } = this.state;
    copyCB(account.privateKey);
    this.setState({ copiedPriKey: true });
  };

  public copyMnemonic = () => {
    const { mnemonicPhrase } = this.state;
    copyCB(mnemonicPhrase);
    this.setState({ copiedMnemonic: true });
  };

  public setAccount = () => {
    this.props.dispatch(setAccount(this.state.account));
  };

  public saveMnemonic = () => {
    const { copiedMnemonic } = this.state;
    const copyMnemonicButton = (
      // @ts-ignore
      <Button
        onClick={this.copyMnemonic}
        style={{ margin: "-5px -11px", float: "right" }}
      >
        {copiedMnemonic ? <Icon type="check" /> : t("new-wallet.copy")}
      </Button>
    );
    return (
      <div>
        <div className="wallet-title" style={{ display: "inline-block" }}>
          {t("new-wallet.save")}
        </div>
        <div className="private-key">{t("new-wallet.mnemonic")}</div>
        <Form.Item
          label={<FormItemLabel>{t("new-wallet.mnemonic")}</FormItemLabel>}
        >
          <div className="ant-input" style={{ backgroundColor: "#f7f7f7" }}>
            <div style={{ display: "inline-block" }}>
              {this.state.mnemonicPhrase}
            </div>
            {copyMnemonicButton}
          </div>
        </Form.Item>
      </div>
    );
  };

  public render(): JSX.Element {
    const { account, copiedPriKey } = this.state;
    const copyPriKeyButton = (
      // @ts-ignore
      <Button onClick={this.copyPriKey} style={{ margin: "0 -11px" }}>
        {copiedPriKey ? <Icon type="check" /> : t("new-wallet.copy")}
      </Button>
    );

    return (
      <div>
        <div>
          <p style={{ display: "inline-block" }} className="wallet-title">
            {t("new-wallet.created")}
          </p>
          <p className="private-key">{t("new-wallet.privateKey")}</p>
        </div>
        <br />
        <Form layout="vertical">
          <Form.Item
            label={<FormItemLabel>{t("wallet.account.raw")}</FormItemLabel>}
          >
            <Input
              style={inputStyle}
              placeholder={t("wallet.account.addressPlaceHolder")}
              value={account.address}
              readOnly={true}
            />
          </Form.Item>
          <Form.Item
            label={<FormItemLabel>{t("wallet.account.private")}</FormItemLabel>}
          >
            <Input.Password
              className="form-input"
              placeholder={t("wallet.account.addressPlaceHolder")}
              addonAfter={copyPriKeyButton}
              value={account.privateKey}
              readOnly={true}
            />
          </Form.Item>
          {this.saveMnemonic}
        </Form>
        <DownloadKeystoreForm
          privateKey={account.privateKey}
          address={account.address}
        />

        <CommonMargin />

        <Alert
          message={
            <div className="message-body">
              <p>
                <strong>{t("new-wallet.warn.do-not-lose")}</strong>{" "}
                {t("new-wallet.warn.cant-recover")}
              </p>
              <p>
                <strong>{t("new-wallet.warn.do-not-share")}</strong>{" "}
                {t("new-wallet.warn.stolen")}
              </p>
              <p>
                <strong>{t("new-wallet.warn.backup")}</strong>{" "}
                {t("new-wallet.warn.secure")}
              </p>
            </div>
          }
          type="warning"
          closable
          showIcon
        />
        <br />
        <Button href="#" type="primary" onClick={this.setAccount}>
          {t("new-wallet.button.unlock")}
        </Button>
        <CommonMargin />
      </div>
    );
  }
}

export default Form.create<NewWallet>()(connect()(NewWallet));
