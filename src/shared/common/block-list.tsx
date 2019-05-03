import Card from "antd/lib/card";
import React, { useState } from "react";
import { Query, QueryResult } from "react-apollo";

import { IBlockMeta } from "iotex-antenna/lib/rpc-method/types";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { GetBlockMetasResponse } from "../../api-gateway/resolvers/antenna-types";
import { GET_BLOCK_METAS, GET_LATEST_HEIGHT } from "../queries";
import { FlexLink } from "./flex-link";
import { translateFn } from "./from-now";

const PAGE_SIZE = 30;
const POLL_INTERVAL = 10000; // 10s

const blockHolders: Array<IBlockMeta | null> = [];
blockHolders.length = PAGE_SIZE;
blockHolders.fill(null);

export const BlockCard = ({
  loading,
  block,
  index
}: {
  loading: boolean;
  block: IBlockMeta | null;
  index: number;
}) => {
  const blockdata = block || {
    height: 0,
    producerAddress: "none",
    timestamp: {
      nanos: 0,
      seconds: 0
    },
    numActions: 0
  };
  return (
    <Card
      loading={loading}
      bordered={true}
      style={{
        backgroundColor: "#FFF",
        marginBottom: 16,
        transform: `rotateY(${loading ? 0 : 180}deg)`,
        transition: `all ease-out 0.8s ${index * 0.08}s`,
        opacity: loading ? 0.5 : 1,
        perspective: 1000,
        transformStyle: "preserve-3d",
        transformOrigin: "center"
      }}
      bodyStyle={{
        padding: 10
      }}
      className="flip-card"
    >
      <div
        style={{
          transform: `rotateY(-180deg)`,
          opacity: loading ? 0 : 1
        }}
      >
        <h3>
          <FlexLink
            path={`/block/${blockdata.height}`}
            text={`#${blockdata.height}`}
          />
        </h3>
        <div>
          <FlexLink
            path={`/address/${blockdata.producerAddress}`}
            text={`${blockdata.producerAddress || ""}`.substr(0, 8)}
          />
        </div>
        <div>{translateFn(blockdata.timestamp)}</div>
        <div>{blockdata.numActions} actions</div>
      </div>
    </Card>
  );
};

export const BlockList = () => {
  const [latestHeight, setLatestHeight] = useState(0);
  const [blocks, setBlocks] = useState(blockHolders);
  const [isLoading, setLoading] = useState(true);

  return (
    <div style={{ padding: 16, backgroundColor: "#fff" }}>
      <h3 style={{ marginBottom: 16 }}>{t("home.blockList")}</h3>

      <Query query={GET_LATEST_HEIGHT} pollInterval={POLL_INTERVAL}>
        {({ data }: QueryResult<{ chainMeta: { height: number } }>) => {
          const height = (data && data.chainMeta && data.chainMeta.height) || 0;
          if (height !== latestHeight) {
            setLatestHeight(height);
          }
          return null;
        }}
      </Query>

      {latestHeight ? (
        <Query
          query={GET_BLOCK_METAS}
          variables={{
            byIndex: {
              start: Math.max(latestHeight - PAGE_SIZE, 0),
              count: PAGE_SIZE
            }
          }}
        >
          {({
            loading,
            error,
            data
          }: QueryResult<{ getBlockMetas: GetBlockMetasResponse }>) => {
            if (loading !== isLoading) {
              setLoading(loading);
            }
            if (!loading && !error && data) {
              setBlocks(data.getBlockMetas.blkMetas.reverse());
            }
            return null;
          }}
        </Query>
      ) : null}

      {blocks.map((block: IBlockMeta | null, index: number) => {
        return <BlockCard loading={isLoading} block={block} index={index} />;
      })}
    </div>
  );
};
