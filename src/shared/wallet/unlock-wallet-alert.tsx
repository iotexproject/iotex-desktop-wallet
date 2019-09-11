import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
import { Account } from "iotex-antenna/lib/account/account";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { IWalletState, SignParams } from "./wallet-reducer";

// tslint:disable-next-line: no-any
interface Props extends React.ComponentProps<any> {
  signParams: SignParams;
  account?: Account;
}

const UnlockWallet = ({
  account,
  signParams,
  children
}: Props): JSX.Element => {
  const isUnlocked =
    isElectron() && !account && !!signParams && !!signParams.reqId;
  const [isVisible, setIsVisible] = useState(isUnlocked);

  useEffect(() => {
    setIsVisible(isUnlocked);
  }, [account, signParams]);

  return (
    <>
      {children}
      <Modal
        title={t("wallet.unlock_alert.title")}
        visible={isVisible}
        onCancel={() => setIsVisible(false)}
        footer={
          <Button
            key="submit"
            type="primary"
            href="#"
            onClick={() => setIsVisible(false)}
          >
            {t("wallet.unlock_alert.confirm")}
          </Button>
        }
      >
        <p>{t("wallet.unlock_alert.tip")}</p>
      </Modal>
    </>
  );
};

export const UnlockWalletAlert = connect(
  (state: { wallet: IWalletState; signParams: SignParams }) => ({
    account: (state.wallet || {}).account,
    signParams: state.signParams
  })
)(UnlockWallet);
