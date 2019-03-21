import { Layout, notification, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import {
  BlockMeta,
  GetBlockMetasResponse
} from "../api-gateway/resolvers/antenna-types";
import { SpinPreloader } from "./common/spin-preloader";
import { ContentPadding } from "./common/styles/style-padding";
import { GET_BLOCK_METAS, GET_LATEST_HEIGHT } from "./queries";

function getColumns(): Array<ColumnProps<BlockMeta>> {
  return [
    {
      title: t("block.height"),
      dataIndex: "height",
    },
    {
      title: t("block.timestamp"),
      dataIndex: "timestamp"
    },
    {
      title: t("block.num_actions"),
      dataIndex: "numActions"
    },
    {
      title: t("block.producer_address"),
      dataIndex: "producerAddress"
    },
    {
      title: t("block.transfer_amount"),
      dataIndex: "transferAmount"
    }
  ];
}

const PAGE_SIZE = 30;

function getBlockIndexRange(
  endHeight: number = 0
): { start: number; count: number } {
  const start = endHeight - PAGE_SIZE;
  return {
    start: start < 0 ? 0 : start,
    count: start < 0 ? PAGE_SIZE + start : PAGE_SIZE
  };
}

export function Blocks(): JSX.Element {
  return (
    <ContentPadding>
      <Query query={GET_LATEST_HEIGHT}>
        {({ data }: QueryResult<{ chainMeta: { height: number } }>) => {
          const latestHeight = data && data.chainMeta && data.chainMeta.height;
          const byIndex = getBlockIndexRange(latestHeight);

          return (
            <Query query={GET_BLOCK_METAS} variables={{ byIndex }}>
              {({
                loading,
                error,
                data
              }: QueryResult<{ getBlockMetas: GetBlockMetasResponse }>) => {
                if (error) {
                  notification.error({
                    message: "Error",
                    description: `failed to get actions: ${error}`,
                    duration: 5
                  });
                }

                let blkMetas =
                  data && data.getBlockMetas && data.getBlockMetas.blkMetas;
                if (Array.isArray(blkMetas)) {
                  // tslint:disable-next-line
                  blkMetas = blkMetas.sort((m1: any, m2: any) => {
                    return m1.height - m2.height;
                  });
                }

                return (
                  <SpinPreloader spinning={loading}>
                    <h1 className={"page-title"}>{t("block.blocks")}</h1>
                    <Layout.Content
                      style={{ backgroundColor: "#fff" }}
                      tagName={"main"}
                    >
                      <Table
                        rowKey={"height"}
                        scroll={{ x: true }}
                        pagination={{ pageSize: PAGE_SIZE }}
                        style={{ width: "100%" }}
                        columns={getColumns()}
                        dataSource={blkMetas}
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
