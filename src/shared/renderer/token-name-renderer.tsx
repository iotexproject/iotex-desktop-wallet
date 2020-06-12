import React from "react";

const TokenNameRenderer = ({
  name,
  symbol,
  logo
}: {
  name: string;
  symbol?: string;
  logo?: string;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
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
