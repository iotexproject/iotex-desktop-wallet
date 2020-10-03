import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import Tag from "antd/lib/tag";
import BigNumber from "bignumber.js";
import { fromRau } from "iotex-antenna/lib/account/utils";
import React, { useState } from "react";
import { Token } from "../../erc20/token";
import { TokenNameRenderer } from "../renderer/token-name-renderer";
import { LinkButton } from "./buttons";
import { GetTokenMetadataMap } from "./common-metadata";
import { numberWithCommas } from "./vertical-table";
const XRC20TokenName: React.FC<{ contract: string }> = ({ contract }) => {
  const token = Token.getToken(contract);
  token
    .getBasicTokenInfo()
    .then(info => {
      if (info && info.symbol) {
        setName(`${info.name} (${info.symbol})`);
      }
      setAddress(info.tokenAddress);
    })
    .catch(() => {
      setName("");
    });
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  return <LinkButton href={`/token/${address}`}>{name}</LinkButton>;
};

const XRC20TokenUnit: React.FC<{ contract: string }> = ({ contract }) => {
  const token = Token.getToken(contract);
  const metadataMap = GetTokenMetadataMap();
  const metadata = metadataMap[contract] || {};
  token
    .getBasicTokenInfo()
    .then(info => {
      if (info && info.symbol) {
        setText(`(${info.symbol})`);
      }
    })
    .catch(() => {
      setText("");
    });
  const [text, setText] = useState("");
  return (
    <TokenNameRenderer
      name={text}
      logo={metadata.logo}
      style={{ display: "inline" }}
    />
  );
};

const XRC20TokenBalance: React.FC<{ contract: string; address: string }> = ({
  contract,
  address
}) => {
  const [{ balance, balanceAddress, balanceContract }, setBalance] = useState({
    balance: "",
    balanceAddress: "",
    balanceContract: ""
  });
  let balanceStr = balance;
  if (balanceAddress !== address || balanceContract !== contract) {
    balanceStr = "";
    const token = Token.getToken(contract);
    token
      .getInfo(address)
      .then(info => {
        if (info && info.symbol) {
          setBalance({
            balance: `${info.balanceString} ${info.symbol}`,
            balanceAddress: address,
            balanceContract: contract
          });
        }
      })
      .catch(() => {
        setBalance({
          balance: "",
          balanceAddress: address,
          balanceContract: contract
        });
      });
  }
  return <span>{balanceStr}</span>;
};

const XRC20TokenBalanceTag: React.FC<{
  contract: string;
  address: string;
  loading?: boolean;
  done?(): void;
  symbol?: string;
}> = ({ contract, address, loading, done, symbol }) => {
  const [balance, setBalance] = useState("");
  const token = Token.getToken(contract);
  token
    .getInfo(address)
    .then(info => {
      if (done) {
        done();
      }
      if (info) {
        setBalance(`${info.balanceString} ${info.symbol || symbol}`);
      }
    })
    .catch(() => {
      if (done) {
        done();
      }
      setBalance("");
    });
  if (loading) {
    return <Spin indicator={<Icon type="loading" spin={true} />} />;
  }
  if (balance) {
    return <Tag>{numberWithCommas(balance)}</Tag>;
  }
  return null;
};

const XRC20TokenValue: React.FC<{ contract: string; value: BigNumber }> = ({
  contract,
  value
}) => {
  const token = Token.getToken(contract);
  token
    .getBasicTokenInfo()
    .then(info => {
      if (info && info.symbol) {
        const tokenTransfered = value.dividedBy(
          new BigNumber(`1e${info.decimals}`)
        );

        setBalance(`${numberWithCommas(`${tokenTransfered}`)} ${info.symbol}`);
      } else {
        setBalance(`${numberWithCommas(fromRau(`${value}`, "Iotx"))} IOTX`);
      }
    })
    .catch(() => {
      // failback to native
      setBalance(`${numberWithCommas(fromRau(`${value}`, "Iotx"))} IOTX`);
    });
  const [balance, setBalance] = useState("");
  return <span>{balance}</span>;
};

export {
  XRC20TokenName,
  XRC20TokenBalance,
  XRC20TokenUnit,
  XRC20TokenValue,
  XRC20TokenBalanceTag
};
