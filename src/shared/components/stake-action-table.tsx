import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { AddressName } from "../common/address-name";
import { analyticsClient } from "../common/apollo-client";
import { translateFn } from "../common/from-now";
import { GET_ANALYTICS_STAKE_ACTIONS } from "../queries";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";
import { BlockHashRenderer } from "../renderer/block-hash-renderer";
import { IOTXValueRenderer } from "../renderer/iotx-value-renderer";

const PAGE_SIZE = 15;

export interface IStakeActionInfo {
  from: string;
  to: string;
  quantity: string;
  actHash: string;
  blkHash: string;
  timeStamp: string;
}

const getStakeActionListColumns = (): Array<ColumnProps<IStakeActionInfo>> => [
  {
    title: t("action.hash"),
    dataIndex: "actHash",
    width: "10vw",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("action.block_hash"),
    dataIndex: "blkHash",
    width: "10vw",
    render: text => <BlockHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    render: (_, { timeStamp }) =>
      translateFn({ seconds: Number(timeStamp), nanos: 0 })
  },
  {
    title: t("action.from"),
    dataIndex: "sender",
    width: "10vw",
    render: (text: string): JSX.Element | string => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "10vw", minWidth: 100 }}
        >
          <AddressName address={text} />
        </span>
      );
    }
  },
  {
    title: t("render.key.to"),
    dataIndex: "recipient",
    width: "10vw",
    render: (text: string): JSX.Element | string => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "10vw", minWidth: 100 }}
        >
          <AddressName address={text} />
        </span>
      );
    }
  },
  {
    title: t("action.amount"),
    dataIndex: "amount",
    render(text: string): JSX.Element {
      return <IOTXValueRenderer value={text} />;
    }
  },
  {
    title: t("render.key.fee"),
    dataIndex: "gasFee",
    render: text => fromRau(text, "IOTX")
  }
];

export interface IStakeActionTable {
  voter?: string;
}

export const StakeActionTable: React.FC<IStakeActionTable> = ({
  voter = ""
}) => {
  return (
    <Query
      query={GET_ANALYTICS_STAKE_ACTIONS}
      variables={{
        voter,
        pagination: {
          skip: 0,
          first: PAGE_SIZE
        }
      }}
      ssr={false}
      notifyOnNetworkStatusChange={true}
      client={analyticsClient}
    >
      {({ data, loading, fetchMore, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `Failed to query contract actions: ${error}`
          });
        }
        const actions =
          get<Array<IStakeActionInfo>>(data || {}, "action.byVoter.actions") ||
          [];
        const numActions = get<number>(data || {}, "action.byVoter.count") || 0;
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="hash"
            dataSource={actions}
            columns={getStakeActionListColumns()}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: PAGE_SIZE,
              total: numActions,
              showQuickJumper: true
            }}
            onChange={pagination => {
              fetchMore({
                variables: {
                  voter,
                  pagination: {
                    skip: Math.max(
                      ((pagination.current || 1) - 1) * PAGE_SIZE,
                      0
                    ),
                    first: PAGE_SIZE
                  }
                },
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
