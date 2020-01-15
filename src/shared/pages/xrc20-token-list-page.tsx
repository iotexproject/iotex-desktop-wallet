import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import Tag from "antd/lib/tag";
import BigNumber from "bignumber.js";
import { get } from "dottie";
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { AddressName } from "../common/address-name";
import { analyticsClient } from "../common/apollo-client";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_XRC20_TOKENS } from "../queries";
import { TokenAddressRenderer } from "../renderer/token-address-renderer";
import { TokenNameRenderer } from "../renderer/token-name-renderer";
import { Page } from "./page";

const PAGE_SIZE = 30;

export interface IXRC20TokenInfo {
  name: string;
  address: string;
}

const getXrc20TokenListColumns = (): Array<ColumnProps<IXRC20TokenInfo>> => [
  {
    title: t("token.name"),
    dataIndex: "name",
    width: "20vw",
    render: (text: string): JSX.Element | string => {
      return <TokenNameRenderer value={text} />;
    }
  },
  {
    title: t("token.address"),
    dataIndex: "address",
    width: "20vw",
    render: (text: string): JSX.Element | string => {
      return <TokenAddressRenderer value={text} />;
    }
  }
];

export const XRC20TokenTable: React.FC = () => {
  return (
    <Query
      query={GET_XRC20_TOKENS}
      notifyOnNetworkStatusChange={true}
      client={analyticsClient}
      variables={{
        pagination: {
          skip: 0,
          first: PAGE_SIZE
        }
      }}
    >
      {({
        data,
        loading,
        fetchMore,
        error
      }: QueryResult<{ addressMeta: { name: string } }>) => {
        if (error) {
          notification.error({
            message: `failed to query analytics xrc20 in XRC20TokenTable: ${error}`
          });
        }
        const addresses =
          get<Array<string>>(data || {}, "xrc20.xrc20Addresses.addresses") ||
          [];
        const numAddress =
          get<number>(data || {}, "xrc20.xrc20Addresses.count") || 100000;
        const tokens = addresses.map(a => ({ name: a, address: a }));

        const paginationConfig =
          numAddress > PAGE_SIZE
            ? {
                pageSize: PAGE_SIZE,
                total: numAddress,
                showQuickJumper: true
              }
            : false;
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="hash"
            dataSource={tokens}
            columns={getXrc20TokenListColumns()}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={paginationConfig}
            size="middle"
            onChange={pagination => {
              fetchMore({
                variables: {
                  pagination: {
                    skip: ((pagination.current || 1) - 1) * PAGE_SIZE,
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

const XRC20TokenListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("topbar.tokens")} - ${t("meta.description")}`} />
      <PageNav items={[t("topbar.tokens")]} />
      <ContentPadding>
        <Page
          header={
            <>
              {t("pages.tokenTracker")}{" "}
              <Tag color="blue" style={{ marginTop: -2, marginLeft: 10 }}>
                {t("token.xrc20")}
              </Tag>
            </>
          }
        >
          <XRC20TokenTable />
        </Page>
      </ContentPadding>
    </>
  );
};

export { XRC20TokenListPage };
