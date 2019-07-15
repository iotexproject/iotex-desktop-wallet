import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { colors } from "../../common/styles/style-color";

export interface IAreaChartProps {
  data: Array<{ name: string; value: number }>;
  fillColor?: string;
  tinyMode?: boolean;
}

export const CompMapChartTooltip = (props: {
  payload?: Array<{ value: string }>;
  active?: boolean;
}): JSX.Element | null => {
  const { active, payload } = props;
  if (active) {
    return (
      <div className="custom-tooltip">
        <p>{payload && payload[0].value}</p>
      </div>
    );
  }
  return null;
};

let globalFillID = 0;
export const CompAreaChart = (props: IAreaChartProps) => {
  const { data, fillColor = colors.primary, tinyMode = false } = props;
  const fillID = `CompAreaChart${globalFillID++}`;
  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        {!tinyMode && (
          <CartesianGrid
            strokeWidth="1px"
            strokeDasharray="1 5"
            stroke={colors.black80}
          />
        )}
        {!tinyMode && <XAxis dataKey="name" />}
        {!tinyMode && <YAxis />}
        {!tinyMode && <Tooltip content={<CompMapChartTooltip />} />}

        <defs>
          <linearGradient id={fillID} x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor={fillColor} stopOpacity={1} />
            <stop offset={0.5} stopColor={fillColor} stopOpacity={0.2} />
            <stop offset={1} stopColor={fillColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="monotone"
          stroke={fillColor}
          strokeWidth="3px"
          fill={`url(#${fillID})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
