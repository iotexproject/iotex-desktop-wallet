import Tag from "antd/lib/tag";
import BigNumber from "bignumber.js";
import { fromRau } from "iotex-antenna/lib/account/utils";
import isBrowser from "is-browser";
import { Dict } from "onefx/lib/types";
import React from "react";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { VerticalTableRender } from "../common/vertical-table";
import { XRC20TokenBalanceTag } from "../common/xrc20-token";

const AccountBalanceRenderer: VerticalTableRender<Dict> = ({
  value: { address, balance }
}) => {
  BigNumber.config({ DECIMAL_PLACES: 8, ROUNDING_MODE: BigNumber.ROUND_DOWN });
  const xrc20tokens =
    (isBrowser && JsonGlobal("state").base.defaultERC20Tokens) || [];
  return (
    <>
      <Tag>{`${fromRau(balance, "iotx").replace(
        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
        ","
      )} IOTX`}</Tag>
      {xrc20tokens.map((token: string) => (
        <span key={`balance-${token}`}>
          <XRC20TokenBalanceTag contract={token} address={address} />
        </span>
      ))}
    </>
  );
};

export { AccountBalanceRenderer };
