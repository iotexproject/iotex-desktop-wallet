import React from "react";

const TokenNameRenderer = ({
  name,
  symbol,
  logo,
  style
}: {
  name: string;
  symbol?: string;
  logo?: string;
  style?: React.CSSProperties
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center",...style }}>
      {logo && (
        <img
          src={`/image/token/${logo}`}
          alt="ico"
          style={{ width: "13px", height: "13px" }}
        />
      )}
      <span style={{ marginLeft: "2px" }}>{name}</span>
      {symbol && <span>({symbol})</span>}
    </div>
  );
};

export { TokenNameRenderer };
