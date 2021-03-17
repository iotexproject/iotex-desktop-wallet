import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import Tag from "antd/lib/tag";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import { GetChainMetaResponse } from "iotex-antenna/protogen/proto/api/api_pb";
import { t } from "onefx/lib/iso-i18n";
import React, {FC, ReactNode, Ref, useImperativeHandle, useRef} from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";

import Button from "antd/lib/button";
import List from "antd/lib/list";
import moment from "moment";
import { withRouter } from "react-router";
import {
  ActionInfo,
  GetActionsResponse
} from "../../api-gateway/resolvers/antenna-types";
import { AddressName } from "../common/address-name";
import { analyticsClient } from "../common/apollo-client";
import { translateFn } from "../common/from-now";
import { actionsTypes, getActionType } from "../common/get-action-type";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { numberWithCommas } from "../common/vertical-table";
import {
  GET_ACTIONS,
  GET_ACTIONS_BY_BUCKET_INDEX,
  GET_ANALYTICS_ACTIONS_BY_TYPE,
  GET_CHAIN_META
} from "../queries";
import { ActionFeeRenderer } from "../renderer/action-fee-renderer";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";
import { ActionToRenderer } from "../renderer/action-to-renderer";
import ExportAction from "./action-export";
import {ExportAnalyticAction} from "./analytic-action-export";
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
    get(record, "action.core.stakeTransferOwnership.voterAddress") ||
    get(record, "action.core.stakeCreate.candidateName") ||
    get(record, "action.core.stakeChangeCandidate.candidateName") ||
    (get(record, "action.core.stakeAddDeposit.bucketIndex") &&
      t("action.to.bucket", {
        bucketIndex: get(record, "action.core.stakeAddDeposit.bucketIndex")
      })) ||
    "";
  if (!addr) {
    return "-";
  }
  return addr;
}

const filterTypeDropDown = () => (
  <div style={{ padding: 8 }}>
    <List
      size="small"
      dataSource={["all", ...actionsTypes]}
      renderItem={item => (
        <List.Item>
          {item !== "all" ? (
            <a href={`/action?actionType=${item}`}>{item}</a>
          ) : (
            <a href={`/action`}>{item}</a>
          )}
        </List.Item>
      )}
    />
  </div>
);

const getActionListColumns = (): Array<ColumnProps<ActionInfo>> => [
  {
    title: t("action.hash"),
    dataIndex: "actHash",
    width: "12vw",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    width: "6vw",
    render: (_, { timestamp }) => {
      return <div style={{ minWidth: 70}}>
          {translateFn(timestamp)}
        </div>
    }
  },
  {
    title: t("action.sender"),
    dataIndex: "sender",
    width: "12vw",
    render(_: string, record: ActionInfo, __: number): JSX.Element {
      const addr = publicKeyToAddress(String(record.action.senderPubKey));
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "12vw", minWidth: 120 }}
        >
          <AddressName address={addr} />
        </span>
      );
    }
  },
  {
    title: <TypeSpan />,
    dataIndex: "name",
    width: "5vw",
    render: (_: string, record: ActionInfo, __: number): JSX.Element => {
      return <Tag>{getActionType(record)}</Tag>;
    },
    filterDropdown: filterTypeDropDown
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
          style={{ maxWidth: "10vw", minWidth: 120 }}
        >
          <AddressName address={receipt} />
        </span>
      ) : (
        <ActionToRenderer value={record} />
      );
    }
  },
  {
    title: t("action.amount"),
    dataIndex: "amount",
    width: "7vw",
    render(_: string, record: ActionInfo, __: number): ReactNode {
      const amount: string =
        get(record, "action.core.execution.amount") ||
        get(record, "action.core.grantReward.amount") ||
        get(record, "action.core.transfer.amount") ||
        get(record, "action.core.createDeposit.amount") ||
        get(record, "action.core.settleDeposit.amount") ||
        get(record, "action.core.createPlumChain.amount") ||
        get(record, "action.core.plumCreateDeposit.amount") ||
        get(record, "action.core.grantReward.amount") ||
        get(record, "action.core.stakeAddDeposit.amount") ||
        "";
      if (!amount) {
        return "-";
      }

      return <div style={{ minWidth: 80 }}>
        {`${numberWithCommas(fromRau(amount, "IOTX"))} IOTX`}
      </div>;
    }
  },
  {
    title: t("render.key.fee"),
    dataIndex: "gasfee",
    width: "7vw",
    render: (_: string, record: ActionInfo, __: number): JSX.Element => {
      return <div style={{ minWidth: 80 }}>
        <ActionFeeRenderer value={record.actHash} />
      </div>
    }
  }
];
export interface IActionTable {
  address?: string;
  numActions: number;
  refInstance?: Ref<{handleExport(): void}>
}

