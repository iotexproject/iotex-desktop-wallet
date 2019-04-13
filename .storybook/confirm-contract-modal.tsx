import Modal from "antd/lib/modal/Modal";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Board } from "../src/shared/common/board";
import { Column, HorizontalTable } from "../src/shared/common/horizontal-table";
import { ModalBody } from "../src/shared/common/modal-body";

export interface Props {
  showModal: boolean;
  confirmContractOk: Function;
  dataSource: object;
}

export interface State {
  showModal: boolean;
}

export default class ConfirmContractModal extends React.Component<
  Props,
  State
> {
  public state: State = this.props;

  public confirmContractOk = (status: boolean) => {
    this.setState({ showModal: false });
    if (status) {
      this.props.confirmContractOk();
    }
  };

  // tslint:disable:no-any
  public getActionColumns(): Array<Column<any>> {
    // this columns was just for example.
    return [
      {
        title: "Amount",
        dataIndex: "amount",
        render(text: string, _: any): JSX.Element {
          return (
            <span>
              <h1 style={{ display: "inline" }}>{fromRau(text, "IOTX")}</h1>{" "}
              IOTX
            </span>
          );
        }
      },
      {
        title: "From address",
        dataIndex: "address"
      },
      {
        title: "To address",
        dataIndex: "toAddress"
      },
      {
        title: "Gas limit",
        dataIndex: "limit"
      },
      {
        title: "Gas price",
        dataIndex: "price"
      },
      {
        title: "Nonce",
        dataIndex: "nonce"
      },
      {
        title: "Data",
        dataIndex: "data"
      }
    ];
  }

  public render(): JSX.Element {
    const { dataSource } = this.props;
    const { showModal } = this.state;
    return (
      <Modal
        title={<b>{t("wallet.confirm.contract.title")}</b>}
        visible={showModal}
        width={616}
        bodyStyle={{ paddingBottom: 28, paddingTop: 0 }}
        okText={t("wallet.confirm.contract.yes")}
        cancelText={t("wallet.confirm.contract.cancel")}
        onOk={() => this.confirmContractOk(true)}
        onCancel={() => this.confirmContractOk(false)}
      >
        <ModalBody>
          <Board>
            <HorizontalTable
              columns={this.getActionColumns()}
              dataSource={dataSource}
            />
          </Board>
          <div style={{ marginTop: 24, paddingLeft: 6 }}>
            <p>
              {t("wallet.confirm.contract.p1")}
              <b> {"3,000"}</b> IOTX.
              <br />
              {t("wallet.confirm.contract.p2")}
            </p>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
