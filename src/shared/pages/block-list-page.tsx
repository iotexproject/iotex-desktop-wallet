import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React, {useEffect, useRef, useState} from "react";
import {Query, QueryResult} from "react-apollo";
import {CSVLink} from "react-csv";
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
import { numberWithCommas } from "../common/vertical-table";
import {GET_BLOCK_METAS, GET_LATEST_HEIGHT} from "../queries";
import { Page } from "./page";

const PAGE_SIZE = 15;

const getBlockListColumns = (): Array<ColumnProps<BlockMeta>> => [
  {
    title: t("block.height"),
    dataIndex: "height",
    width: "10vw",
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
    width: "15vw",
    render(_: string, record: BlockMeta, __: number): JSX.Element {
      return <span>{translateFn(record.timestamp)}</span>;
    }
  },
  {
    title: t("block.num_actions"),
    dataIndex: "numActions",
    width: "10vw"
  },
  {
    title: t("block.producer_address"),
    dataIndex: "producerAddress",
    width: "20vw",
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
    width: "20vw",
    render(text: string, _: BlockMeta, __: number): string {
      return `${numberWithCommas(fromRau(text || "0", "IOTX"))} IOTX`;
    }
  }
];

const getBlockMetasData = (fetchBlockMetas: (blockMetas: Array<BlockMeta>) => void): JSX.Element => {
  return (
    <Query query={GET_LATEST_HEIGHT}>
      {({ data, error }: QueryResult<{ chainMeta: { height: number } }>) => {
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
                get<Array<BlockMeta>>(data || {}, "getBlockMetas.blkMetas") ||
                [];
              if (blkMetas && Array.isArray(blkMetas)) {
                // reorder
                blkMetas = blkMetas.sort((a, b) => b.height - a.height);
              }

              fetchBlockMetas(blkMetas);

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
                  size="middle"
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
  );
};

interface ICSVData {
  height: string
  timestamp: string
  numActions: string
  producerAddress: string
  transferAmount: string
}

const ExportAction: React.FC<{
  blockMetas: Array<BlockMeta> | undefined
}> = ({ blockMetas}) => {

  const csvInstance = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
  const [csvData, setCsvData] = useState<Array<ICSVData>>([]);

  useEffect(() => {
    if (csvData.length > 0) {
      setTimeout(() => {
        csvInstance.current?.link.click()
      }, 1000)
    }
  }, [csvData]);

  const handleExport = async () => {

    const data = blockMetas?.map(meta => {
      return {
        height: `${meta.height}`,
        timestamp: translateFn(meta.timestamp),
        numActions: `${meta.numActions}`,
        producerAddress: meta.producerAddress,
        transferAmount: `${numberWithCommas(fromRau(meta.transferAmount || "0", "IOTX"))} IOTX`,
      }
    });

    if (data) {
      setCsvData(data)
    }
  };

  const headers = [
    { label: `${t("block.height")}`, key: "height" },
    { label: `${t("block.timestamp")}`, key: "timestamp" },
    { label: `${t("block.num_actions")}`, key: "numActions" },
    { label: `${t("block.producer_address")}`, key: "producerAddress" },
    { label: `${t("block.transfer_amount")}`, key: "transferAmount" }
  ];

  return <div style={{display: "flex", alignItems: "center"}}>
    {t("block.blocks")}
    <Button
      size="small"
      type="primary"
      style={{marginLeft: 10}}
      onClick={handleExport}>{t("action.export")}</Button>
    <CSVLink
      data={csvData}
      headers={headers}
      filename={t("topbar.blocks")}
      ref={csvInstance}/>
  </div>
};

const BlockListPage: React.FC = (): JSX.Element => {

  const [blockMetas, setBlockMetas] = useState<Array<BlockMeta>>();

  const fetchBlockMetas = (blockMetas: Array<BlockMeta>) => {
    setBlockMetas(blockMetas)
  };

  return (
    <>
      <Helmet title={`${t("block.blocks")} - ${t("meta.description")}`} />
      <PageNav items={[t("topbar.blocks")]} />
      <ContentPadding>
        <Page header={<ExportAction blockMetas={blockMetas}/>}>{getBlockMetasData(fetchBlockMetas)}</Page>
      </ContentPadding>
    </>
  );
};

export { BlockListPage };
