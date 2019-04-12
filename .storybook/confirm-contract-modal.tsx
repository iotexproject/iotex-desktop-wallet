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
  generateTransaction: Function;
}

export interface State {}

export default class ConfirmContractModal extends React.Component<Props> {
  public generateTransaction = (status: boolean) => {
    if (status) {
      this.props.generateTransaction();
    }
  };

  // tslint:disable:no-any
  public getActionColumns(): Array<Column<any>> {
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
    const { showModal } = this.props;
    const dataSource = {
      amount: "100000000000000000",
      address: "ox293482032dnmkejr2893uohd293dj2odj92o39jfd938",
      toAddress: "io1qyqsyqcyr0t0klgng7qfqmlq2laj24zyuexhul9sn7vtn9",
      limit: 0,
      price: 22,
      nonce: 1,
      data: 0
    };

    return (
      <Modal
        title={<b>{t("wallet.confirm.contract.title")}</b>}
        visible={showModal}
        width={616}
        bodyStyle={{ paddingBottom: 28, paddingTop: 0 }}
        okText={t("wallet.confirm.contract.yes")}
        cancelText={t("wallet.confirm.contract.cancel")}
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
