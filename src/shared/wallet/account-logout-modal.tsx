/* tslint:disable:no-any */
import Modal from "antd/lib/modal/Modal";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { ModalBody } from "../common/modal-body";
import { useDispatch, useSelector } from "react-redux";
import { IWalletState } from "./wallet-reducer";
import { setAccount } from "./wallet-actions";

const AccountLogoutModal = () => {
  const dispatch = useDispatch();
  const wallet = useSelector(
    (state: { wallet: IWalletState; base: { [index: string]: string } }) =>
      state.wallet
  );
  const { showUnlockModal } = wallet || {};

  const onClose = () => {
    dispatch(setAccount());
  };

  return (
    <Modal
      title={<b>{t("account.switchAccount")}</b>}
      visible={showUnlockModal || false}
      onCancel={onClose}
      onOk={onClose}
      okText={t("ok")}
      cancelButtonProps={{ style: { display: "none" } }}
      width={616}
      bodyStyle={{ paddingBottom: 28, paddingTop: 0 }}
    >
      <ModalBody>
        {t("wallet.logout.success")}&nbsp;{t("wallet.logout.login_to_another")}
      </ModalBody>
    </Modal>
  );
};

export default AccountLogoutModal;
