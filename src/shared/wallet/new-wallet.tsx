import Alert from "antd/lib/alert";
import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { copyCB } from "text-to-clipboard";
import { CommonMargin } from "../common/common-margin";
import { DownloadKeystoreForm } from "./download-keystore-form";
import { getAntenna } from "./get-antenna";
import { FormItemLabel, inputStyle } from "./wallet";
import { setWallet } from "./wallet-actions";

export interface Props extends DispatchProp {
  form: WrappedFormUtils;
}

export interface State {
  copied: boolean;
  wallet: Account;
}

class NewWallet extends React.Component<Props, State> {
  public state: State = {
    copied: false,
    wallet: getAntenna().iotx.accounts.create()
  };

  public copyPriKey = () => {
    const { wallet } = this.state;
    copyCB(wallet.privateKey);
    this.setState({ copied: true });
  };

  public setWallet = () => {
    this.props.dispatch(setWallet(this.state.wallet));
  };

  public render(): JSX.Element {
    const { wallet, copied } = this.state;

    const copyButton = (
      // @ts-ignore
      <Button
        type="primary"
        onClick={this.copyPriKey}
        style={{ margin: "0 -11px" }}
      >
        {copied ? <Icon type="check" /> : t("new-wallet.copy")}
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
              value={wallet.address}
              readOnly={true}
            />
          </Form.Item>
          <Form.Item
            label={<FormItemLabel>{t("wallet.account.private")}</FormItemLabel>}
          >
            <Input.Password
              className="form-input"
              placeholder={t("wallet.account.addressPlaceHolder")}
              addonAfter={copyButton}
              value={wallet.privateKey}
              readOnly={true}
            />
          </Form.Item>
        </Form>

        <DownloadKeystoreForm
          privateKey={wallet.privateKey}
          address={wallet.address}
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
        <Button href="#" type="primary" onClick={this.setWallet}>
          {t("new-wallet.button.unlock")}
        </Button>
        <CommonMargin />
      </div>
    );
  }
}

export default Form.create<NewWallet>()(connect()(NewWallet));
