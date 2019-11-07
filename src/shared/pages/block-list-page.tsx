import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import {
  BlockMeta,
  GetBlockMetasResponse
} from "../../api-gateway/resolvers/antenna-types";
import { AddressName } from "../common/address-name";
import { LinkButton } from "../common/buttons";
import { translateFn } from "../common/from-now";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_BLOCK_METAS, GET_LATEST_HEIGHT } from "../queries";
import { Page } from "./page";

const PAGE_SIZE = 30;

const getBlockListColumns = (): Array<ColumnProps<BlockMeta>> => [
  {
    title: t("block.height"),
    dataIndex: "height",
    render(_: string, record: BlockMeta, __: number): JSX.Element {
      return (
        <LinkButton href={`/block/${record.height}`}>
          {record.height}
        </LinkButton>
      );
    }
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    render(_: string, record: BlockMeta, __: number): JSX.Element {
      return <span>{translateFn(record.timestamp)}</span>;
    }
  },
  {
    title: t("block.num_actions"),
    dataIndex: "numActions"
  },
  {
    title: t("block.producer_address"),
    dataIndex: "producerAddress",
    width: "10vw",
    render(_: string, record: BlockMeta, __: number): JSX.Element {
      return (
        <span className="ellipsis-text" style={{ maxWidth: "10vw" }}>
          <AddressName address={record.producerAddress} />
        </span>
      );
    }
  },
  {
    title: t("block.transfer_amount"),
    dataIndex: "transferAmount",
    render(text: string, _: BlockMeta, __: number): string {
      return `${fromRau(text || "0", "IOTX")} IOTX`;
    }
  }
];

const BlockListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("block.blocks")} - ${t("meta.description")}`} />
      <PageNav items={[t("topbar.blocks")]} />
      <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
        <Page header={t("block.blocks")}>
          <Query query={GET_LATEST_HEIGHT}>
            {({
              data,
              error
            }: QueryResult<{ chainMeta: { height: number } }>) => {
              if (error) {
                notification.error({
                  message: `failed to query latest height in BlockListPage: ${error}`
                });
              }
              if (!data) {
                return null;
              }
              const latestHeight = Number(get(data, "chainMeta.height"));
              const start = Math.max(latestHeight - PAGE_SIZE, 1);
              const count = PAGE_SIZE;
              return (
                <Query
                  query={GET_BLOCK_METAS}
                  variables={{
                    byIndex: { start, count }
                  }}
                  notifyOnNetworkStatusChange={true}
                >
                  {({
                    data,
                    loading,
                    fetchMore,
                    error
                  }: QueryResult<{ getBlockMetas: GetBlockMetasResponse }>) => {
                    if (error) {
                      notification.error({
                        message: `failed to query block metas in BlockListPage: ${error}`
                      });
                    }
                    let blkMetas =
                      get<Array<BlockMeta>>(
                        data || {},
                        "getBlockMetas.blkMetas"
                      ) || [];
                    if (blkMetas && Array.isArray(blkMetas)) {
                      // reorder
                      blkMetas = blkMetas.sort((a, b) => b.height - a.height);
                    }
                    return (
                      <Table
                        loading={{
                          spinning: loading,
                          indicator: <Icon type="loading" />
                        }}
                        rowKey={"height"}
                        dataSource={blkMetas}
                        columns={getBlockListColumns()}
                        style={{ width: "100%" }}
                        scroll={{ x: "auto" }}
                        pagination={{
                          pageSize: count,
                          total: latestHeight,
                          showQuickJumper: true
                        }}
                        onChange={pagination => {
                          const current = pagination.current || 0;
                          const cstart = Math.max(
                            latestHeight - current * PAGE_SIZE,
                            1
                          );
                          fetchMore({
                            variables: {
                              byIndex: {
                                start: cstart,
                                count
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
            }}
          </Query>
        </Page>
      </ContentPadding>
    </>
  );
};

export { BlockListPage };
