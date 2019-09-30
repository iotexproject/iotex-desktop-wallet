import React from "react";
import { Link } from "react-router-dom";
import { VerticalTableRender } from "../common/vertical-table";

const ActionHashRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="ellipsis-text" style={{ maxWidth: "10vw", minWidth: 100 }}>
      <Link to={`/action/${value}`}>{value}</Link>
    </span>
  );
};

export { ActionHashRenderer };
