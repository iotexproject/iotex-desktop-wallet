import { Card, Col, Row } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
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
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
};

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

export const MapButton = (props: any): JSX.Element => {
  return <div {...props} style={Styles.mapButton} />;
};

export const MapCard = (): JSX.Element => {
  return (
    <Card style={Styles.mapBox} bodyStyle={Styles.mapBoxBody}>
      <div style={{ padding: 10 }}>
        <Row type="flex" justify="space-around">
          <Col span={12}>
            <MapButton>{t("home.stats.map")}</MapButton>
          </Col>
          <Col span={12}>
            <MapButton>{t("home.stats.energyConsumption")}</MapButton>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={12}>
            <MapButton>{t("home.stats.numberOfAddresses")}</MapButton>
          </Col>
          <Col span={12}>
            <MapButton>{t("home.stats.numberOfTransactions")}</MapButton>
          </Col>
        </Row>
      </div>

      <div style={Styles.mapContainer}>
        <CompAreaChart data={MockMapData} />
      </div>
    </Card>
  );
};
