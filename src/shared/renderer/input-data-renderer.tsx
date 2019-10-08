import TextArea from "antd/lib/input/TextArea";
import React from "react";
import {
  Execution,
  GrantReward,
  Transfer
} from "../../api-gateway/resolvers/antenna-types";
import { VerticalTableRender } from "../common/vertical-table";

const InputDataRenderer: VerticalTableRender<{
  execution?: Execution;
  transfer?: Transfer;
  grantReward?: GrantReward;
}> = ({ value }) => {
  const { transfer } = value;
  if (transfer) {
    return (
      <TextArea
        autosize={{ minRows: 2, maxRows: 5 }}
        value={`${transfer.payload || "0x"}`}
        readOnly={true}
        className="monospace-code bg-light"
      ></TextArea>
    );
  }

  return null;
};

export { InputDataRenderer };
