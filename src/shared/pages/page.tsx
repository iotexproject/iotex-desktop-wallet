import { Col } from "antd";
import Row, { RowProps } from "antd/lib/row";
import React from "react";
import { SpinPreloader } from "../common/spin-preloader";

export interface IPageProps extends RowProps {
  header?: string | JSX.Element;
  loading?: boolean;
}

const Page: React.FC<IPageProps> = props => {
  const { loading, header, className, children, ...attrs } = props;
  const classes = ["card-shadow", className || ""].join(" ");
  if (loading) {
    return (
      <SpinPreloader spinning={true}>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ padding: 40 }}
        >
          {" "}
        </Row>
      </SpinPreloader>
    );
  }
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      className={classes}
      {...attrs}
    >
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
