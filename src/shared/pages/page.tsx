import { Col } from "antd";
import Row, { RowProps } from "antd/lib/row";
import React from "react";
import { SpinPreloader } from "../common/spin-preloader";

export interface IPageProps extends RowProps {
  header?: string | JSX.Element;
  loading?: boolean;
}

const Page: React.FC<IPageProps> = props => {
  const { loading, header, children } = props;
  if (loading) {
    return (
      <SpinPreloader spinning={true}>
        <Row type="flex" justify="center" align="middle">
          {" "}
        </Row>
      </SpinPreloader>
    );
  }
  return (
    <Row>
      {header && (
        <Col span={22}>
          <Row type="flex" justify="start" align="top" className="page-title">
            {header}
          </Row>
        </Col>
      )}
      <Col span={22} className="page-body">
        <Row type="flex" justify="start" align="top">
          {children}
        </Row>
      </Col>
    </Row>
  );
};

export { Page };
