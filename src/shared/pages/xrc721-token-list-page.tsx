import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import Tag from "antd/lib/tag";
import { get } from "dottie";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { analyticsClient } from "../common/apollo-client";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_XRC721_TOKENS } from "../queries";
import { TokenNameRenderer } from "../renderer/token-name-renderer";
import { Xrc721TokenAddressRenderer } from "../renderer/xrc721-token-address-renderer";
import { Page } from "./page";

const PAGE_SIZE = 15;

export interface IXRC721TokenInfo {
  name: string;
  address: string;
}

const getXrc721TokenListColumns = (): Array<ColumnProps<IXRC721TokenInfo>> => [
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
      return <Xrc721TokenAddressRenderer value={text} />;
    }
  }
];

export const XRC721TokenTable: React.FC = () => {
  return (
    <Query
      query={GET_XRC721_TOKENS}
      notifyOnNetworkStatusChange={true}
      ssr={false}
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
            message: `failed to query analytics xrc721 in XRC721TokenTable: ${error}`
          });
        }
        const addresses =
          get<Array<string>>(data || {}, "xrc721.xrc721Addresses.addresses") ||
          [];
        const numAddress = get<number>(
          data || {},
          "xrc721.xrc721Addresses.count"
        );
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
            columns={getXrc721TokenListColumns()}
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

const XRC721TokenListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet
        title={`${t("topbar.xrc721Tokens")} - ${t("meta.description")}`}
      />
      <PageNav items={[t("topbar.xrc721Tokens")]} />
      <ContentPadding>
        <Page
          header={
            <>
              {t("pages.tokenTracker")}{" "}
              <Tag color="blue" style={{ marginTop: -2, marginLeft: 10 }}>
                {t("token.xrc721")}
              </Tag>
            </>
          }
        >
          <XRC721TokenTable />
        </Page>
      </ContentPadding>
    </>
  );
};

export { XRC721TokenListPage };
