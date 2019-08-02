// @ts-ignore
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
    <Query query={GET_BP_STATS} client={webBpApolloClient}>
      {({ data, loading, error }: QueryResult) => {
        const {
          bpCandidates = []
        }: {
          bpCandidates: Array<{
            productivity: number | null;
            productivityBase: number | null;
          }>;
        } = data || {};
        const productivityBase = bpCandidates
          .map(a => a.productivityBase || 0)
          .reduce((a, b) => a + b);
        const productivity = bpCandidates
          .map(a => a.productivity || 0)
          .reduce((a, b) => a + b);
        const percent =
          productivityBase > 0 ? (productivity * 100) / productivityBase : 0;
        const showLoading = loading || !!error;
        return (
          <StatsCard
            title={t("home.stats.productivity")}
            loading={showLoading}
            titleStyle={{
              backgroundImage: `url(${assetURL(
                "/icon_overview_Productivity.png"
              )})`
            }}
            value={`${Math.round(percent)}%`}
            prefix={
              <CompCirclePercentChart
                percent={percent}
                fillColor={colors.primary}
                size={46}
              />
            }
            suffix={null}
          />
        );
      }}
    </Query>
  );
};
