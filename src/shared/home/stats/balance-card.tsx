// @ts-ignore
import notification from "antd/lib/notification";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import StatsCard from "./stats-card";
import { CompAreaChart } from "../charts/area-chart";

export const BalanceCard = (): JSX.Element => {
  return (
    <Query
      query={gql`
        query {
          account {
            totalAccountSupply
          }
        }
      `}
      ssr={true}
      client={analyticsClient}
      pollInterval={10000}
    >
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to get bp stats in Total Circulation Token: ${error}`
          });
        }
        const {
          totalAccountSupply = 0
        }: {
          totalAccountSupply: number;
          totalVotesHistory: Array<{ ts: string; count: number }>;
        } = (data && data.account) || {};

        const showLoading = loading || !!error;
        const mapData = Object.keys(data).map((name, i) => ({
          name: `Day ${i + 1}`,
          value: data[name].totalAccountSupply.count
        }));
        return (
          <StatsCard
            title={t("home.stats.balanceCard")}
            loading={showLoading}
            titleStyle={{
              backgroundImage: `url(${assetURL(
                "/icon_overview_Delegates.png"
              )})`
            }}
            value={Math.round(totalAccountSupply)}
            prefix={
              <div style={{ width: 46, height: 46 }}>
                <CompAreaChart
                  data={mapData}
                  tinyMode={true}
                  fillColor={colors.warning}
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
