import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import Tag from "antd/lib/tag";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import { GetChainMetaResponse } from "iotex-antenna/protogen/proto/api/api_pb";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import {
  ActionInfo,
  GetActionsResponse
} from "../../api-gateway/resolvers/antenna-types";
import { AddressName } from "../common/address-name";
import { translateFn } from "../common/from-now";
import { getActionType } from "../common/get-action-type";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACTIONS, GET_CHAIN_META } from "../queries";
import { ActionFeeRenderer } from "../renderer/action-fee-renderer";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";
import { Page } from "./page";

const PAGE_SIZE = 15;

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

const getActionListColumns = (): Array<ColumnProps<ActionInfo>> => [
  {
    title: t("action.hash"),
    dataIndex: "actHash",
    width: "10vw",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    render: (_, { timestamp }) => translateFn(timestamp)
  },
  {
    title: t("action.sender"),
    dataIndex: "sender",
    width: "10vw",
    render(_: string, record: ActionInfo, __: number): JSX.Element {
      const addr = publicKeyToAddress(String(record.action.senderPubKey));
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "10vw", minWidth: 100 }}
        >
          <AddressName address={addr} />
        </span>
      );
    }
  },
  {
    title: t("action.type"),
    dataIndex: "name",
    render: (_: string, record: ActionInfo, __: number): JSX.Element => {
      return <Tag>{getActionType(record)}</Tag>;
    }
  },
  {
    title: t("render.key.to"),
    dataIndex: "to",
    width: "10vw",
    render: (_: string, record: ActionInfo): JSX.Element | string => {
      const receipt = getAddress(record);
      return receipt !== "-" ? (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "10vw", minWidth: 100 }}
        >
          <AddressName address={receipt} />
        </span>
      ) : (
        receipt
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
    title: t("render.key.fee"),
    dataIndex: "gasfee",
    render: (_: string, record: ActionInfo, __: number): JSX.Element => {
      return <ActionFeeRenderer value={record.actHash} />;
    }
  }
];

export interface IActionTable {
  address?: string;
  numActions: number;
}

export const ActionTable: React.FC<IActionTable> = ({
  numActions,
  address
}) => {
  const start = Math.max(numActions - PAGE_SIZE, 0);
  const count = PAGE_SIZE;
  const getVariables = (
    start: number,
    count: number
  ): {
    byIndex?: {
      start: number;
      count: number;
    };
    byAddr?: {
      address: string;
      start: number;
      count: number;
    };
  } => {
    return address
      ? {
          byAddr: {
            address,
            start,
            count
          }
        }
      : {
          byIndex: { start: start || 0, count: count || 0 }
        };
  };
  return (
    <Query
      query={GET_ACTIONS}
      variables={getVariables(start, count)}
      notifyOnNetworkStatusChange={true}
    >
      {({
        data,
        loading,
        fetchMore,
        error
      }: QueryResult<{ getActions: GetActionsResponse }>) => {
        if (error) {
          notification.error({
            message: `failed to query actions in ActionTable: ${error}`
          });
        }
        const actions =
          get<Array<ActionInfo>>(data || {}, "getActions.actionInfo") || [];
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="actHash"
            dataSource={actions}
            columns={getActionListColumns()}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: count,
              total: numActions,
              showQuickJumper: true
            }}
            onChange={pagination => {
              const current = pagination.current || 0;
              const cStart = Math.max(start - (current - 1) * count, 0);
              fetchMore({
                variables: getVariables(cStart, count),
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) {
                    return prev;
                  }
                  return fetchMoreResult;
                }
              });
            }}
          />
        );
      }}
    </Query>
  );
};

const ActionListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("topbar.actions")} - ${t("meta.description")}`} />
      <PageNav items={[t("topbar.actions")]} />
      <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
        <Page header={t("topbar.actions")}>
          <Query query={GET_CHAIN_META}>
            {({
              data,
              loading,
              error
            }: QueryResult<{ chainMetaData: GetChainMetaResponse }>) => {
              if (error) {
                notification.error({
                  message: `failed to query chain meta in ActionListPage: ${error}`
                });
              }
              if (!data || loading) {
                return null;
              }
              const numActions = parseInt(
                get(data, "chainMeta.numActions"),
                10
              );
              return <ActionTable numActions={numActions} />;
            }}
          </Query>
        </Page>
      </ContentPadding>
    </>
  );
};

export { ActionListPage };
