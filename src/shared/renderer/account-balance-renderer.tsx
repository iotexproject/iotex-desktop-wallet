import { Row, Tag } from "antd";
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
  const xrc20tokens =
    (isBrowser && JsonGlobal("state").base.defaultERC20Tokens) || [];
  return (
    <>
      <Tag>{`${fromRau(balance, "iotx")} IOTX`}</Tag>
      {xrc20tokens.map(token => (
        <span key={`balance-${token}`}>
          <XRC20TokenBalanceTag contract={token} address={address} />
        </span>
      ))}
    </>
  );
};

export { AccountBalanceRenderer };
