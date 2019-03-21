import { Icon, Spin } from "antd";
import React from "react";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

type Props = {
  children: JSX.Element | string | Array<JSX.Element>;
  spinning: boolean;
};

export function SpinPreloader({ children, spinning }: Props): JSX.Element {
  return (
    <Spin spinning={spinning} indicator={antIcon}>
      {children}
    </Spin>
  );
}
