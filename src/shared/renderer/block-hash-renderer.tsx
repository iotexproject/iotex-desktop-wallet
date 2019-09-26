import React from "react";
import { Link } from "react-router-dom";
import { VerticalTableRender } from "../common/vertical-table";

const BlockHashRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="ellipsis-text" style={{ maxWidth: "20vw" }}>
      <Link to={`/block/${value}`}>{value}</Link>
    </span>
  );
};

export { BlockHashRenderer };
