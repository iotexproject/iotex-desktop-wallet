import { Tooltip } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React, { CSSProperties, useState } from "react";
import * as copy from "text-to-clipboard";

const CopyToClipboard: React.FC<{
  text: string;
  title?: string;
  style?: CSSProperties;
}> = props => {
  const { text, children, style, ...attrs } = props;
  const [copied, setCopied] = useState(false);
  const title = copied
    ? t("copy.copied")
    : props.title || t("copy.copyToClipboard", { field: "" });
  return (
    <Tooltip
      placement="top"
      trigger="hover"
      title={title}
      onVisibleChange={visible => !visible && setCopied(false)}
    >
      <span
        role="main"
        onClick={() => {
          copy.copyCB(text);
          setCopied(true);
        }}
        style={{ ...style, cursor: "pointer" }}
        onMouseEnter={() => setCopied(false)}
        {...attrs}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export { CopyToClipboard };
