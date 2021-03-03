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
  showMnemonic: boolean;
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
      showMnemonic: false,
      account
    };
  }

  public copyMnemonic = () => {
    const { mnemonicPhrase } = this.state;
    copyCB(mnemonicPhrase);
    this.setState({ copiedMnemonic: true });
  };

  public setAccount = () => {
    this.props.dispatch(setAccount(this.state.account));
  };

  public renderSaveMnemonic(): JSX.Element {
    const { copiedMnemonic, mnemonicPhrase, showMnemonic } = this.state;
    const icon = showMnemonic ? "eye" : "eye-invisible";
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
        <div
          dangerouslySetInnerHTML={{ __html: t("new-wallet.save_mnemonic") }}
        />
        <Form.Item
          label={<FormItemLabel>{t("new-wallet.mnemonic")}</FormItemLabel>}
        >
          <div
            className="ant-input"
            style={{ backgroundColor: "#f7f7f7", height: "auto" }}
          >
            <div style={{ display: "inline-block", wordBreak: "break-all" }}>
              {showMnemonic
                ? mnemonicPhrase
                : mnemonicPhrase.replace(/./g, "*")}
            </div>
            {copyMnemonicButton}
            <Icon
              onClick={() => {
                this.setState({ showMnemonic: !showMnemonic });
              }}
              type={icon}
              style={{
                float: "right",
                marginRight: 25,
                marginTop: 3
              }}
            />
          </div>
        </Form.Item>
      </div>
    );
  }

  public render(): JSX.Element {
    const { account } = this.state;

    return (
      <div>
        <div>
          <p style={{ display: "inline-block" }} className="wallet-title">
            {t("new-wallet.created")}
          </p>
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
          closable={true}
          showIcon={true}
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

export default Form.create<Props>()(connect()(NewWallet));
