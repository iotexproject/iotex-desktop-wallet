import Card from "antd/lib/card";
import React, { Component, useState } from "react";
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

interface IBlockCardProps {
  loading: boolean;
  block: IBlockMeta | null;
  index: number;
}

interface IBlockCardState {
  block: IBlockMeta | null;
  index: number;
  loading: boolean;
  rotateY: number;
}

export class BlockCard extends Component<IBlockCardProps, IBlockCardState> {
  constructor(props: IBlockCardProps) {
    super(props);
    const { index, loading, block } = props;
    this.state = {
      index,
      loading,
      block,
      rotateY: 0
    };
  }

  public componentDidUpdate(prevprops: IBlockCardProps): void {
    const { loading, block, index } = this.props;
    if (loading || !block) {
      return;
    }
    if (prevprops.block && block.height === prevprops.block.height) {
      return;
    }
    if (this.state.block && block.height === this.state.block.height) {
      return;
    }
    this.setState({
      loading,
      block,
      index,
      rotateY: (this.state.rotateY + 180) % 360
    });
  }

  public render(): JSX.Element {
    const { index, loading, block, rotateY } = this.state;
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
          transform: `rotateY(${rotateY}deg)`,
          transition: `all ease-out 0.8s ${index * 0.1}s`,
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
            backgroundColor: "#FFF",
            marginBottom: 16,
            transform: `rotateY(${-rotateY}deg)`,
            transition: `all ease-out 0s ${index * 0.1 + 0.3}s`,
            transformOrigin: "center"
          }}
        >
          <h3>
            <FlexLink
              path={`/block/${blockdata.height}`}
              text={`#${blockdata.height}`}
            />
          </h3>
          <div style={{ textAlign: "center" }}>
            <div>
              <FlexLink
                path={`/address/${blockdata.producerAddress}`}
                text={`${blockdata.producerAddress || ""}`.substr(0, 8)}
              />
            </div>
            <div>{translateFn(blockdata.timestamp)}</div>
            <div>{blockdata.numActions} actions</div>
          </div>
        </div>
      </Card>
    );
  }
}

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
              const sortedBlocks = data.getBlockMetas.blkMetas.sort(
                (a, b) => b.height - a.height
              );
              setBlocks(sortedBlocks);
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
