import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
import Spin from "antd/lib/spin";
import notification from "antd/lib/notification";
import gql from "graphql-tag";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { CSSProperties } from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";
import { GET_ANALYTICS_CHAIN } from "../../queries";
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

  const { active, ...mapButtonProps } = props;

  return (
    <div
      {...mapButtonProps}
      style={{
        ...Styles.mapButton,
        whiteSpace: "nowrap",
        ...props.style,
        ...activeStyle
      }}
    />
  );
};

export const MapCard = (): JSX.Element => {
  return (
    <Query
      query={GET_ANALYTICS_CHAIN}
      client={analyticsClient}
      pollInterval={10000}
    >
      {({ error, loading, data }: QueryResult) => {
        if (error) {
          notification.error({ message: `failed to get gas fee: ${error}` });
        }
        const showLoading = loading || !!error;
        const { mostRecentEpoch = 0 } = (data && data.chain) || {};
        return (
          <Spin
            spinning={showLoading}
            indicator={<Icon type="loading" spin={true} />}
          >
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
                        if (error) {
                          notification.error({
                            message: `failed to query analytics client: ${error}`
                          });
                        }
                        return null;
                      }

                      const mapdata = Object.keys(data).map((name, i) => ({
                        name: `Day ${i + 1}`,
                        value: data[name].numberOfActions.count
                      }));
                      return <CompAreaChart data={mapdata} />;
                    }}
                  </Query>
                )}
              </div>
            </Card>
          </Spin>
        );
      }}
    </Query>
  );
};
