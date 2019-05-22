// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { CompAreaChart } from "../charts/area-chart";
import { StatsCard } from "./stats-card";

const MockMapData = [
  {
    name: "1 Day",
    value: 500
  },
  {
    name: "2 Day",
    value: 1300
  },
  {
    name: "3 Day",
    value: 700
  },
  {
    name: "4 Day",
    value: 900
  },
  {
    name: "5 Day",
    value: 600
  },
  {
    name: "6 Day",
    value: 1200
  },
  {
    name: "7 Day",
    value: 800
  }
];

export interface IVotesCardProps {
  value: number;
}
export const VotesCard = (props: IVotesCardProps): JSX.Element => {
  return (
    <StatsCard
      title={t("home.stats.votes")}
      titleStyle={{
        backgroundImage: `url(${assetURL("/icon_overview_Delegates.png")})`
      }}
      value={props.value}
      prefix={
        <div style={{ width: 46, height: 46, marginRight: 30, marginTop: -10 }}>
          <CompAreaChart
            data={MockMapData}
            tinyMode={true}
            fillColor={colors.primary}
          />
        </div>
      }
      suffix={null}
    />
  );
};
