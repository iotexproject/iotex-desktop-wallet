import Alert from "antd/lib/alert";
import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import dateformat from "dateformat";
import exportFromJSON from "export-from-json";
import { Account } from "iotex-antenna/lib/account/account";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import * as React from "react";
import { copyCB } from "text-to-clipboard";
import { CommonMargin } from "../common/common-margin";
import { getAntenna } from "./get-antenna";
import { FormItemLabel, inputStyle } from "./wallet";

function dummyEncrypt(a: string, b: string): {} {
  return { a, b };
}

function utcNow(): string {
  return dateformat(new Date().toUTCString(), "UTC:yyyy-mm-dd'T'HH-MM-ss.l'Z'");
}

export interface Props {
  form: WrappedFormUtils;
  setWallet: Function;
}

export interface State {
  copied: boolean;
  wallet: Account;
}

class NewWalletComponent extends React.Component<Props, State> {
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
    this.props.setWallet(this.state.wallet);
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

        {isElectron() && (
          // @ts-ignore
          <Button
            type="primary"
            onClick={() => {
              exportFromJSON({
                data: dummyEncrypt(wallet.privateKey, "password"),
                fileName: `UTC--${utcNow()}--${wallet.address}`,
                exportType: "json"
              });
            }}
          >
            {t("new-wallet.download")}
          </Button>
        )}

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
      </div>
    );
  }
}

export default Form.create<NewWalletComponent>()(NewWalletComponent);
