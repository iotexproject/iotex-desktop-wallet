import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { QueryResult } from "react-apollo";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { CompAreaChart } from "../charts/area-chart";
import StatsCard from "./stats-card";

export const VotesCard = (props: QueryResult): JSX.Element => {
  const { data, error, loading } = props;
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
};
