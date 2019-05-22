import { Col, Row } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { CandidatesCard } from "./stats/candidates-card";
import { MapCard } from "./stats/map-card";
import { ProductivityCard } from "./stats/productivity-card";
import { TPSCard } from "./stats/tps-card";
import { VotesCard } from "./stats/votes-card";

export const StatsArea = (): JSX.Element => {
  return (
    <Row type="flex" justify="space-between" gutter={10}>
      <Col xs={24} sm={24} md={24} lg={16}>
        <Row type="flex" justify="space-between" gutter={10}>
          <Col span={12}>
            <TPSCard currentTps={158} peak={546} />
          </Col>
          <Col span={12}>
            <CandidatesCard candidates={546} delegates={158} />
          </Col>
        </Row>
        <Row type="flex" justify="space-between" gutter={10}>
          <Col span={12}>
            <ProductivityCard value={96.87} />
          </Col>
          <Col span={12}>
            <VotesCard value={55750} />
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <MapCard />
      </Col>
    </Row>
  );
};
