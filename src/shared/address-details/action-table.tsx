// tslint:disable:max-func-body-length
import { ColumnProps } from "antd/es/table";
import Icon from "antd/lib/icon";
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
import { translateFn } from "../common/from-now";
import { getActionType } from "../common/get-action-type";
import { SpinPreloader } from "../common/spin-preloader";
import { GET_ACTIONS } from "../queries";
import { LAP_WIDTH } from "../common/styles/style-media";

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

interface CustomCoulns {
  [key: string]: ColumnProps<ActionInfo>;
}

export function getActionColumns({
  customColumns = {}
}: { customColumns?: CustomCoulns } = {}): Array<ColumnProps<ActionInfo>> {
  const { actHash } = customColumns;
  return [
    actHash
      ? actHash
      : {
          title: t("action.hash"),
          dataIndex: "actHash",
          render(text: string, _: ActionInfo, __: number): JSX.Element {
            return (
              <FlexLink
                path={`/action/${text}`}
                text={String(text).substr(0, 8)}
              />
            );
          }
        },
    {
      title: t("block.timestamp"),
      dataIndex: "timestamp",
      render(_: string, record: ActionInfo, __: number): JSX.Element {
        return <span>{translateFn(get(record, "timestamp"))}</span>;
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
        return addr !== "-" ? (
          <FlexLink
            path={`/address/${addr}`}
            text={String(addr).substr(0, 8)}
          />
        ) : (
          <span>-</span>
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
      render(_: string, record: ActionInfo, __: number): JSX.Element | string {
        const data =
          get<string>(record, "action.core.transfer.payload") ||
          get<string>(record, "action.core.execution.data") ||
          "";
        const hash = String(record.actHash || "").substr(0, 8);
        if (!data || !hash) {
          return "-";
        }
        const downloadHref = `data:text/plan,${encodeURIComponent(data)}`;
        return (
          <a
            href={`${downloadHref}`}
            download={`${hash}.txt`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon type="download" />
          </a>
        );
      }
    }
  ];
}

type GetVariable = ({
  current,
  pageSize,
  currentDataLength
}: {
  current: number;
  pageSize: number;
  currentDataLength: number;
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
  getVariable,
  customColumns
}: {
  pageSize?: number;
  totalActions?: number;
  getVariable: GetVariable;
  customColumns?: CustomCoulns;
}): JSX.Element {
  return (
    <Query
      query={GET_ACTIONS}
      variables={getVariable({ pageSize, current: 1, currentDataLength: 0 })}
    >
      {({
        loading,
        error,
        data,
        fetchMore
      }: QueryResult<{ getActions: GetActionsResponse }>) => {
        if (error) {
          return null;
        }
        const actionInfo =
          data && data.getActions && data.getActions.actionInfo;
        const currentDataLength = actionInfo && actionInfo.length;

        return (
          <SpinPreloader spinning={loading}>
            <Table
              style={{ width: "100%" }}
              scroll={{ x: `${LAP_WIDTH}px` }}
              rowKey={"hash"}
              columns={getActionColumns({ customColumns })}
              dataSource={actionInfo}
              pagination={{
                pageSize,
                total: totalActions,
                showQuickJumper: true
              }}
              onChange={pagination => {
                fetchMore({
                  query: GET_ACTIONS,
                  variables: getVariable({
                    current: pagination.current || 0,
                    pageSize,
                    currentDataLength: currentDataLength || 0
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
