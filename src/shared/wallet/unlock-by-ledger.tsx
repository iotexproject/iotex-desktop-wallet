import Button from "antd/lib/button";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { connect, DispatchProp } from "react-redux";
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
          // TODO: Impletement connect ledger device here
          const account = undefined; // Correct account here
          dispatch(setAccount(account));
        }}
      >
        {t("unlock-wallet.by_ledger")}
      </Button>
    </>
  );
};

const UnlockByLedger = connect()(UnlockByLedgerComponent);
export default UnlockByLedger;
