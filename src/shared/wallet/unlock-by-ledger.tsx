import Button from "antd/lib/button";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { connect, DispatchProp } from "react-redux";
import { assetURL } from "../common/asset-url";
import { CommonMargin } from "../common/common-margin";
import { getTransportProxy, LedgerPlugin } from "../ledger/get-proxy";
import { getAntenna } from "./get-antenna";
import { setAccount } from "./wallet-actions";

export interface State {
  priKey: string;
}

export interface Props extends DispatchProp {}

class UnlockByLedgerInner extends PureComponent<
  Props & FormComponentProps,
  State
> {
  public unlockWallet = async () => {
    this.props.form.validateFields(async err => {
      if (!err) {
        const proxy = await getTransportProxy();
        const publicKey = await proxy.getPublicKey([44, 304, 0, 0, 0]);
        const ledgerPlugin = new LedgerPlugin(
          [44, 304, 0, 0, 0],
          publicKey,
          proxy
        );

        const antenna = getAntenna(true);
        antenna.iotx.signer = ledgerPlugin;
        const account = antenna.iotx.accounts.addressToAccount(
          publicKeyToAddress(publicKey.toString("hex"))
        );
        this.props.dispatch(setAccount(account, true));
      }
    });
  };

  public render(): JSX.Element {
    return (
      <div>
        <CommonMargin />
        <Button htmlType="button" onClick={this.unlockWallet}>
          {t("wallet.account.unlock")}
        </Button>
        <CommonMargin />
        <img
          style={{
            maxHeight: "64px"
          }}
          src={assetURL("/connect-ledger.png")}
          alt="connect ledger"
        />
      </div>
    );
  }
}

export const UnlockByLedger = Form.create()(connect()(UnlockByLedgerInner));
