import { Col, Divider, Row } from "antd";
import React from "react";
import { IShareCallOutProps, ShareCallout } from "./share-callout";
import { SpinPreloader } from "./spin-preloader";
import { IVerticalTableProps, VerticalTable } from "./vertical-table";

const CardDetails: React.FC<{
  title: string;
  share: IShareCallOutProps;
  loading?: boolean;
  // tslint:disable-next-line:no-any
  vtable?: IVerticalTableProps<any>;
}> = ({ title, share, loading, vtable, children }) => {
  return (
    <Row type="flex" justify="center" align="middle" className="card-shadow">
      <Col xs={20} md={22}>
        <Row type="flex" justify="start" align="middle" gutter={20}>
          <Col style={{ maxWidth: "80%" }}>
            <div className="action-detail-card-title">{title}</div>
          </Col>
          <Col>
            <ShareCallout {...share} />
          </Col>
        </Row>
      </Col>
      <Col xs={22} md={23}>
        <Divider style={{ margin: 0 }} />
      </Col>
      <Col xs={20} md={22}>
        <SpinPreloader spinning={!!loading}>
          <div>
            {vtable ? <VerticalTable {...vtable} /> : ""}
            {children}
          </div>
        </SpinPreloader>
      </Col>
    </Row>
  );
};

export { CardDetails };
