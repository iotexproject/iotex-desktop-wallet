import Divider from "antd/lib/divider";
import Select from "antd/lib/select";
import Tag from "antd/lib/tag";
import BigNumber from "bignumber.js";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { Dict } from "onefx/lib/types";
import React, { useState } from "react";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { TokenMetadata } from "../../api-gateway/resolvers/token";
import { GetTokenMetadataMap } from "../common/common-metadata";
import {
  numberWithCommas,
  VerticalTableRender
} from "../common/vertical-table";
import { XRC20TokenBalanceTag } from "../common/xrc20-token";

const { Option, OptGroup } = Select;

const AccountBalanceRenderer: VerticalTableRender<Dict> = ({
  value: { address, balance }
}) => {
  BigNumber.config({ DECIMAL_PLACES: 8, ROUNDING_MODE: BigNumber.ROUND_DOWN });
  const tokenMetadataMap = GetTokenMetadataMap();
  const allTokenList = Object.keys(tokenMetadataMap).map(key => {
    return tokenMetadataMap[key];
  });
  const optTokenList: Array<{
    label: "XRC20" | "XRC721";
    list: Array<TokenMetadata>;
  }> = [
    {
      label: "XRC20",
      list: []
    },
    {
      label: "XRC721",
      list: []
    }
  ];
  allTokenList.forEach(token => {
    if (token.type === "xrc20") {
      optTokenList[0].list.push(token);
    } else if (token.type === "xrc721") {
      optTokenList[1].list.push(token);
    }
  });
  const getTokenAddr = (value: string) => value.split(".").shift() || "";
  const [loading, setLoading] = useState(true);
  const [toeknInfo, setTokenInfo] = useState(
    (allTokenList[0] && allTokenList[0]) || {}
  );

  const handleChange = (value: string) => {
    setLoading(true);
    if (value) {
      const item = allTokenList.find(token => token.logo === value);
      if (item) {
        setTokenInfo(item);
      }
    }
  };

  const BalanceTag = () => {
    if (!toeknInfo.logo) {
      return <span>-</span>;
    }
    return (
      <XRC20TokenBalanceTag
        contract={getTokenAddr(toeknInfo.logo)}
        address={address}
        loading={loading}
        done={() => {
          setLoading(false);
        }}
        symbol={toeknInfo.symbol}
      />
    );
  };

  return (
    <>
      <Tag>{`${numberWithCommas(fromRau(balance, "iotx"))} IOTX`}</Tag>
      <Divider type="vertical" style={{ height: "1.2em" }} />
      {allTokenList && allTokenList.length ? (
        <span style={{ marginLeft: 8 }}>
          <Select
            placeholder="Select Token"
            defaultValue={allTokenList[0].logo}
            style={{ width: 175, marginRight: "8px" }}
            onChange={handleChange}
            size="small"
          >
            {optTokenList.map(tokenType => {
              return tokenType.list.length ? (
                <OptGroup label={tokenType.label} key={`${tokenType.label}`}>
                  {tokenType.list.map(item => {
                    return (
                      <Option
                        key={`${item.name}_${item.symbol}`}
                        value={item.logo}
                      >{`${item.name}(${item.symbol})`}</Option>
                    );
                  })}
                </OptGroup>
              ) : null;
            })}
          </Select>
          {BalanceTag()}
        </span>
      ) : null}
    </>
  );
};

export { AccountBalanceRenderer };
