// @ts-ignore
import notification from "antd/lib/notification";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_ANALYTICS_TPS } from "../../queries";
import { CompCirclePercentChart } from "../charts/circle-chart";
import StatsCard from "./stats-card";

const PEAK_TPS = 500; // Fixed number for now. Might be updated later.

export const TPSCard = (): JSX.Element => {
  return (
    <Query
      query={GET_ANALYTICS_TPS}
      client={analyticsClient}
      pollInterval={10000}
    >
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to query analytics tps in TPSCard: ${error}`
          });
        }
        const currentTps = data && data.chain ? data.chain.mostRecentTPS : 0;
        const percent = PEAK_TPS > 0 ? (currentTps / PEAK_TPS) * 100 : 100;
        const showLoading = loading || !!error;
        return (
          <StatsCard
            loading={showLoading}
            title={t("home.stats.tps")}
            titleStyle={{
              backgroundImage: `url(${assetURL("/icon_overviw_TPS.png")})`
            }}
            value={currentTps}
            prefix={
              <CompCirclePercentChart
                percent={percent}
                fillColor={colors.warning}
                size={46}
              />
            }
            suffix={`${PEAK_TPS}`}
          />
        );
      }}
    </Query>
  );
};
