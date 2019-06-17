/* tslint:disable:no-any */
import Modal from "antd/lib/modal/Modal";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Board } from "./board";
import { Column, HorizontalTable } from "./horizontal-table";
import { ModalBody } from "./modal-body";

export interface Props {
  showModal: boolean;
  confirmContractOk: Function;
  dataSource: { [key: string]: any };
}

export interface State {}

export default class ConfirmContractModal extends React.Component<
  Props,
  State
> {
  public confirmContractOk = (status: boolean) => {
    this.props.confirmContractOk(status);
  };

  // tslint:disable:no-any
  public getActionColumns(): Array<Column<any>> {
    // this columns was just for example.
    const { toAddress, toContract, dataInHex, method } = this.props.dataSource;

    return [
      {
        title: t("confirmation.amount"),
        dataIndex: "amount",
        render(text: string, _: any): JSX.Element {
          return (
            <span>
              <h1 style={{ display: "inline" }}>{text}</h1>{" "}
            </span>
          );
        }
      },
      {
        title: t("confirmation.fromAddress"),
        dataIndex: "address"
      },
      ...(toAddress
        ? [
            {
              title: t("confirmation.toAddress"),
              dataIndex: "toAddress"
            }
          ]
        : []),
      ...(toContract
        ? [
            {
              title: t("confirmation.toContract"),
              dataIndex: "toContract"
            }
          ]
        : []),
      ...(method
        ? [
            {
              title: t("confirmation.method"),
              dataIndex: "method"
            }
          ]
        : []),
      {
        title: t("confirmation.limit"),
        dataIndex: "limit"
      },
      {
        title: t("confirmation.price"),
        dataIndex: "price"
      },
      ...(dataInHex
        ? [
            {
              title: t("confirmation.data"),
              dataIndex: "dataInHex"
            }
          ]
        : [])
    ];
  }

  public render(): JSX.Element {
    const { dataSource, showModal } = this.props;
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
            <p>{t("wallet.confirm.contract.p2")}</p>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
