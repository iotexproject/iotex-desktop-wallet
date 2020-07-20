import Icon from "antd/lib/icon";
import React from "react";
import { CopyToClipboard } from "../common/copy-to-clipboard";
import { VerticalTableRender } from "../common/vertical-table";

const TextCopyRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <>
      <span className="wordwrap auto-spacing" style={{ paddingRight: 16 }}>
        {value}
      </span>
      <CopyToClipboard text={value}>
        <Icon type="copy" />
      </CopyToClipboard>
    </>
  );
};

export { TextCopyRenderer };
