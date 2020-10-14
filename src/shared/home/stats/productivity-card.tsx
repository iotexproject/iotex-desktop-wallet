import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
import { get } from "dottie";
import { IChainMeta } from "iotex-antenna/lib/rpc-method/types";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_CHAIN_META } from "../../queries";
import { CompCirclePercentChart } from "../charts/circle-chart";
import StatsCard from "./stats-card";

export const ProductivityCard = (props: QueryResult): JSX.Element => {
  const { data, error, loading } = props;
  const {
    bpCandidates = []
  }: {
    bpCandidates: Array<{
      productivity: number | null;
      productivityBase: number | null;
    }>;
  } = data && data.stats ? data : {};
  const productivityBase = bpCandidates
    .map(a => a.productivityBase || 0)
    .reduce((a, b) => a + b, 0);
  const productivity = bpCandidates
    .map(a => a.productivity || 0)
    .reduce((a, b) => a + b, 0);
  const percent =
    productivityBase > 0 ? (productivity * 100) / productivityBase : 0;
  const showLoading = loading || !!error;

  return (
    <Query query={GET_CHAIN_META} ssr={false}>
      {(queryResult: QueryResult<IChainMeta>) => {
        const {
          loading: chainMetaLoading,
          error: errorMetaLoading,
          data: chainMetaData
        } = queryResult;
        if (errorMetaLoading && !chainMetaLoading) {
          notification.error({
            message: `failed to query chainMeta in Stats Area: ${errorMetaLoading}`
          });
        }
        const currentEpochNumber =
          get(chainMetaData || {}, "chainMeta.epoch.num", "-") || "-";
        return (
          <Row type="flex" align="top" justify="space-between" gutter={10}>
            <Col span={12}>
              <StatsCard
                title={t("home.stats.progressEpoch")}
                loading={showLoading || chainMetaLoading}
                titleStyle={{
                  backgroundImage: `url(${assetURL(
                    "/icon_overview_Productivity.png"
                  )})`
                }}
                value={Math.round(percent)}
                unit="%"
                prefix={
                  <CompCirclePercentChart
                    percent={percent}
                    fillColor={colors.primary}
                    size={46}
                  />
                }
                suffix={null}
              />
            </Col>
            <Col span={12}>
              <StatsCard
                title={t("home.stats.currentEpoch")}
                loading={showLoading || chainMetaLoading}
                titleStyle={{
                  backgroundImage: `url(${assetURL(
                    "/icon_overview_Productivity.png"
                  )})`
                }}
                value={currentEpochNumber}
                prefix={null}
                suffix={null}
              />
            </Col>
          </Row>
        );
      }}
    </Query>
  );
};
