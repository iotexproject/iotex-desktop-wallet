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
import { GET_BLOCK_METAS } from "./queries";

function getColumns(): Array<ColumnProps<BlockMeta>> {
  return [
    {
      title: t("block.height"),
      dataIndex: "height"
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

export function Blocks(): JSX.Element {
  return (
    <ContentPadding>
      <Query
        query={GET_BLOCK_METAS}
        variables={{ byIndex: { start: 0, count: 100 } }}
      >
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

          const blkMetas =
            data && data.getBlockMetas && data.getBlockMetas.blkMetas;

          return (
            <SpinPreloader spinning={loading}>
              <h1>{t("block.blocks")}</h1>
              <Layout.Content
                style={{ backgroundColor: "#fff" }}
                tagName={"main"}
              >
                <Table
                  rowKey={"height"}
                  scroll={{ x: true }}
                  style={{ width: "100%" }}
                  columns={getColumns()}
                  dataSource={blkMetas}
                />
              </Layout.Content>
            </SpinPreloader>
          );
        }}
      </Query>
    </ContentPadding>
  );
}
