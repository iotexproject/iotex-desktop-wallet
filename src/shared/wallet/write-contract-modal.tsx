import Button from "antd/lib/button/button";
import Modal from "antd/lib/modal/Modal";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Board } from "../common/board";
import { ModalBody } from "../common/modal-body";

export interface Props {
  showModal: boolean;
  generateTransaction: Function;
  networkAddress: string;
  amount: Number;
}

export interface State {}

export default class WriteContractModal extends React.Component<Props> {
  public generateTransaction = (status: boolean) => {
    if (status) {
      this.props.generateTransaction();
    }
  };

  public render(): JSX.Element {
    const { showModal, networkAddress, amount } = this.props;
    return (
      <Modal
        title={<b>{t("wallet.write.contract.title")}</b>}
        visible={showModal}
        width={600}
        bodyStyle={{ paddingBottom: 28, paddingTop: 0 }}
        footer={null}
      >
        <ModalBody>
          <p>
            {t("wallet.write.contract.p1")}
            <b> {t("wallet.write.contract.p1.b")}</b>
            <br />
            {t("wallet.write.contract.p2")}: <b>{networkAddress}</b>
          </p>
          <div>
            <b>{t("wallet.write.contract.p3")}</b>
          </div>
          <Board>{amount}</Board>
        </ModalBody>
        <Button
          href="#"
          size="large"
          type="primary"
          onClick={() => this.generateTransaction(true)}
        >
          <b>{t("wallet.write.contract.ok")}</b>
        </Button>
      </Modal>
    );
  }
}
