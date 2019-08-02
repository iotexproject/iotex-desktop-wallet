// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { webBpApolloClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_BP_STATS } from "../../queries";
import { CompAreaChart } from "../charts/area-chart";
import StatsCard from "./stats-card";

export const VotesCard = (): JSX.Element => {
  return (
    <Query query={GET_BP_STATS} client={webBpApolloClient}>
      {({ data, loading, error }: QueryResult) => {
        const {
          totalVotes = 0,
          totalVotesHistory = []
        }: {
          totalVotes: number;
          totalVotesHistory: Array<{ ts: string; count: number }>;
        } = (data && data.stats) || {};

        const showLoading = loading || !!error;

        const mapData = totalVotesHistory.slice(0, 7).map(({ ts, count }) => ({
          name: ts,
          value: count
        }));
        return (
          <StatsCard
            title={t("home.stats.votes")}
            loading={showLoading}
            titleStyle={{
              backgroundImage: `url(${assetURL(
                "/icon_overview_Delegates.png"
              )})`
            }}
            value={Number(Math.round(totalVotes)).toLocaleString()}
            valueStyle={{
              fontSize: "4vmin"
            }}
            prefix={
              <div style={{ width: 46, height: 46 }}>
                <CompAreaChart
                  data={mapData}
                  tinyMode={true}
                  fillColor={colors.primary}
                />
              </div>
            }
            suffix={null}
          />
        );
      }}
    </Query>
  );
};
