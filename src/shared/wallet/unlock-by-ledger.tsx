import Button from "antd/lib/button";
// @ts-ignore
import window from "global/window";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { connect, DispatchProp } from "react-redux";
// @ts-ignore
import { IoTeXApp } from "../../ledger/iotex";
import { getAntenna } from "./get-antenna";
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
          window.transport
            .create()
            // @ts-ignore
            .then(async transport => {
              transport.setDebugMode(true);
              const app = new IoTeXApp(transport);
              const result = await app.publicKey([44, 304, 0, 0, 0]);
              await transport.close();
              const address = publicKeyToAddress(
                result.publicKey.toString("hex")
              );
              const account = { address: address };
              getAntenna();
              window.signerPlugin.address = address;
              window.signerPlugin.publicKey = result.publicKey;
              // @ts-ignore
              dispatch(setAccount(account));
            })
            .catch((e: Error) => {
              // TODO popup warn window: Please plugin ledger device and open IoTeX app.
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
