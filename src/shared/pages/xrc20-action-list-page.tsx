import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import Tag from "antd/lib/tag";
import BigNumber from "bignumber.js";
import { get } from "dottie";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { AddressName } from "../common/address-name";
import { analyticsClient } from "../common/apollo-client";
import { translateFn } from "../common/from-now";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { XRC20TokenValue } from "../common/xrc20-token";
import { GET_ANALYTICS_XRC20_ACTIONS } from "../queries";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";
import { Page } from "./page";

const PAGE_SIZE = 30;

export interface IXRC20ActionInfo {
  contract: string;
  hash: string;
  timestamp: string;
  from: string;
  to: string;
  quantity: string;
}

const getXrc20ActionListColumns = (): Array<ColumnProps<IXRC20ActionInfo>> => [
  {
    title: t("action.hash"),
    dataIndex: "hash",
    width: "10vw",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    render: (_, { timestamp }) =>
      translateFn({ seconds: Number(timestamp), nanos: 0 })
  },
  {
    title: t("action.sender"),
    dataIndex: "from",
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
    dataIndex: "to",
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
    dataIndex: "quantity",
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
        const numActions = get<number>(data || {}, "total.data.count") || 0;
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

const XRC20ActionListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("pages.token")} - ${t("meta.description")}`} />
      <PageNav items={[t("pages.token")]} />
      <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
        <Page
          header={
            <>
              {t("pages.token")}{" "}
              <Tag color="blue" style={{ marginTop: -2, marginLeft: 10 }}>
                {t("token.xrc20")}
              </Tag>
            </>
          }
        >
          <XRC20ActionTable />
        </Page>
      </ContentPadding>
    </>
  );
};

export { XRC20ActionListPage };
