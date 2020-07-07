import Tag from "antd/lib/tag";
import { fromRau } from "iotex-antenna/lib/account/utils";
import React from "react";
import { VerticalTableRender } from "../common/vertical-table";

const IOTXValueRenderer: VerticalTableRender<string> = ({ value }) => {
  return <Tag>{`${fromRau(value, "iotx")} IOTX`}</Tag>;
};

export { IOTXValueRenderer };
