import Button from "antd/lib/button";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import { RemoteAccount } from "iotex-antenna/lib/account/account";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React, { PureComponent } from "react";
import { connect, DispatchProp } from "react-redux";
import { assetURL } from "../common/asset-url";
import { CommonMargin } from "../common/common-margin";
import { getTransportProxy, LedgerPlugin } from "../ledger/get-proxy";
import { getAntenna } from "./get-antenna";
import { setAccount } from "./wallet-actions";

export interface State {
  priKey: string;
  errorMessage: string;
  isPending: boolean;
}

export const InputError = styled("div", {
  color: "#d93900 !important",
  height: "16px",
  lineHeight: "16px"
});

export interface Props extends DispatchProp {}

class UnlockByLedgerInner extends PureComponent<
  Props & FormComponentProps,
  State
> {
  public state: State = { priKey: "", errorMessage: "", isPending: false };

  public unlockWallet = async () => {
    this.setState({ errorMessage: "", isPending: true });
    this.props.form.validateFields(async err => {
      if (!err) {
        try {
          const proxy = await getTransportProxy();
          const publicKey = await proxy.getPublicKey([44, 304, 0, 0, 0]);

          if (!publicKey) {
            return;
          }
          const ledgerPlugin = new LedgerPlugin(
            [44, 304, 0, 0, 0],
            publicKey,
            proxy
          );
          const antenna = getAntenna(true, ledgerPlugin);

          const account = new RemoteAccount(
            publicKeyToAddress(Buffer.from(publicKey).toString("hex")),
            ledgerPlugin
          );
          antenna.iotx.accounts.addAccount(account);

          this.props.dispatch(setAccount(account, true));
        } catch (e) {
          this.setState({
            errorMessage: t("unlock_by_ledger.error", {
              message: e.message || ""
            })
          });
        }
      }
      this.setState({ isPending: false });
    });
  };

  public render(): JSX.Element {
    return (
      <div>
        <CommonMargin />
        <img
          style={{
            maxHeight: "64px"
          }}
          src={assetURL("connect-ledger.png")}
          alt="connect ledger"
        />

        <CommonMargin />

        <CommonMargin>
          <Button
            htmlType="button"
            onClick={this.unlockWallet}
            loading={this.state.isPending}
          >
            {t("wallet.account.unlock")}
          </Button>
          {this.state.errorMessage && (
            <InputError>{this.state.errorMessage}</InputError>
          )}
        </CommonMargin>
      </div>
    );
  }
}

export const UnlockByLedger = Form.create()(connect()(UnlockByLedgerInner));
