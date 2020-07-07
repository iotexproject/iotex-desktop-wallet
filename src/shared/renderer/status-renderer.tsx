import Icon from "antd/lib/icon";
import React from "react";
import { colors } from "../common/styles/style-color";
import { VerticalTableRender } from "../common/vertical-table";

const StatusRenderer: VerticalTableRender<string> = ({ value }) => {
  if (`${value}`.match(/success/i)) {
    return (
      <span style={{ color: colors.success }}>
        <Icon type="check-circle" /> {value}
      </span>
    );
  }
  if (`${value}`.match(/error/i)) {
    return (
      <span style={{ color: colors.error }}>
        <Icon type="exclamation-circle" /> {value}
      </span>
    );
  }
  return (
    <span style={{ color: colors.warning }}>
      <Icon type="exclamation-circle" /> {value}
    </span>
  );
};

export { StatusRenderer };
