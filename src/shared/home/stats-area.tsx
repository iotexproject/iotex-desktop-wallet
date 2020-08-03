import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { webBpApolloClient } from "../common/apollo-client";
import { GET_BP_STATS } from "../queries";
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
            <Query
              query={GET_BP_STATS}
              ssr={false}
              client={webBpApolloClient}
              pollInterval={15000}
            >
              {(queryResult: QueryResult) => {
                const { loading, error, stopPolling } = queryResult;
                if (error && !loading) {
                  notification.error({
                    message: `failed to query bp stats in Stats Area: ${error}`
                  });
                  stopPolling();
                }
                return (
                  <>
                    <Col xs={12} sm={12} md={6}>
                      <CandidatesCard {...queryResult} />
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                      <StakedVotesCard {...queryResult} />
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <ProductivityCard {...queryResult} />
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <VotesCard {...queryResult} />
                    </Col>
                  </>
                );
              }}
            </Query>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <MapCard />
        </Col>
      </Row>
    </>
  );
};
