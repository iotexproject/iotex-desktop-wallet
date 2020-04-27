// @ts-ignore
import notification from "antd/lib/notification";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { webBpApolloClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_BP_STATS } from "../../queries";
import { CompCirclePercentChart } from "../charts/circle-chart";
import StatsCard from "./stats-card";

const CIRCULATING_SUPPLY = 5400000000;

export const StakedVotesCard = (): JSX.Element => {
  return (
    <Query query={GET_BP_STATS} client={webBpApolloClient} pollInterval={10000}>
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to get bp stats in VodesCard: ${error}`
          });
        }
        const {
          totalVotedStakes = 0
        }: {
          totalVotedStakes: number;
        } = (data && data.stats) || {};

        const percent = Number(
          ((totalVotedStakes / CIRCULATING_SUPPLY) * 100).toFixed(2)
        );

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
