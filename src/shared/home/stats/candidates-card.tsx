// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { webBpApolloClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_BP_STATS } from "../../queries";
import { CompAreaChart } from "../charts/area-chart";
import { StatsCard } from "./stats-card";

export const CandidatesCard = (): JSX.Element => {
  return (
    <Query query={GET_BP_STATS} client={webBpApolloClient}>
      {({ data, loading, error }: QueryResult) => {
        const {
          bpCandidates = [],
          productivityBase = 0
        }: {
          bpCandidates: Array<{
            category: "CONSENSUS_DELEGATE" | "DELEGATE_CANDIDATE" | "DELEGATE";
            productivityBase: number;
          }>;
        } = data || {};
        const consensusDelegateCount = bpCandidates.filter(
          a => a.category === "CONSENSUS_DELEGATE" && a.productivityBase > 0
        ).length;
        const candidatesCount = bpCandidates.length;
        const showLoading = loading || !!error;
        const {
          totalCandidatesHistory = []
        }: { totalCandidatesHistory: Array<{ ts: string; count: number }> } =
          (data && data.stats) || {};
        const mapData = totalCandidatesHistory
          .slice(0, 7)
          .map(({ ts, count }) => ({
            name: ts,
            value: count
          }));
        return (
          <StatsCard
            title={t("home.stats.candidates")}
            titleStyle={{
              backgroundImage: `url(${assetURL(
                "/icon_overview_Delegates.png"
              )})`
            }}
            value={consensusDelegateCount}
            loading={showLoading}
            prefix={
              <div style={{ width: 46, height: 46 }}>
                <CompAreaChart
                  data={mapData}
                  tinyMode={true}
                  fillColor={colors.warning}
                />
              </div>
            }
            suffix={`${candidatesCount}`}
          />
        );
      }}
    </Query>
  );
};
