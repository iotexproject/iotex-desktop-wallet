import Icon from "antd/lib/icon";
import React from "react";
import { Page } from "../pages/page";
import { CopyToClipboard } from "./copy-to-clipboard";
import { IShareCallOutProps, ShareCallout } from "./share-callout";
import { IVerticalTableProps, VerticalTable } from "./vertical-table";

const CardDetails: React.FC<{
  title: string;
  share: IShareCallOutProps;
  vtable?: IVerticalTableProps;
  titleToCopy?: string;
}> = ({ title, share, vtable, children, titleToCopy }) => {
  return (
    <Page
      header={
        <>
          <span
            className="ellipsis-text"
            style={{ maxWidth: "calc(100% - 90px)" }}
          >
            {title}
          </span>
          {titleToCopy && (
            <span style={{ padding: "4px 0px 4px 16px", fontSize: 18 }}>
              <CopyToClipboard text={titleToCopy}>
                <Icon type="copy" />
              </CopyToClipboard>
            </span>
          )}
          <span style={{ padding: "4px 0px 4px 12px", fontSize: 18 }}>
            <ShareCallout {...share} />
          </span>
        </>
      }
    >
      {vtable && <VerticalTable {...vtable} />}
      {children}
    </Page>
  );
};

export { CardDetails };
