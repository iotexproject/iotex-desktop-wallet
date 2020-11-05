import React from "react";
import { KNOWN_TOPICS, TokenTransferRow } from "../common/TokenTransferRow";
import { VerticalTableRender } from "../common/vertical-table";
import { LogObject } from "../pages/action-detail-page";

const Xrc20TransferRenderer: VerticalTableRender<
  Array<LogObject & { topics: Array<string> }>
> = ({ value: logs }) => {
  return (
    <>
      {logs
        .filter(({ topics }) => topics.length >= 3 && KNOWN_TOPICS[topics[0]])
        .map(({ contractAddress, topics, data }, index: number) => {
          return (
            <TokenTransferRow
              contractAddress={contractAddress}
              topics={topics}
              data={data}
              key={`token-transfer-${index}`}
            />
          );
        })}
    </>
  );
};

export { Xrc20TransferRenderer };
