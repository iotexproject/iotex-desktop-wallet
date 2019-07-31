// @ts-ignore
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_ANALYTICS_CHAIN } from "../../queries";
import { CompAreaChart } from "../charts/area-chart";
import { StatsCard } from "./stats-card";

export const ActionsCard = (): JSX.Element => {
  return (
    <Query query={GET_ANALYTICS_CHAIN} client={analyticsClient}>
      {({ error, loading, data }: QueryResult) => {
        const showLoading = loading || !!error;
        const { mostRecentEpoch = 0, numberOfActions = { count: 0 } } =
          (data && data.chain) || {};
        return (
          <StatsCard
            loading={showLoading}
            title={t("home.stats.actions")}
            titleStyle={{
              backgroundImage: `url(${assetURL("/icon_overviw_TPS.png")})`
            }}
            value={`${numberOfActions.count.toLocaleString()}`}
            prefix={
              <div style={{ width: 46, height: 46 }}>
                {mostRecentEpoch && (
                  <Query
                    client={analyticsClient}
                    query={gql`{
                    ${[1, 2, 3, 4, 5, 6, 7].map(day => {
                      return `day${day}:chain{
                        numberOfActions(pagination: { startEpoch: ${mostRecentEpoch -
                          day * 24}, epochCount: 24 }) {
                          count
                        }
                      }
                      `;
                    })}
                  }
                  `}
                  >
                    {({ data, error, loading }: QueryResult) => {
                      if (error || loading || !data) {
                        return null;
                      }
                      const mapdata = Object.keys(data).map((name, i) => ({
                        name: `Day ${i + 1}`,
                        value: data[name].numberOfActions.count
                      }));
                      return (
                        <CompAreaChart
                          data={mapdata}
                          tinyMode={true}
                          fillColor={colors.warning}
                        />
                      );
                    }}
                  </Query>
                )}
              </div>
            }
            suffix={``}
          />
        );
      }}
    </Query>
  );
};
