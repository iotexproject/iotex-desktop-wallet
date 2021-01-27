import notification from "antd/lib/notification";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { Dict } from "../../common/types";
import { GET_ANALYTICS_BP_STATS } from "../../queries";
import { CompAreaChart } from "../charts/area-chart";
import StatsCard from "./stats-card";

export const VotesCard = (props: QueryResult): JSX.Element => {
  const { data, error, loading } = props;
  const {
    totalVotesHistory = []
  }: {
    totalVotesHistory: Array<{ ts: string; count: number }>;
  } = (data && data.stats) || {};

  const showLoading = loading || !!error;

  const mapData = totalVotesHistory.slice(0, 7).map(({ ts, count }) => ({
    name: ts,
    value: count
  }));
  return (
    <Query query={GET_ANALYTICS_BP_STATS} ssr={false} client={analyticsClient}>
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to get bp stats in VodesCard: ${error}`
          });
        }
        const {
          votingResultMeta
        }: {
          votingResultMeta: Dict;
        } = (data && data.chain) || {};

        const { totalWeightedVotes = 0 } = votingResultMeta || {};
        const totalVotes = Number(fromRau(totalWeightedVotes, "iotx"));
        const cShowLoading = showLoading || loading || !!error;
        return (
          <StatsCard
            title={t("home.stats.votes")}
            loading={cShowLoading}
            titleStyle={{
              backgroundImage: `url(${assetURL("icon_overview_Delegates.png")})`
            }}
            value={Math.round(totalVotes)}
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
