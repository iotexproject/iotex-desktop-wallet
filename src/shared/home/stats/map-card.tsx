import { Card, Col, Row } from "antd";
import gql from "graphql-tag";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { CSSProperties, useState } from "react";
import { analyticsClient, webBpApolloClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_BP_STATS } from "../../queries";
import { CompAreaChart } from "../charts/area-chart";

const fontFamily = "'Heebo',sans-serif,Microsoft YaHei !important";
const Styles = {
  mapBox: {
    height: 390,
    backgroundImage: `url(${assetURL("/map_box_bg.png")})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: 6,
    color: colors.white,
    marginTop: 10
  },
  mapBoxBody: {
    width: "100%",
    height: "100%",
    padding: 0
  },
  mapContainer: {
    height: "calc(100% - 110px)",
    marginLeft: -20,
    paddingRight: 10,
    fontFamily
  },
  mapButton: {
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 2,
    border: `solid 1px ${colors.black80}`,
    padding: "5px 10px",
    margin: 5,
    color: colors.black60,
    textOverflow: "ellipsis",
    overflow: "hidden"
  }
};

export const MapButton = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    active?: boolean;
  }
): JSX.Element => {
  const activeStyle: CSSProperties = props.active
    ? {
        backgroundColor: colors.black90
      }
    : {};

  return (
    <div
      {...props}
      style={{
        ...Styles.mapButton,
        whiteSpace: "nowrap",
        ...props.style,
        ...activeStyle
      }}
    />
  );
};

export const getActionsData = async (): Promise<{
  mapdata: Array<{ name: string; value: number }>;
  currentEpochNumber: number;
  numberOfActions: number;
}> => {
  const {
    data: {
      stats: { currentEpochNumber }
    }
  } = await webBpApolloClient.query({
    query: GET_BP_STATS
  });

  const query = gql`{
    ${[1, 2, 3, 4, 5, 6, 7].map(day => {
      return `day${day}:chain{
        numberOfActions(pagination: { startEpoch: ${currentEpochNumber -
          day * 24}, epochCount: 24 }) {
          count
        }
      }
      `;
    })}
    chain {
      numberOfActions{
        count
      }
    }
  }
  `;
  const result: {
    data: {
      [index: string]: {
        numberOfActions: {
          count: number;
        };
      };
    };
  } = await analyticsClient.query({ query });
  const { chain, ...chains } = result.data;
  const numberOfActions = chain.numberOfActions.count;
  const mapdata = Object.keys(chains).map((name, i) => ({
    name: `Day ${i + 1}`,
    value: result.data[name].numberOfActions.count
  }));
  return {
    mapdata,
    currentEpochNumber,
    numberOfActions
  };
};

const EMPTY_MAP_DATA: Array<{ name: string; value: number }> = [];

export const MapCard = (): JSX.Element => {
  const [mapData, setMapData] = useState(EMPTY_MAP_DATA);
  const [epochNumber, setEpochNumber] = useState(0);
  getActionsData()
    .then(({ mapdata, currentEpochNumber }) => {
      if (currentEpochNumber !== epochNumber) {
        setMapData(mapdata);
        setEpochNumber(currentEpochNumber);
      }
    })
    .catch(error => {
      window.console.error(`failed to getActionsData: ${error}`);
    });
  return (
    <Card style={Styles.mapBox} bodyStyle={Styles.mapBoxBody}>
      <div style={{ padding: 10 }}>
        {/* <Row type="flex" justify="space-around">
          <Col span={12}>
            <MapButton>{t("home.stats.map")}</MapButton>
          </Col>
          <Col span={12}>
            <MapButton>{t("home.stats.energyConsumption")}</MapButton>
          </Col>
        </Row> */}
        <Row type="flex" justify="start">
          {/* <Col span={12}>
            <MapButton>{t("home.stats.numberOfAddresses")}</MapButton>
          </Col> */}
          <Col span={12}>
            <MapButton active={true}>
              {t("home.stats.numberOfTransactions")}
            </MapButton>
          </Col>
        </Row>
      </div>
      <div style={Styles.mapContainer}>
        {mapData.length && <CompAreaChart data={mapData} />}
      </div>
    </Card>
  );
};
