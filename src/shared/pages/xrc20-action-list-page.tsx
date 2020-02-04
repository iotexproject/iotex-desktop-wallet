import { Tabs } from "antd";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import BigNumber from "bignumber.js";
import { get } from "dottie";
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { AddressName } from "../common/address-name";
import { analyticsClient } from "../common/apollo-client";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { XRC20TokenBalance, XRC20TokenValue } from "../common/xrc20-token";
import {
  GET_ANALYTICS_CONTRACT_HOLDERS,
  GET_ANALYTICS_XRC20_ACTIONS
} from "../queries";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";
import { TokenNameRenderer } from "../renderer/token-name-renderer";
const { TabPane } = Tabs;

const PAGE_SIZE = 30;

export interface IXRC20ActionInfo {
  contract: string;
  hash: string;
  timestamp: string;
  from: string;
  to: string;
  quantity: string;
}

export interface IXRC20HolderInfo {
  address: string;
  contract: string;
}

const getXrc20ActionListColumns = (): Array<ColumnProps<IXRC20ActionInfo>> => [
  {
    title: t("action.hash"),
    dataIndex: "hash",
    width: "20vw",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    width: "20vw",
    render: (_, { timestamp }) =>
      translateFn({ seconds: Number(timestamp), nanos: 0 })
  },
  {
    title: t("action.sender"),
    dataIndex: "from",
    width: "20vw",
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
    dataIndex: "to",
    width: "20vw",
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
    dataIndex: "quantity",
    width: "20vw",
    render(text: string, record: IXRC20ActionInfo, __: number): JSX.Element {
      return (
        <XRC20TokenValue
          contract={record.contract}
          value={new BigNumber(text)}
        />
      );
    }
  }
];

const getXrc20HoldersListColumns = (): Array<ColumnProps<IXRC20HolderInfo>> => [
  {
    title: t("render.key.address"),
    dataIndex: "address",
    width: "50vw",
    render: (text: string): JSX.Element | string => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "50vw", minWidth: 250 }}
        >
          <AddressName address={text} />
        </span>
      );
    }
  },
  {
    title: t("render.key.balance"),
    dataIndex: "contract",
    width: "50vw",
    render: (text: string, item: IXRC20HolderInfo): JSX.Element | string => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "50vw", minWidth: 250 }}
        >
          <XRC20TokenBalance
            key={`balance-${text}-${item.address}`}
            contract={text}
            address={item.address}
          />
        </span>
      );
    }
  }
];

export interface IXRC20ActionTable {
  address?: string;
}

export const XRC20ActionTable: React.FC<IXRC20ActionTable> = ({
  address = ""
}) => {
  return (
    <Query
      query={GET_ANALYTICS_XRC20_ACTIONS({
        address,
        page: 1,
        pageSize: PAGE_SIZE
      })}
      notifyOnNetworkStatusChange={true}
      client={analyticsClient}
    >
      {({ data, loading, fetchMore, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to query analytics xrc20 in XRC20ActionTable: ${error}`
          });
        }
        const actions =
          get<Array<IXRC20ActionInfo>>(data || {}, "xrc20.data.xrc20") || [];
        const numActions =
          get<number>(data || {}, "total.data.count") || 100000;
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="hash"
            dataSource={actions}
            columns={getXrc20ActionListColumns()}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: PAGE_SIZE,
              total: numActions,
              showQuickJumper: true
            }}
            size="middle"
            onChange={pagination => {
              fetchMore({
                query: GET_ANALYTICS_XRC20_ACTIONS({
                  address,
                  pageSize: PAGE_SIZE,
                  page: pagination.current || 1
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
        );
      }}
    </Query>
  );
};

export const XRC20HoldersTable: React.FC<IXRC20ActionTable> = ({
  address = ""
}) => {
  const [offset, setOffset] = useState(0);
  return (
    <Query
      query={GET_ANALYTICS_CONTRACT_HOLDERS}
      variables={{
        tokenAddress: address
      }}
      notifyOnNetworkStatusChange={true}
      client={analyticsClient}
    >
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to query analytics xrc20 in XRC20HoldersTable: ${error}`
          });
        }
        const holders =
          get<Array<string>>(
            data || {},
            "xrc20.tokenHolderAddresses.addresses"
          ) || [];
        const numHolders =
          get<number>(data || {}, "xrc20.tokenHolderAddresses.count") || 100000;
        const holdersPage = holders
          .slice(offset, offset + PAGE_SIZE)
          .map(addr => ({ address: addr, contract: address }));
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="hash"
            dataSource={holdersPage}
            columns={getXrc20HoldersListColumns()}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: PAGE_SIZE,
              total: numHolders,
              showQuickJumper: true
            }}
            size="middle"
            onChange={pagination => {
              setOffset(((pagination.current || 1) - 1) * PAGE_SIZE);
            }}
          />
        );
      }}
    </Query>
  );
};

const XRC20ActionListPage: React.FC<
  RouteComponentProps<{ address: string }>
> = ({
  match: {
    params: { address }
  }
}): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("pages.token")} - ${t("meta.description")}`} />
      <PageNav
        items={[
          <FlexLink
            key="nav-transfer"
            path="/tokens"
            text={t("topbar.tokensMenu")}
          />,
          ...(address
            ? [<TokenNameRenderer key={`token-${address}`} value={address} />]
            : [])
        ]}
      />
      <ContentPadding>
        <Tabs defaultActiveKey="1">
          <TabPane tab={t("pages.token")} key="1">
            <XRC20ActionTable address={address} />
          </TabPane>
          <TabPane tab={t("pages.tokenHolders")} key="2">
            <XRC20HoldersTable address={address} />
          </TabPane>
        </Tabs>
      </ContentPadding>
    </>
  );
};

export { XRC20ActionListPage };
