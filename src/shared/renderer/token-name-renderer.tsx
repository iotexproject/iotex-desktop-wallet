import React, { useState } from "react";
import { Token } from "../../erc20/token";
import { LinkButton } from "../common/buttons";
interface InputProps {
  name: string;
  symbol?: string;
  logo?: string;
  style?: React.CSSProperties;
  contract?: string;
}
const TokenNameRenderer = (prop: InputProps) => {
  const [address, setAddress] = useState("");
  const getTemplate = () => {
    return (
      <div style={{ display: "flex", alignItems: "center", ...prop.style }}>
        {prop.logo && (
          <img
            src={`/image/token/${prop.logo}`}
            alt="ico"
            style={{ width: "13px", height: "13px" }}
          />
        )}
        <span style={{ marginLeft: "2px" }}>{name}</span>
        {prop.symbol && <span>({prop.symbol})</span>}
      </div>
    );
  };
  if (!!prop.contract) {
    const token = Token.getToken(prop.contract);
    token
      .getBasicTokenInfo()
      .then(info => {
        setAddress(info.tokenAddress);
      })
      .catch(() => {
        setAddress("");
      });
    return <LinkButton href={address}>{getTemplate()}</LinkButton>;
  } else {
    return getTemplate();
  }
};

export { TokenNameRenderer };
