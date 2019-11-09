import { Tag } from "antd";
import BigNumber from "bignumber.js";
import { fromRau } from "iotex-antenna/lib/account/utils";
import React, { useState } from "react";
import { Token } from "../../erc20/token";

const XRC20TokenName: React.FC<{ contract: string }> = ({ contract }) => {
  const [name, setName] = useState("");
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
  return <span>{name}</span>;
};

const XRC20TokenUnit: React.FC<{ contract: string }> = ({ contract }) => {
  const [text, setText] = useState("");
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
  return <span>{text}</span>;
};

const XRC20TokenBalance: React.FC<{ contract: string; address: string }> = ({
  contract,
  address
}) => {
  const [balance, setBalance] = useState("");
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
  return <span>{balance}</span>;
};

const XRC20TokenBalanceTag: React.FC<{ contract: string; address: string }> = ({
  contract,
  address
}) => {
  const [balance, setBalance] = useState("");
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
  return balance ? <Tag>{balance}</Tag> : null;
};

const XRC20TokenValue: React.FC<{ contract: string; value: BigNumber }> = ({
  contract,
  value
}) => {
  const [balance, setBalance] = useState("");
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
  return <span>{balance}</span>;
};

export {
  XRC20TokenName,
  XRC20TokenBalance,
  XRC20TokenUnit,
  XRC20TokenValue,
  XRC20TokenBalanceTag
};
