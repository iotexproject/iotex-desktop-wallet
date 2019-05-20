import { Card, Col, Row } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";

import { assetURL } from "../common/asset-url";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { colors } from "../common/styles/style-color";
import { GET_BLOCK_METAS, GET_LATEST_HEIGHT } from "../queries";

const BLOCK_COUNT = 10;

export interface IBlockMetaObject {
  height: number;
  producerAddress: string;
  numActions: number;
  timestamp: { seconds: number; nanos: number };
}

export const BlockCard = (props: {
  index: number;
  block: IBlockMetaObject | undefined;
}): JSX.Element => {
  const {
    height = 0,
    producerAddress = "",
    numActions = 0,
    timestamp = { seconds: 0, nanos: 0 }
  } = props.block || {};
  return (
    <Card
      loading={!props.block}
      style={{
        marginTop: "0.5rem",
        width: "100%",
        backgroundImage: `url(${assetURL(
          props.index > 0 ? "/block_old.png" : "/block_new.png"
        )}`,
        backgroundSize: "cover",
        color: props.index ? colors.black : colors.white,
        borderRadius: 8
      }}
      bodyStyle={{
        padding: "1rem 0"
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
    </Card>
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
      variables={{
        byIndex: {
          count,
          start
        }
      }}
    >
      {({
        error,
        loading,
        data
      }: QueryResult<{
        getBlockMetas: {
          blkMetas: [IBlockMetaObject];
        };
      }>): JSX.Element | null => {
        if (
          error ||
          loading ||
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

export const BlockList = (): JSX.Element => {
  return (
    <div style={{ marginLeft: "1rem" }}>
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
      <Query query={GET_LATEST_HEIGHT}>
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
  );
};
