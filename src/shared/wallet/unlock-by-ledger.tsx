import Button from "antd/lib/button";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { connect } from "react-redux";

const UnlockByLedgerComponent = () => {
  return (
    <>
      <div style={{ margin: "24px" }} />
      <p>{t("unlock_by_ledger.message")}</p>
      <Button
        onClick={() => {
          // TODO: Impletement connect ledger device here
        }}
      >
        {t("unlock-wallet.by_ledger")}
      </Button>
    </>
  );
};

const UnlockByLedger = connect()(UnlockByLedgerComponent);
export default UnlockByLedger;
