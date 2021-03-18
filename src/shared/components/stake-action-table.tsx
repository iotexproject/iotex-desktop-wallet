import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React, {Ref, useImperativeHandle, useRef} from "react";
import { Query, QueryResult } from "react-apollo";
import { AddressName } from "../common/address-name";
import { analyticsClient } from "../common/apollo-client";
import { translateFn } from "../common/from-now";
import { GET_ANALYTICS_STAKE_ACTIONS } from "../queries";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";
import { BlockHashRenderer } from "../renderer/block-hash-renderer";
import { IOTXValueRenderer } from "../renderer/iotx-value-renderer";
import StakeActionExport from "./stake-action-export"

const PAGE_SIZE = 15;

export interface IStakeActionInfo {
  actHash: string;
  blkHash: string;
  timeStamp: string;
  sender: string;
  amount: string;
  gasFee: string
}

const getStakeActionListColumns = (): Array<ColumnProps<IStakeActionInfo>> => [
  {
    title: t("action.hash"),
    dataIndex: "actHash",
    width: "20vw",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("action.block_hash"),
    dataIndex: "blkHash",
    width: "20vw",
    render: text => <BlockHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    width: "10vw",
    render: (_, { timeStamp }) =>
      <div style={{ minWidth: 80 }}>
        {translateFn({ seconds: Number(timeStamp), nanos: 0 })}
      </div>
  },
  {
    title: t("action.sender"),
    dataIndex: "sender",
    width: "20vw",
    render: (text: string): JSX.Element | string => {
      return (
        <div
          className="ellipsis-text"
          style={{ maxWidth: "20vw", minWidth: 100 }}
        >
          <AddressName address={text} />
        </div>
      );
    }
  },
  {
    title: t("action.amount"),
    dataIndex: "amount",
    width: "10vw",
    render(text: string): JSX.Element {
      return <div style={{ minWidth: 80 }}>
        <IOTXValueRenderer value={text} />
      </div>
    }
  },
  {
    title: t("render.key.fee"),
    dataIndex: "gasFee",
    width: "10vw",
    render: text => <div style={{ minWidth: 80 }}>
      {fromRau(text, "IOTX")}
    </div>
  }
];

export interface IStakeActionTable {
  voter?: string;
  refInstance?: Ref<{handleExport(): void}>
}

export const StakeActionTable: React.FC<IStakeActionTable> = ({
  voter = "",
  refInstance
}) => {

  const exportInstance = useRef<{excExport(): void}>(null);

  useImperativeHandle(refInstance, () => ({
    handleExport
  }));

  const handleExport = () => {
    exportInstance.current?.excExport()
  };

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
          <>
            <StakeActionExport refInstance={exportInstance} actions={actions}/>
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
          </>
        );
      }}
    </Query>
  );
};
