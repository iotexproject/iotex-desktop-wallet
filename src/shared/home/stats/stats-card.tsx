import { Card, Statistic } from "antd";
import React, { CSSProperties } from "react";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";

export interface IStatsCardProps {
  titleStyle: CSSProperties;
  title: string;
  value: number | string;
  prefix: JSX.Element | null;
  suffix: JSX.Element | string | null;
  style?: CSSProperties;
  valueStyle?: CSSProperties;
}

export const StatsCard = (props: IStatsCardProps): JSX.Element => {
  return (
    <Card
      style={{
        height: 190,
        backgroundImage: `url(${assetURL("/stat_box_bg.png")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 6,
        marginTop: 10,
        ...props.style
      }}
      bodyStyle={{ padding: 10 }}
    >
      <Statistic
        title={
          <span
            style={{
              padding: "5px 5px 5px 30px",
              color: colors.black60,
              backgroundSize: 20,
              backgroundPosition: "left",
              backgroundRepeat: "no-repeat",
              ...props.titleStyle
            }}
          >
            {props.title}
          </span>
        }
        valueStyle={{
          color: colors.black60,
          height: 120,
          display: "inline-flex",
          alignItems: "center",
          padding: "0 30px",
          ...props.valueStyle
        }}
        value={props.value}
        prefix={props.prefix}
        suffix={props.suffix}
        style={{
          color: colors.white
        }}
      />
    </Card>
  );
};
