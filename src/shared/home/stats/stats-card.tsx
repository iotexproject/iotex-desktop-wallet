import { Card, Icon, Spin, Statistic } from "antd";
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
  loading?: boolean;
}

export const StatsCard = (props: IStatsCardProps): JSX.Element => {
  const { loading = false } = props;
  return (
    <Spin spinning={loading} indicator={<Icon type="loading" spin />}>
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
            minHeight: 120,
            display: "flex",
            flexFlow: "wrap",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: 10,
            fontSize: 42,
            ...props.valueStyle
          }}
          prefix={props.prefix}
          style={{
            color: colors.white
          }}
          valueRender={() => {
            return (
              <span style={{ paddingLeft: 20 }}>
                {props.value} {props.suffix ? " / " : ""}{" "}
                <small>{props.suffix}</small>
              </span>
            );
          }}
        />
      </Card>
    </Spin>
  );
};
