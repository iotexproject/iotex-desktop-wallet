import { Card, Col, Row } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";
import { Query, QueryResult } from "react-apollo";

import { Link } from "react-router-dom";
import { assetURL } from "../common/asset-url";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { GET_BLOCK_METAS, GET_LATEST_HEIGHT } from "../queries";

const BLOCK_COUNT = 10;

const SLIDE_ANIMS = [
  { transition: "transform 0s ease-out", transform: `translateY(0)` },
  { transition: "transform 0.45s ease-out", transform: `translateY(140%)` },
  { transition: "transform 0s ease-out", transform: `translateY(-140%)` },
  { transition: "transform 0.45s ease-in", transform: `translateY(0)` }
];

export interface IBlockMetaObject {
  height: number;
  producerAddress: string;
  numActions: number;
  timestamp: { seconds: number; nanos: number };
}

interface IBlockCardState {
  block: IBlockMetaObject | undefined;
  step: number;
}

export const BlockCard = (props: {
  index: number;
  block: IBlockMetaObject | undefined;
}): JSX.Element => {
  const [state, setState] = useState<IBlockCardState>({
    block: undefined,
    step: 0
  });
  const {
    height = 0,
    producerAddress = "-",
    numActions = 0,
    timestamp = { seconds: Date.now() / 1000, nanos: 0 }
  } = state.block || {};
  const anim = SLIDE_ANIMS[state.step || 0];
  const setStateAt = (t: number, s: IBlockCardState) =>
    setTimeout(() => setState(s), t);

  if (state.step === 0 && props.block && props.block.height !== height) {
    if (props.index !== 0 || !state.block) {
      setState({ block: props.block, step: 0 });
    } else {
      setStateAt(100, { block: state.block, step: 1 });
      setStateAt(650, { block: state.block, step: 2 });
      setStateAt(750, { block: props.block, step: 3 });
      setStateAt(1250, { block: props.block, step: 0 });
    }
  }

  return (
    <div style={{ padding: 5 }}>
      <SpinPreloader spinning={!props.block}>
        <Card
          style={{
            marginTop: "0.5rem",
            background: "transparent",
            color: props.index ? colors.black : colors.white,
            borderRadius: 5,
            backgroundSize: "cover",
            backgroundImage: `url(${assetURL(
              props.index > 0 ? "/block_old.png" : "/block_new.png"
            )}`,
            overflow: "hidden"
          }}
          bodyStyle={{
            padding: "1rem 0"
          }}
        >
          <div
            style={{
              opacity: props.block ? 1 : 0,
              ...anim
            }}
          >
            <Row type="flex" justify="start" align="middle">
              <Col
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: props.index ? colors.white : colors.primary,
                  marginRight: "0.5rem"
                }}
              />
              <Col>{`# ${height}`}</Col>
            </Row>
            <div
              style={{
                padding: "0 1rem",
                fontSize: "12px",
                fontWeight: 300,
                marginTop: "0.5rem",
                lineHeight: 1.8,
                whiteSpace: "nowrap"
              }}
            >
              <FlexLink
                path={`/address/${producerAddress}`}
                text={`${producerAddress}`.substr(0, 8)}
              />
              <div>{`${translateFn(timestamp)}`}</div>
              <Row type="flex" justify="space-between">
                <Col>{`${numActions}`}</Col>
                <Col>{t("home.blocklist.ofActions")}</Col>
              </Row>
            </div>
          </div>
        </Card>
      </SpinPreloader>
    </div>
  );
};

export const BlockListPlaceHolder = (props: { count: number }) => {
  const blocks = [...Array(props.count)];
  return (
    <>
      {blocks.map((block, index) => (
        <BlockCard key={`block-${index}`} index={index} block={block} />
      ))}
    </>
  );
};

export const BlockListByIndex = (props: {
  start: number;
  count: number;
}): JSX.Element => {
  const { start, count } = props;
  return (
    <Query
      query={GET_BLOCK_METAS}
      notifyOnNetworkStatusChange={false}
      variables={{
        byIndex: {
          count,
          start
        }
      }}
      fetchPolicy="network-only"
      ssr={false}
    >
      {({
        error,
        data
      }: QueryResult<{
        getBlockMetas: {
          blkMetas: [IBlockMetaObject];
        };
      }>): JSX.Element | null => {
        if (
          error ||
          !data ||
          !data.getBlockMetas ||
          !data.getBlockMetas.blkMetas ||
          !data.getBlockMetas.blkMetas.length
        ) {
          return <BlockListPlaceHolder count={count} />;
        }
        const blocks = data.getBlockMetas.blkMetas.sort(
          (a, b) => b.height - a.height
        );
        return (
          <>
            {blocks.map((block, index) => (
              <BlockCard key={`block-${index}`} index={index} block={block} />
            ))}
          </>
        );
      }}
    </Query>
  );
};

export const BlockList = (props: { height: string }): JSX.Element => {
  return (
    <div
      style={{
        height: props.height,
        overflow: "hidden",
        width: "100%",
        paddingLeft: 5,
        paddingBottom: 30
      }}
    >
      <div
        style={{
          height: props.height,
          width: "calc(100% + 1000px)",
          paddingLeft: 1000,
          marginLeft: -1000,
          paddingBottom: 10,
          direction: "rtl"
        }}
        className="no-scrollbar"
      >
        <Row type="flex" justify="center">
          {[...Array(4)].map((_, i) => (
            <Col
              key={`dot-${i}`}
              style={{
                width: 6,
                height: 6,
                backgroundColor: colors.black80,
                borderRadius: 3,
                margin: "0 6px 2.5rem 0"
              }}
            />
          ))}
        </Row>
        <div style={{ direction: "ltr" }}>
          <Query
            query={GET_LATEST_HEIGHT}
            pollInterval={10000}
            fetchPolicy="network-only"
            ssr={false}
          >
            {({
              error,
              loading,
              data
            }: QueryResult<{
              chainMeta: { height: string };
            }>): JSX.Element | null => {
              if (
                error ||
                loading ||
                !data ||
                !data.chainMeta ||
                !data.chainMeta.height
              ) {
                return <BlockListPlaceHolder count={BLOCK_COUNT} />;
              }
              const height = parseInt(`${data.chainMeta.height}`, 10);
              const start = Math.max(1, height - BLOCK_COUNT);
              return <BlockListByIndex count={BLOCK_COUNT} start={start} />;
            }}
          </Query>
        </div>
        <div style={{ paddingBottom: 30 }} />
      </div>
      <div
        style={{
          pointerEvents: "none",
          height: 60,
          marginTop: -60,
          position: "relative",
          background:
            "linear-gradient(to bottom, rgba(240,242,245,0) 0%, rgba(240,242,245,1) 50%, rgba(240,242,245,1) 100%)"
        }}
      />
      <div
        style={{
          textAlign: "center",
          position: "relative",
          marginTop: -20,
          backgroundColor: colors.background
        }}
      >
        <Link style={{ color: colors.black95, fontWeight: 300 }} to="/block">
          {t("block.show_more")}
        </Link>
      </div>
    </div>
  );
};
