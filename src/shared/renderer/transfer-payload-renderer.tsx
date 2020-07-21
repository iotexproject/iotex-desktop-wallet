import React from "react";
import { Transfer } from "../../api-gateway/resolvers/antenna-types";
import { VerticalTableRender } from "../common/vertical-table";

const TransferPayloadRenderer: VerticalTableRender<{ transfer: Transfer }> = ({
  value: { transfer }
}) => {
  const payload = transfer.payload.toString();
  return (
    <span className="ellipsis-text" style={{ maxWidth: "100%", minWidth: 100 }}>
      {payload}
    </span>
  );
};

export { TransferPayloadRenderer };
