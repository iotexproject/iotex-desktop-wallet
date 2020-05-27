import Col from "antd/lib/col";
import Row from "antd/lib/row";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { CandidatesCard } from "./stats/candidates-card";
import { MapCard } from "./stats/map-card";
import { BalanceCard } from "./stats/balance-card";
import { ProductivityCard } from "./stats/productivity-card";
import { StakedVotesCard } from "./stats/staked-card";
import { VotesCard } from "./stats/votes-card";

export const StatsArea = (): JSX.Element => {
  return (
    <>
      <Row type="flex" justify="space-between" gutter={10}>
        <Col xs={24} sm={24} md={24} lg={16}>
          <Row type="flex" justify="space-between" gutter={10}>
            <Col span={12}>
              <VotesCard />
            </Col>
            <Col span={12}>
              <Row type="flex" align="top" justify="space-between" gutter={10}>
                <Col span={12}>
                  <CandidatesCard />
                </Col>
                <Col span={12}>
                  <StakedVotesCard />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" gutter={10}>
            <Col lg={12} xs={24}>
              <BalanceCard />
            </Col>
            <Col lg={12} xs={24}>
              <ProductivityCard />
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
