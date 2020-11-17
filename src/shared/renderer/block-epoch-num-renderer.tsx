import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import { VerticalTableRender } from "../common/vertical-table";

const BlockEpochNumRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <Row type="flex" align="middle" justify="start" gutter={10}>
      <Col>{value}</Col>
    </Row>
  );
};

export { BlockEpochNumRenderer };
