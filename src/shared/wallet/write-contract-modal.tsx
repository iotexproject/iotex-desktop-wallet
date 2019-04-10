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
}

export interface State {}

export default class WriteContractModal extends React.Component<Props> {
  public generateTransaction = (status: boolean) => {
    if (status) {
      this.props.generateTransaction();
    }
  };

  public render(): JSX.Element {
    const { showModal } = this.props;
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
            You are about to <b>execute a function on contract.</b>
            <br />
            It will be deployed on the following network: <b>xxxxxxxxxxxx</b>
          </p>
          <div>
            <b>Amount to send. In most cases you should leave it as 0.</b>
          </div>
          <Board>0</Board>
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
