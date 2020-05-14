import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import Button from "antd/lib/button";
import Form, { FormComponentProps } from "antd/lib/form/Form";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { connect, DispatchProp } from "react-redux";
import { IoTeXApp } from "../ledger";
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
        const transport = await TransportNodeHid.create();
        const app = new IoTeXApp(transport);
        const publicKey = await app.publicKey([44, 304, 0, 0, 0]);
        // TODO
        await transport.close();
        const antenna = getAntenna(true);
        const account = await antenna.iotx.accounts.privateKeyToAccount("");
        this.props.dispatch(setAccount(account));
      }
    });
  };

  public render(): JSX.Element {
    return (
      <React.Fragment>
        <div style={{ margin: "24px" }} />
        <Button htmlType="button" onClick={this.unlockWallet}>
          {t("wallet.account.unlock")}
        </Button>
      </React.Fragment>
    );
  }
}

export const UnlockByLedger = Form.create()(connect()(UnlockByLedgerInner));
