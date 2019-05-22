// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { CompCirclePercentChart } from "../charts/circle-chart";
import { StatsCard } from "./stats-card";

export interface ITPSCardProps {
  currentTps: number;
  peak: number;
}
export const TPSCard = (props: ITPSCardProps): JSX.Element => {
  const { currentTps, peak } = props;
  const percent = (currentTps * 100) / peak;
  return (
    <StatsCard
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
          style={{ marginRight: 30, marginTop: -10 }}
        />
      }
      suffix={` / ${peak}`}
    />
  );
};
