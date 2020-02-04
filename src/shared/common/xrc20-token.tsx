import { Tag } from "antd";
import BigNumber from "bignumber.js";
import { fromRau } from "iotex-antenna/lib/account/utils";
import React, { useState } from "react";
import { Token } from "../../erc20/token";

const XRC20TokenName: React.FC<{ contract: string }> = ({ contract }) => {
  const token = Token.getToken(contract);
  token
    .getBasicTokenInfo()
    .then(info => {
      if (info && info.symbol) {
        setName(`${info.name} (${info.symbol})`);
      }
    })
    .catch(() => {
      setName("");
    });
  const [name, setName] = useState("");
  return <span>{name}</span>;
};

const XRC20TokenUnit: React.FC<{ contract: string }> = ({ contract }) => {
  const token = Token.getToken(contract);
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
  return <span>{text}</span>;
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

const XRC20TokenBalanceTag: React.FC<{ contract: string; address: string }> = ({
  contract,
  address
}) => {
  const token = Token.getToken(contract);
  token
    .getInfo(address)
    .then(info => {
      if (info && info.symbol) {
        setBalance(`${info.balanceString} ${info.symbol}`);
      }
    })
    .catch(() => {
      setBalance("");
    });
  const [balance, setBalance] = useState("");
  return balance ? <Tag>{balance}</Tag> : null;
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
        setBalance(`${tokenTransfered} ${info.symbol}`);
      } else {
        setBalance(`${fromRau(`${value}`, "Iotx")} IOTX`);
      }
    })
    .catch(() => {
      // failback to native
      setBalance(`${fromRau(`${value}`, "Iotx")} IOTX`);
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
