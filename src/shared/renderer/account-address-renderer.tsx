import React from "react";
import { Link } from "react-router-dom";
import { VerticalTableRender } from "../common/vertical-table";

const AccountAddressRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="ellipsis-text" style={{ maxWidth: "10vw", minWidth: 100 }}>
      <Link to={`/address/${value}`}>{value}</Link>
    </span>
  );
};

export { AccountAddressRenderer };
