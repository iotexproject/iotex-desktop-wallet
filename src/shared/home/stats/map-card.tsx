import Card from "antd/lib/card";
import Statistic from "antd/lib/statistic";
import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
import Spin from "antd/lib/spin";
import gql from "graphql-tag";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { CSSProperties } from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../../common/apollo-client";
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
    overflow: "hidden"
  }
};

const LAST_EPOTCH = 8434;
const LAST_EPOTCH_HOURS = 440689;
const DIFF_HOURS = Math.floor(Date.now() / 3600000) - LAST_EPOTCH_HOURS;

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
  const mostRecentEpoch = LAST_EPOTCH + DIFF_HOURS;
  return (
    <Query
      ssr={true}
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
        if (error || !data) {
          if (error) {
            notification.error({
              message: `failed to query analytics client in MapCard: ${error}`
            });
          }
          return null;
        }
        const mapdata = Object.keys(data).map((name, i) => ({
          name: `Day ${i + 1}`,
          value: data[name].numberOfActions.count
        }));
        return (
          <Spin
            spinning={loading}
            indicator={<Icon type="loading" spin={true} />}
          >
            <Card style={Styles.mapBox} bodyStyle={Styles.mapBoxBody}>
              <div style={{ padding: 10 }}>
                <Row type="flex" justify="start">
                  <Col span={12}>
                    <MapButton active={true}>
                      {t("home.stats.numberOfTransactions")}
                    </MapButton>
                  </Col>
                </Row>
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
                  {({ error, data }: QueryResult) => {
                    if (error) {
                      notification.error({
                        message: `failed to query bp transaction in ActionsCard: ${error}`
                      });
                    }
                    const numberOfActions =
                      (data && data.chainMeta && data.chainMeta.numActions) ||
                      0;
                    return (
                      <Statistic
                        value={Math.floor(numberOfActions)}
                        valueStyle={{ color: colors.white }}
                      />
                    );
                  }}
                </Query>
              </div>
              <div style={Styles.mapContainer}>
                <CompAreaChart data={mapdata} />
              </div>
            </Card>
          </Spin>
        );
      }}
    </Query>
  );
};
