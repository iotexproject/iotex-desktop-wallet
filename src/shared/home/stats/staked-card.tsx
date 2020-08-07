// @ts-ignore
import notification from "antd/lib/notification";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_ANALYTICS_BP_STATS } from "../../queries";
import { CompCirclePercentChart } from "../charts/circle-chart";
import StatsCard from "./stats-card";

export const StakedVotesCard = (props: QueryResult): JSX.Element => {
  const { data } = props;
  const {
    totalVotedStakes = 0
  }: {
    totalVotedStakes: number;
  } = (data && data.stats) || {};

  return (
    <Query query={GET_ANALYTICS_BP_STATS} ssr={false} client={analyticsClient}>
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to get bp stats in VodesCard: ${error}`
          });
        }
        const {
          totalCirculatingSupply = "0"
        }: {
          totalCirculatingSupply: string;
        } = (data && data.chain) || {};

        const totalCirculatingSupplyIOTX = fromRau(
          totalCirculatingSupply,
          "iotx"
        );
        const totalCirculatingSupplyIOTXNumber = Number(
          totalCirculatingSupplyIOTX
        );
        const percent =
          totalCirculatingSupplyIOTXNumber > 0
            ? Number(
                (
                  (totalVotedStakes / totalCirculatingSupplyIOTXNumber) *
                  100
                ).toFixed(2)
              )
            : 0;

        const showLoading = loading || !!error;
        return (
          <StatsCard
            title={t("home.stats.stakedVotes")}
            loading={showLoading}
            titleStyle={{
              backgroundImage: `url(${assetURL(
                "/icon_overview_Delegates.png"
              )})`
            }}
            value={percent}
            unit="%"
            prefix={
              <div style={{ width: 46, height: 46 }}>
                <CompCirclePercentChart
                  percent={percent}
                  fillColor={colors.primary}
                  size={46}
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
