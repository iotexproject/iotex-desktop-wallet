import React from "react";
import { Link } from "react-router-dom";
import { VerticalTableRender } from "../common/vertical-table";
import { CopyToClipboard } from "../common/copy-to-clipboard";
import Icon from "antd/lib/icon";

const TokenAddressRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="ellipsis-text" style={{ maxWidth: "30vw", minWidth: 100 }}>
      <Link to={`/token/${value}`}>{value}</Link>{" "}
      <CopyToClipboard text={value}>
        <Icon type="copy" />
      </CopyToClipboard>
    </span>
  );
};

export { TokenAddressRenderer };
