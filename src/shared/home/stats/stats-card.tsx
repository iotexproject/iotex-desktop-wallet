import Card from "antd/lib/card";
import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import Statistic from "antd/lib/statistic";

import React, { CSSProperties, useState } from "react";
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
  unit?: string;
}

const StatsCard: React.FC<IStatsCardProps> = ({
  loading = false,
  style = {},
  titleStyle = {},
  title,
  valueStyle,
  prefix,
  suffix,
  unit = "",
  value
}) => {
  const [animValue, setAnimValue] = useState(0);
  const targetValue = Number(value) || 0;
  if (targetValue !== animValue) {
    setTimeout(() => {
      setAnimValue(
        Math.min(
          targetValue,
          Math.ceil(
            animValue +
              Math.max((targetValue - animValue) / 10, targetValue / 100)
          )
        )
      );
    }, 30);
  }
  return (
    <Spin spinning={loading} indicator={<Icon type="loading" spin={true} />}>
      <Card
        style={{
          height: 190,
          backgroundImage: `url(${assetURL("/stat_box_bg.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 6,
          marginTop: 10,
          ...style
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
                ...titleStyle
              }}
            >
              {title}
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
            fontSize: 32,
            ...valueStyle
          }}
          prefix={<div style={{ marginRight: 20 }}>{prefix}</div>}
          style={{
            color: colors.white
          }}
          valueRender={() => (
            <span>
              {`${animValue.toLocaleString()}${unit}`}
              {suffix && (
                <>
                  {" / "}
                  <small>{suffix}</small>
                </>
              )}
            </span>
          )}
        />
      </Card>
    </Spin>
  );
};

export default StatsCard;
