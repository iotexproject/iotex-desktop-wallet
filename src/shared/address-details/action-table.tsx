// tslint:disable:max-func-body-length
import { ColumnProps } from "antd/es/table";
import notification from "antd/lib/notification";
import Table from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import {
  ActionInfo,
  GetActionsResponse
} from "../../api-gateway/resolvers/antenna-types";
import { FlexLink } from "../common/flex-link";
import { getActionType } from "../common/get-action-type";
import { SpinPreloader } from "../common/spin-preloader";
import { GET_ACTIONS } from "../queries";

export function getAddress(record: ActionInfo): string {
  const addr: string =
    get(record, "action.core.transfer.recipient") ||
    get(record, "action.core.execution.contract") ||
    get(record, "action.core.createDeposit.recipient") ||
    get(record, "action.core.settleDeposit.recipient") ||
    get(record, "action.core.plumCreateDeposit.recipient") ||
    get(record, "action.core.plumTransfer.recipient") ||
    get(record, "action.core.createPlumChain.contract") ||
    "";
  if (!addr) {
    return "-";
  }
  return addr;
}

export function getActionColumns(): Array<ColumnProps<ActionInfo>> {
  return [
    {
      title: t("action.hash"),
      dataIndex: "actHash",
      render(text: string, _: ActionInfo, __: number): JSX.Element {
        return (
          <FlexLink path={`/action/${text}`} text={String(text).substr(0, 8)} />
        );
      }
    },
    {
      title: t("block.timestamp"),
      render(_: string, record: ActionInfo, __: number): string {
        return get(record, "block.timestamp");
      }
    },
    {
      title: t("action.block_hash"),
      dataIndex: "blkHash",
      render(text: string, _: ActionInfo, __: number): JSX.Element {
        return (
          <FlexLink path={`/block/${text}`} text={String(text).substr(0, 8)} />
        );
      }
    },
    {
      title: t("action.type"),
      dataIndex: "name",
      key: "name",
      render(_: string, record: ActionInfo, __: number): string {
        return getActionType(record);
      }
    },
    {
      title: t("action.sender"),
      dataIndex: "sender",
      render(_: string, record: ActionInfo, __: number): JSX.Element {
        const addr = publicKeyToAddress(String(record.action.senderPubKey));
        return (
          <FlexLink
            path={`/address/${addr}`}
            text={String(addr).substr(0, 8)}
          />
        );
      }
    },
    {
      title: t("action.recipient"),
      dataIndex: "recipient",
      render(_: string, record: ActionInfo, __: number): JSX.Element | string {
        const addr = getAddress(record);
        return (
          <FlexLink
            path={`/address/${addr}`}
            text={String(addr).substr(0, 8)}
          />
        );
      }
    },
    {
      title: t("action.amount"),
      dataIndex: "amount",
      render(_: string, record: ActionInfo, __: number): string {
        const amount: string =
          get(record, "action.core.execution.amount") ||
          get(record, "action.core.grantReward.amount") ||
          get(record, "action.core.transfer.amount") ||
          get(record, "action.core.createDeposit.amount") ||
          get(record, "action.core.settleDeposit.amount") ||
          get(record, "action.core.createPlumChain.amount") ||
          get(record, "action.core.plumCreateDeposit.amount") ||
          "";
        if (!amount) {
          return "-";
        }
        return `${fromRau(amount, "IOTX")} IOTX`;
      }
    },
    {
      title: t("action.data"),
      dataIndex: "status",
      render(_: string, record: ActionInfo, __: number): string {
        const data =
          get(record, "action.core.transfer.payload") ||
          get(record, "action.core.execution.data") ||
          "";
        if (!data) {
          return "-";
        }
        return String(data).substr(0, 8);
      }
    },
    {
      title: t("action.gas"),
      dataIndex: "gas",
      render(_: string, record: ActionInfo, __: number): string {
        const data = get(record, "action.core.gasPrice") || "";
        if (!data) {
          return "-";
        }
        return String(data);
      }
    }
  ];
}

type GetVariable = ({
  current,
  pageSize
}: {
  current: number;
  pageSize: number;
}) => {
  byAddr?: {
    address: string;
    start: number;
    count: number;
  };
  byBlk?: {
    blkHash: string;
    start: number;
    count: number;
  };
};

export function ActionTable({
  pageSize = 10,
  totalActions = 100,
  getVariable
}: {
  pageSize?: number;
  totalActions?: number;
  getVariable: GetVariable;
}): JSX.Element {
  return (
    <Query
      query={GET_ACTIONS}
      variables={getVariable({ pageSize, current: 0 })}
    >
      {({
        loading,
        error,
        data,
        fetchMore
      }: QueryResult<{ getActions: GetActionsResponse }>) => {
        if (error && String(error).indexOf("NOT_FOUND") === -1) {
          notification.error({
            message: "Error",
            description: `failed to get actions: ${error}`,
            duration: 5
          });
        }

        const actionInfo =
          data && data.getActions && data.getActions.actionInfo;

        return (
          <SpinPreloader spinning={loading}>
            <Table
              style={{ width: "100%" }}
              scroll={{ x: true }}
              rowKey={"hash"}
              columns={getActionColumns()}
              dataSource={actionInfo}
              pagination={{
                pageSize,
                total: totalActions
              }}
              onChange={pagination => {
                fetchMore({
                  query: GET_ACTIONS,
                  variables: getVariable({
                    current: pagination.current || 0,
                    pageSize
                  }),
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                      return prev;
                    }
                    return fetchMoreResult;
                  }
                });
              }}
            />
          </SpinPreloader>
        );
      }}
    </Query>
  );
}
