import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import React from "react";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin={true} />;

type Props = {
  children: JSX.Element | string | Array<JSX.Element>;
  spinning: boolean;
  wrapperClassName?: string;
};

export function SpinPreloader({
  children,
  spinning,
  wrapperClassName
}: Props): JSX.Element {
  return (
    <Spin
      spinning={spinning}
      indicator={antIcon}
      wrapperClassName={wrapperClassName}
    >
      {children}
    </Spin>
  );
}
