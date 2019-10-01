import { Divider } from "antd";
import React from "react";
import { Page } from "../pages/page";
import { IShareCallOutProps, ShareCallout } from "./share-callout";
import { IVerticalTableProps, VerticalTable } from "./vertical-table";

const CardDetails: React.FC<{
  title: string;
  share: IShareCallOutProps;
  vtable?: IVerticalTableProps;
}> = ({ title, share, vtable, children }) => {
  return (
    <Page
      header={
        <>
          <span
            className="ellipsis-text"
            style={{ maxWidth: "80%", paddingRight: 16 }}
          >
            {title}
          </span>
          <ShareCallout {...share} />
          <Divider style={{ marginBottom: 0 }} />
        </>
      }
    >
      {vtable && <VerticalTable {...vtable} />}
      {children}
    </Page>
  );
};

export { CardDetails };
