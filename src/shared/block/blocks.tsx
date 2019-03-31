import Layout from "antd/lib/layout";
import notification from "antd/lib/notification";
import { ColumnProps } from "antd/lib/table";
import Table from "antd/lib/table";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { Link } from "react-router-dom";
import {
  BlockMeta,
  GetBlockMetasResponse
} from "../../api-gateway/resolvers/antenna-types";
import { fromNow } from "../common/from-now";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_BLOCK_METAS, GET_LATEST_HEIGHT } from "../queries";

function getColumns(): Array<ColumnProps<BlockMeta>> {
  return [
    {
      title: t("block.height"),
      dataIndex: "height",
      render(_: string, record: BlockMeta, __: number): JSX.Element {
        return <Link to={`/block/${record.hash}/`}>{record.height}</Link>;
      }
    },
    {
      title: t("block.timestamp"),
      dataIndex: "timestamp",
      render(_: string, record: BlockMeta, __: number): JSX.Element {
        return <span>{fromNow(record.timestamp)}</span>;
      }
    },
    {
      title: t("block.num_actions"),
      dataIndex: "numActions"
    },
    {
      title: t("block.producer_address"),
      dataIndex: "producerAddress",
      render(_: string, record: BlockMeta, __: number): JSX.Element {
        return (
          <Link to={`/address/${record.producerAddress}/`}>
            {record.producerAddress}
          </Link>
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
}

const PAGE_SIZE = 30;

function getBlockIndexRange(
  endHeight: number = 0,
  currentPage: number = 1
): { start: number; count: number } {
  const start = endHeight - currentPage * PAGE_SIZE;
  return {
    start: start < 1 ? 1 : start,
    count: PAGE_SIZE
  };
}

export function Blocks(): JSX.Element {
  return (
    <ContentPadding>
      <Query query={GET_LATEST_HEIGHT}>
        {({ data }: QueryResult<{ chainMeta: { height: number } }>) => {
          const latestHeight =
            (data && data.chainMeta && data.chainMeta.height) || 0;
          const byIndex = getBlockIndexRange(latestHeight);

          return (
            <Query query={GET_BLOCK_METAS} variables={{ byIndex }}>
              {({
                loading,
                error,
                data,
                fetchMore
              }: QueryResult<{ getBlockMetas: GetBlockMetasResponse }>) => {
                if (error) {
                  notification.error({
                    message: "Error",
                    description: `failed to get blocks: ${error}`,
                    duration: 5
                  });
                }
                let blkMetas =
                  data && data.getBlockMetas && data.getBlockMetas.blkMetas;
                if (Array.isArray(blkMetas)) {
                  // tslint:disable-next-line
                  blkMetas = blkMetas.sort((m1: any, m2: any) => {
                    return m2.height - m1.height;
                  });
                }

                return (
                  <SpinPreloader spinning={loading}>
                    <PageTitle>{t("block.blocks")}</PageTitle>
                    <Layout.Content
                      style={{ backgroundColor: "#fff" }}
                      tagName={"main"}
                    >
                      <Table
                        rowKey={"height"}
                        pagination={{
                          pageSize: PAGE_SIZE,
                          total: +latestHeight
                        }}
                        style={{ width: "100%" }}
                        scroll={{ x: true }}
                        columns={getColumns()}
                        dataSource={blkMetas}
                        onChange={pagination => {
                          fetchMore({
                            variables: {
                              byIndex: getBlockIndexRange(
                                latestHeight,
                                pagination.current
                              )
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
                    </Layout.Content>
                  </SpinPreloader>
                );
              }}
            </Query>
          );
        }}
      </Query>
    </ContentPadding>
  );
}
