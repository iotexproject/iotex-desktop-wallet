import React from "react";
import { Link } from "react-router-dom";
import { VerticalTableRender } from "../common/vertical-table";

const TokenAddressRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="ellipsis-text" style={{ maxWidth: "30vw", minWidth: 100 }}>
      <Link to={`/token/${value}`}>{value}</Link>
    </span>
  );
};

export { TokenAddressRenderer };