export const ActionTable: React.FC<IActionTable> = ({
  numActions,
  address,
  refInstance
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

  const exportInstance = useRef<{excExport(): void}>(null);
  useImperativeHandle(refInstance, () => ({
    handleExport
  }));

  const handleExport = () => {
    exportInstance.current?.excExport()
  };

  return (
    <Query
      ssr={false}
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

        // fetchActions?.call(null, actions);

        // console.log('ActionTable -->');

        return (
          <>
            <ExportAction refInstance={exportInstance} actions={actions}/>
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
              size="middle"
              onChange={pagination => {
                const current = pagination.current || 1;
                const cStart = Math.max(start - (current - 1) * count, 0);
                fetchMore({
                  variables: getVariables(cStart, count),
                  updateQuery: (_, { fetchMoreResult }) => {
                    return fetchMoreResult || {};
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

export interface IAnalyticActionInfo {
  actHash: string;
  blkHash: string;
  timeStamp: string;
  actType: string;
  sender: string;
  recipient: string;
  amount: string;
  gasFee: string;
}

const getAnalyticActionColumns = (): Array<
  ColumnProps<IAnalyticActionInfo>
> => [
  {
    title: t("action.hash"),
    dataIndex: "actHash",
    width: "12vw",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timeStamp",
    width: "8vw",
    render: (_, { timeStamp }) => (
      <span
        className="ellipsis-text"
        style={{ maxWidth: "10vw", minWidth: 100 }}
      >
        {moment.unix(parseInt(timeStamp, 10)).fromNow()}
      </span>
    )
  },
  {
    title: t("action.sender"),
    dataIndex: "sender",
    width: "12vw",
    render: text => (
      <span
        className="ellipsis-text"
        style={{ maxWidth: "10vw", minWidth: 100 }}
      >
        <AddressName address={text} />
      </span>
    )
  },
  {
    title: <TypeSpan />,
    dataIndex: "actType",
    width: "5vw",
    render: (text): JSX.Element => {
      return <Tag>{text}</Tag>;
    },
    filterDropdown: filterTypeDropDown
  },
  {
    title: t("render.key.to"),
    dataIndex: "recipient",
    width: "10vw",
    render: text => (
      <span
        className="ellipsis-text"
        style={{ maxWidth: "10vw", minWidth: 100 }}
      >
        <AddressName address={text} />
      </span>
    )
  },
  {
    title: t("action.amount"),
    dataIndex: "amount",
    render: text => `${numberWithCommas(fromRau(text, "IOTX"))} IOTX`
  },
  {
    title: t("render.key.fee"),
    dataIndex: "gasfee",
    render: text => text
  }
];

type AnalyticActionTableProp = {
  actionType?: string;
  bucketIndex?: number;
  refInstance?: Ref<{handleExport(): void}>
}
export const AnalyticActionTable: FC<AnalyticActionTableProp> =
    ({ actionType, bucketIndex ,refInstance}) => {
  const variables = bucketIndex ? { bucketIndex } : { type: actionType };
  const by = bucketIndex ? "byBucketIndex" : "byType";
  const query = bucketIndex
    ? GET_ACTIONS_BY_BUCKET_INDEX
    : GET_ANALYTICS_ACTIONS_BY_TYPE;

  const exportInstance = useRef<{excExport(): void}>(null);

  useImperativeHandle(refInstance, () => ({
     handleExport
  }));

  const handleExport = () => {
     exportInstance.current?.excExport()
  };

  return (
    <Query
      query={query}
      variables={{
        ...variables,
        pagination: {
          skip: 0,
          first: PAGE_SIZE
        }
      }}
      ssr={false}
      client={analyticsClient}
    >
      {({
        data,
        loading,
        fetchMore,
        error
      }: QueryResult<{
        action: {
          byType?: {
            count: number;
            actions: Array<IAnalyticActionInfo>;
          };
          byBucketIndex?: {
            count: number;
            actions: Array<IAnalyticActionInfo>;
          };
        };
      }>) => {
        if (error) {
          notification.error({
            message: `failed to query actions in ActionTable: ${error}`
          });
        }

        const actions = get(data || {}, `action.${by}.actions`, []);
        const numActions = get(data || {}, `action.${by}.count`, 0);

        return (
          <>
            <ExportAnalyticAction refInstance={exportInstance} actions={actions}/>
            <Table
              loading={{
                spinning: loading,
                indicator: <Icon type="loading" />
              }}
              rowKey="actHash"
              dataSource={actions}
              columns={getAnalyticActionColumns()}
              style={{ width: "100%" }}
              scroll={{ x: "auto" }}
              pagination={{
                pageSize: PAGE_SIZE,
                total: numActions,
                showQuickJumper: true
              }}
              size="middle"
              onChange={pagination => {
                const current = Math.max(pagination.current || 1, 1);
                fetchMore({
                  // @ts-ignore
                  updateQuery: (_, { fetchMoreResult }) => {
                    return fetchMoreResult || {};
                  },
                  variables: {
                    type: actionType,
                    pagination: {
                      skip: (current - 1) * PAGE_SIZE,
                      first: PAGE_SIZE
                    }
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

const PageHeader: React.FC<{
  click? (): void
}> = ({ click }) => {

  return <div style={{display: "flex", alignItems: "center"}}>
    {t("topbar.actions")}
    <Button
      size="small"
      type="primary"
      style={{marginLeft: 10}}
      onClick={click}>{t("action.export")}</Button>
  </div>
};

const ActionListPage = withRouter(
  ({ location }): JSX.Element => {
    const actionType =
      new URLSearchParams(location.search).get("actionType") || "";

    const exportInstance = useRef<{handleExport(): void}>(null);

    const exportAction = () => {
      exportInstance.current?.handleExport()
    };

    return (
      <>
        <Helmet title={`${t("topbar.actions")} - ${t("meta.description")}`} />
        <PageNav items={[t("topbar.actions")]} />
        <ContentPadding>
          <Page header={<PageHeader click={exportAction}/>}>
            {actionType && <AnalyticActionTable refInstance={exportInstance} actionType={actionType} />}
            {!actionType && (
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
                  return <ActionTable refInstance={exportInstance} numActions={numActions}/>;
                }}
              </Query>
            )}
          </Page>
        </ContentPadding>
      </>
    );
  }
);

const TypeSpan = () => (
  <div style={{ minWidth: "45px" }}>
    <span>{t("action.type")}</span>
  </div>
);

export { ActionListPage };
