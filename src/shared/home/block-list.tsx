import Card from "antd/lib/card";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { CSSProperties, useState } from "react";
import { Query, QueryResult } from "react-apollo";

import { Link } from "react-router-dom";
import { webBpApolloClient } from "../common/apollo-client";
import { assetURL } from "../common/asset-url";
import { translateFn } from "../common/from-now";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import {
  GET_BLOCK_METAS,
  GET_BP_CANDIDATE,
  GET_LATEST_HEIGHT
} from "../queries";

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

interface IBlockCardContentProps {
  index: number;
  block: IBlockMetaObject | undefined;
}

const BlockCardStyles: { [index: string]: CSSProperties } = {
  card: {
    marginTop: "0.5rem",
    background: "transparent",
    borderRadius: 5,
    backgroundSize: "cover",
    overflow: "hidden",
    border: 0
  },
  content: {
    padding: 10,
    fontSize: "12px",
    fontWeight: 300,
    lineHeight: 1.8,
    whiteSpace: "nowrap"
  },
  blockLink: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0
  }
};

// tslint:disable-next-line: max-func-body-length
export const BlockCard = (props: IBlockCardContentProps): JSX.Element => {
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
    <div style={{ padding: 5 }} className="block-card-wrap">
      <SpinPreloader spinning={!props.block}>
        <Card
          style={{
            ...BlockCardStyles.card,
            color: props.index ? colors.black : colors.white,
            backgroundImage: `url(${assetURL(
              props.index > 0 ? "/block_old.png" : "/block_new.png"
            )}`
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ opacity: props.block ? 1 : 0 }}>
            <Row
              type="flex"
              justify="start"
              align="middle"
              style={{ paddingTop: 10, height: 32, overflow: "hidden" }}
            >
              <Col
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: props.index ? colors.white : colors.primary,
                  marginRight: "0.5rem"
                }}
              />
              <Col style={{ ...anim }}>{`# ${height}`}</Col>
            </Row>

            <Link to={`/block/${height}`} style={BlockCardStyles.blockLink} />
            <div style={BlockCardStyles.content}>
              <Link
                to={`/address/${producerAddress}`}
                style={{ position: "relative" }}
              >
                <Query
                  query={GET_BP_CANDIDATE}
                  variables={{ ioOperatorAddress: producerAddress }}
                  client={webBpApolloClient}
                >
                  {({ loading, error, data }: QueryResult) => {
                    const address = producerAddress.substr(0, 8);
                    if (error) {
                      notification.error({
                        message: `failed to query bp candidate in block list: ${error}`
                      });
                    }
                    if (loading) {
                      return <span>{address}</span>;
                    }
                    if (!!error) {
                      return <span>{address}</span>;
                    }

                    const name =
                      (data.bpCandidate && data.bpCandidate.registeredName) ||
                      address;

                    return <span>{name}</span>;
                  }}
                </Query>
              </Link>
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
  // tslint:disable-next-line: prefer-array-literal
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

const BlockListStyles: { [index: string]: CSSProperties } = {
  root: {
    overflow: "hidden",
    width: "100%",
    paddingLeft: 10,
    paddingBottom: 30
  },
  content: {
    width: "calc(100% + 1000px)",
    paddingLeft: 1000,
    marginLeft: -1000,
    paddingBottom: 10,
    direction: "rtl"
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: colors.black80,
    borderRadius: 3,
    margin: 3
  },
  shadowCoverBottom: {
    pointerEvents: "none",
    height: 60,
    marginTop: -60,
    position: "relative",
    background:
      "linear-gradient(to bottom, rgba(240,242,245,0) 0%, rgba(240,242,245,1) 50%, rgba(240,242,245,1) 100%)"
  },
  showMoreButton: {
    textAlign: "center",
    position: "relative",
    marginTop: -20,
    backgroundColor: colors.background
  }
};

export const BlockList = (props: { height: string }): JSX.Element => {
  return (
    <div
      style={{
        height: props.height,
        ...BlockListStyles.root
      }}
    >
      <Row
        type="flex"
        justify="center"
        style={{ padding: 10, paddingBottom: 20 }}
        className="dots"
      >
        {[...Array(4)].map((_, i) => (
          <Col key={`dot-${i}`} style={BlockListStyles.dot} />
        ))}
      </Row>
      <div
        style={{
          height: parseInt(props.height, 10) - 50,
          ...BlockListStyles.content
        }}
        className="no-scrollbar"
      >
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
      <div style={BlockListStyles.shadowCoverBottom} />
      <div style={BlockListStyles.showMoreButton}>
        <Link style={{ color: colors.black95, fontWeight: 300 }} to="/block">
          {t("block.show_more")}
        </Link>
      </div>
    </div>
  );
};
