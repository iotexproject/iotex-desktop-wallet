import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Button from "antd/lib/button";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { IoTeXApp } from "../../ledger/iotex";
import { setAccount } from "./wallet-actions";

interface IUnlockByLedgerComponentProps extends DispatchProp {}

const UnlockByLedgerComponent = (
  props: IUnlockByLedgerComponentProps
): JSX.Element => {
  const { dispatch } = props;
  return (
    <>
      <div style={{ margin: "24px" }} />
      <p>{t("unlock_by_ledger.message")}</p>
      <Button
        onClick={() => {
          TransportU2F.create()
            .then(async transport => {
              transport.setDebugMode(true);
              const app = new IoTeXApp(transport);
              const publicKey = await app.publicKey([44, 304, 0, 0, 0]);
              // TODO
              window.console.log(publicKey);
              await transport.close();
              const account = undefined; // Correct account here
              dispatch(setAccount(account));
            })
            .catch(e => {
              console.warn(e);
            });
        }}
      >
        {t("unlock-wallet.by_ledger")}
      </Button>
    </>
  );
};

const UnlockByLedger = connect()(UnlockByLedgerComponent);
export default UnlockByLedger;
