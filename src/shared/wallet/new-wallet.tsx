import Alert from "antd/lib/alert";
import Button from "antd/lib/button";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import Tooltip from "antd/lib/tooltip";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import * as React from "react";
import { copyCB } from "text-to-clipboard";
import { getAntenna } from "./get-antenna";

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

    const copyButton = copied ? <Icon type="check" /> : t("new-wallet.copy");
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
          <Form.Item label={t("wallet.account.raw")}>
            <Input
              placeholder={t("wallet.account.addressPlaceHolder")}
              value={wallet.address}
              readOnly={true}
            />
          </Form.Item>
          <Form.Item label={t("wallet.account.private")}>
            <Input.Search
              placeholder={t("wallet.account.addressPlaceHolder")}
              enterButton={copyButton}
              onSearch={this.copyPriKey}
              value={wallet.privateKey}
              readOnly={true}
              suffix={
                <Tooltip title="Extra information">
                  <Icon type="eye" style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Form>

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
