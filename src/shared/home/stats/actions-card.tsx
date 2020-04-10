// @ts-ignore
import notification from "antd/lib/notification";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { CompAreaChart } from "../charts/area-chart";
import StatsCard from "./stats-card";

const LAST_EPOTCH = 8434;
const LAST_EPOTCH_HOURS = 440689;
const DIFF_HOURS = Math.floor(Date.now() / 3600000) - LAST_EPOTCH_HOURS;

export const ActionsCard = (): JSX.Element => {
  return (
    <Query
      ssr={true}
      query={gql`
        {
          chainMeta {
            numActions
          }
        }
      `}
      pollInterval={10000}
    >
      {({ error, loading, data }: QueryResult) => {
        const showLoading = loading || !!error;
        if (error) {
          notification.error({
            message: `failed to query bp candidate in ActionsCard: ${error}`
          });
        }
        const numberOfActions =
          (data && data.chainMeta && data.chainMeta.numActions) || 0;
        const mostRecentEpoch = LAST_EPOTCH + DIFF_HOURS;
        return (
          <StatsCard
            loading={showLoading}
            title={t("home.stats.actions")}
            titleStyle={{
              backgroundImage: `url(${assetURL("/icon_overviw_TPS.png")})`
            }}
            value={numberOfActions}
            prefix={
              <div style={{ width: 46, height: 46 }}>
                <Query
                  client={analyticsClient}
                  ssr={true}
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
                    if (error) {
                      notification.error({
                        message: `failed to query in ActionsCard: ${error}`
                      });
                    }
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
              </div>
            }
            suffix={``}
          />
        );
      }}
    </Query>
  );
};
