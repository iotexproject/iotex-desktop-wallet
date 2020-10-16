/* tslint:disable:no-any */
import Modal from "antd/lib/modal/Modal";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Board } from "./board";
import { Flex } from "./flex";
import { Column, HorizontalTable } from "./horizontal-table";
import { ModalBody } from "./modal-body";
import { Dict } from "./types";
import { numberWithCommas } from "./vertical-table";

export interface Props {
  showModal: boolean;
  confirmContractOk: Function;
  dataSource: Dict;
  confirmLoading?: boolean;
  title?: string;
  okText?: string;
  maskClosable?: boolean;
  showWhitelistBtn?: boolean;
  onWhitelistBtnClick?(): void;
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
    const {
      amount,
      toAddress,
      toContract,
      dataInHex,
      method,
      owner,
      ...others
    } = this.props.dataSource;

    const extra: Array<Column<any>> = [];
    Object.keys(others).forEach(key => {
      if (
        (!["limit", "price", "address"].includes(key) &&
          typeof others[key] === "string") ||
        typeof others[key] === "number" ||
        typeof others[key] === "boolean"
      ) {
        extra.push({
          title: t(`confirmation.${key}`),
          dataIndex: key
        });
      }
    });
    return [
      ...(amount
        ? [
            {
              title: t("confirmation.amount"),
              dataIndex: "amount",
              render(text: string, _: any): JSX.Element {
                return (
                  <span>
                    <h1 style={{ display: "inline" }}>
                      {numberWithCommas(text)}
                    </h1>{" "}
                  </span>
                );
              }
            }
          ]
        : []),
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
      ...(owner
        ? [
            {
              title: t("confirmation.owner"),
              dataIndex: "owner"
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
        : []),
      ...extra
    ];
  }

  public render(): JSX.Element {
    const {
      dataSource,
      showModal,
      confirmLoading,
      title = t("wallet.confirm.contract.title"),
      okText = t("wallet.confirm.contract.yes"),
      maskClosable = true
    } = this.props;
    return (
      <Modal
        title={<b>{title}</b>}
        visible={showModal}
        width={616}
        bodyStyle={{ paddingBottom: 28, paddingTop: 0 }}
        okText={okText}
        cancelText={t("wallet.confirm.contract.cancel")}
        onOk={() => this.confirmContractOk(true)}
        onCancel={() => this.confirmContractOk(false)}
        confirmLoading={confirmLoading}
        maskClosable={maskClosable}
      >
        <ModalBody>
          <Board>
            <HorizontalTable
              columns={this.getActionColumns()}
              dataSource={dataSource}
            />
          </Board>
          <div style={{ marginTop: 24, paddingLeft: 6 }}>
            <Flex justifyContent="space-between" alignItems="center">
              <span>{t("wallet.confirm.contract.p2")}</span>
              {!!this.props.showWhitelistBtn && (
                <a
                  href="void:0"
                  role="main"
                  onClick={this.props.onWhitelistBtnClick}
                >
                  {t(
                    this.props.children
                      ? "wallet.whitelist.cancel_addition"
                      : "wallet.whitelist.add"
                  )}
                </a>
              )}
            </Flex>
          </div>
          {this.props.children}
        </ModalBody>
      </Modal>
    );
  }
}
