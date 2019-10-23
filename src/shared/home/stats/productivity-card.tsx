// @ts-ignore
import { Col, Row } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { webBpApolloClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_BP_STATS } from "../../queries";
import { CompCirclePercentChart } from "../charts/circle-chart";
import StatsCard from "./stats-card";

export const ProductivityCard = (): JSX.Element => {
  return (
    <Query query={GET_BP_STATS} client={webBpApolloClient} pollInterval={10000}>
      {({ data, loading, error }: QueryResult) => {
        const {
          bpCandidates = [],
          stats: { currentEpochNumber = 0 }
        }: {
          bpCandidates: Array<{
            productivity: number | null;
            productivityBase: number | null;
          }>;
          stats: { currentEpochNumber: number };
        } =
          data && data.stats && data.stats.currentEpochNumber
            ? data
            : {
                stats: {}
              };
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
          <Row type="flex" align="top" justify="space-between" gutter={10}>
            <Col span={12}>
              <StatsCard
                title={t("home.stats.progressEpoch")}
                loading={showLoading}
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
                loading={showLoading}
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
