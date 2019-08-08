import React, { CSSProperties } from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { colors } from "../../common/styles/style-color";

export interface ICompCircleChartProps {
  percent: number;
  fillColor?: string;
  size?: number;
  style?: CSSProperties;
}
let globalFillID = 0;
export const CompCirclePercentChart = (props: ICompCircleChartProps) => {
  const fillID = `CompCircleChart${globalFillID++}`;
  const fillBgID = `CompCircleChartBG${globalFillID++}`;
  const { fillColor = colors.primary, size = 100, percent } = props;
  const startAngle = 90;
  const endAngle = -percent * 3.6 + 90;
  const innerRadius = size * 0.3;
  const outerRadius = size * 0.46;
  return (
    <div style={{ width: size, height: size, ...props.style }}>
      <ResponsiveContainer>
        <PieChart>
          <defs>
            <linearGradient id={fillID} x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor={fillColor} stopOpacity={1} />
              <stop offset={1} stopColor={fillColor} stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id={fillBgID} x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor={fillColor} stopOpacity={0.2} />
              <stop offset={1} stopColor={fillColor} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Pie
            data={[{ value: 100 }]}
            dataKey="value"
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill={`url(#${fillID})`}
            startAngle={startAngle}
            stroke={0}
          />
          <Pie
            data={[{ value: 100 }]}
            dataKey="value"
            innerRadius={innerRadius * 1.08}
            outerRadius={outerRadius * 0.92}
            fill={`url(#${fillBgID})`}
            stroke={0}
            startAngle={startAngle}
            endAngle={endAngle + 360}
            animationDuration={1}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
