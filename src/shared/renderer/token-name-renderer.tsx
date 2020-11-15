import React from "react";
import { LinkButton } from "../common/buttons";
interface InputProps {
  name: string;
  symbol?: string;
  logo?: string;
  style?: React.CSSProperties;
  contract?: string;
  link?: string;
}
const TokenNameRenderer = (props: InputProps) => {
  const href = props.link || props.contract;
  return (
    <LinkButton href={href}>
      <div style={{ display: "flex", alignItems: "center", ...props.style }}>
        {props.logo && (
          <img
            src={`/image/token/${props.logo}`}
            alt="ico"
            style={{ width: "13px", height: "13px" }}
          />
        )}
        <span style={{ marginLeft: "2px", whiteSpace: "nowrap" }}>{`${
          props.name
        } (${props.symbol || ""})`}</span>
      </div>
    </LinkButton>
  );
};

export { TokenNameRenderer };
