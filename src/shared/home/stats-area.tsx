import Col from "antd/lib/col";
import Row from "antd/lib/row";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { ActionsCard } from "./stats/actions-card";
import { CandidatesCard } from "./stats/candidates-card";
import { MapCard } from "./stats/map-card";
import { ProductivityCard } from "./stats/productivity-card";
import { StakedVotesCard } from "./stats/staked-card";
import { VotesCard } from "./stats/votes-card";

export const StatsArea = (): JSX.Element => {
  return (
    <>
      <Row type="flex" justify="space-between" gutter={10}>
        <Col xs={24} sm={24} md={24} lg={16}>
          <Row type="flex" justify="space-between" gutter={10}>
            <Col xs={24} sm={24} md={12}>
              <ActionsCard />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <CandidatesCard />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <StakedVotesCard />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <ProductivityCard />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <VotesCard />
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <MapCard />
        </Col>
      </Row>
    </>
  );
};
