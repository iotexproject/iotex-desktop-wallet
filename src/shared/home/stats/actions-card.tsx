// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { CompAreaChart } from "../charts/area-chart";
import { getActionsData } from "./map-card";
import { StatsCard } from "./stats-card";

const EMPTY_MAP_DATA: Array<{ name: string; value: number }> = [];

export const ActionsCard = (): JSX.Element => {
  const [mapData, setMapData] = useState(EMPTY_MAP_DATA);
  const [epochNumber, setEpochNumber] = useState(0);
  const [actions, setActions] = useState(0);
  getActionsData()
    .then(({ mapdata, currentEpochNumber, numberOfActions }) => {
      if (currentEpochNumber !== epochNumber) {
        setMapData(mapdata);
        setEpochNumber(currentEpochNumber);
        setActions(numberOfActions);
      }
    })
    .catch(error => {
      window.console.error(`failed to getActionsData: ${error}`);
    });
  return (
    <StatsCard
      loading={!epochNumber}
      title={t("home.stats.actions")}
      titleStyle={{
        backgroundImage: `url(${assetURL("/icon_overviw_TPS.png")})`
      }}
      value={`${actions.toLocaleString()}`}
      prefix={
        <div style={{ width: 46, height: 46 }}>
          <CompAreaChart
            data={mapData}
            tinyMode={true}
            fillColor={colors.warning}
          />
        </div>
      }
      suffix={``}
    />
  );
};
