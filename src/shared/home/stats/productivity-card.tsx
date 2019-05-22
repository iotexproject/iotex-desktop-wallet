// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { CompCirclePercentChart } from "../charts/circle-chart";
import { StatsCard } from "./stats-card";

export interface IProductivityCardProps {
  value: number;
}
export const ProductivityCard = (
  props: IProductivityCardProps
): JSX.Element => {
  return (
    <StatsCard
      title={t("home.stats.productivity")}
      titleStyle={{
        backgroundImage: `url(${assetURL("/icon_overview_Productivity.png")})`
      }}
      value={`${props.value}%`}
      prefix={
        <CompCirclePercentChart
          percent={props.value}
          fillColor={colors.primary}
          size={46}
          style={{ marginRight: 30, marginTop: -10 }}
        />
      }
      suffix={null}
    />
  );
};
