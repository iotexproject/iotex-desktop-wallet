import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import Table, { ColumnProps } from "antd/lib/table";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import {
  BlockMeta,
  GetBlockMetasResponse
} from "../../api-gateway/resolvers/antenna-types";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { Navigation } from "../common/navigation";
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
        return (
          <FlexLink path={`/block/${record.height}`} text={record.height} />
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
      render(_: string, record: BlockMeta, __: number): JSX.Element {
        return (
          <FlexLink
            path={`/address/${record.producerAddress}`}
            text={record.producerAddress}
          />
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
      <Helmet title={`${t("block.blocks")} - ${t("meta.description")}`} />
      <Navigation />
      <Query query={GET_LATEST_HEIGHT}>
        {({ data }: QueryResult<{ chainMeta: { height: number } }>) => {
          const latestHeight =
            (data && data.chainMeta && data.chainMeta.height) || 0;
          const byIndex = getBlockIndexRange(latestHeight);

          return (
            <Query query={GET_BLOCK_METAS} variables={{ byIndex }}>
              {({
                loading,
                data,
                fetchMore
              }: QueryResult<{ getBlockMetas: GetBlockMetasResponse }>) => {
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
                    <PageTitle>
                      <Icon type="block" /> {t("block.blocks")}
                    </PageTitle>
                    <Layout.Content
                      style={{ backgroundColor: "#fff" }}
                      tagName={"main"}
                    >
                      <Table
                        rowKey={"height"}
                        pagination={{
                          pageSize: PAGE_SIZE,
                          total: +(latestHeight || 0)
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
