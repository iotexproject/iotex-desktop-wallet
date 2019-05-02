import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import Table from "antd/lib/table";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import { GetChainMetaResponse } from "iotex-antenna/protogen/proto/api/api_pb";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { getActionColumns } from "../address-details/action-table";
import { Flex } from "../common/flex";
import { Navigation } from "../common/navigation";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACTIONS_BY_INDEX, GET_CHAIN_META } from "../queries";

export class Actions extends Component {
  public render(): JSX.Element {
    return (
      <ContentPadding>
        <Helmet title={`${t("action.actions")} - ${t("meta.description")}`} />
        <Navigation />
        <Layout tagName={"main"} className={"main-container"}>
          <Layout.Content tagName={"main"}>
            <Flex
              backgroundColor={colors.white}
              column={true}
              alignItems={"baselines"}
              width={"100%"}
            >
              <PageTitle>
                <Icon type="project" /> {t("action.actions")}
              </PageTitle>
              <ActionTable />
            </Flex>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}

type State = {
  start: number;
  count: number;
};

export class ActionTable extends Component<{}, State> {
  public state: State = { start: 0, count: 15 };
  public render(): JSX.Element {
    const { count } = this.state;
    let { start } = this.state;
    return (
      <Query query={GET_CHAIN_META}>
        {({
          loading,
          error,
          data
        }: QueryResult<{ chainMetaData: GetChainMetaResponse }>) => {
          if (loading) {
            return <SpinPreloader spinning={loading}>Loading...</SpinPreloader>;
          }
          if (error || !data) {
            // Error already handled at apollo-error-handling.ts
            return null;
          }
          const chainMetaData = data;
          const numActions = Number(get(chainMetaData, "chainMeta.numActions"));
          start = numActions && numActions - count < 0 ? 0 : numActions - count;
          return (
            <Query
              query={GET_ACTIONS_BY_INDEX}
              variables={{ byIndex: { start, count } }}
              notifyOnNetworkStatusChange={true}
            >
              {({
                loading,
                error,
                data,
                fetchMore
              }: QueryResult<{ getActions: GetActionsResponse }>) => {
                if (error) {
                  return null;
                }
                const actions =
                  data && data.getActions && data.getActions.actionInfo;
                return (
                  <div style={{ width: "100%" }}>
                    <SpinPreloader spinning={loading}>
                      <Table
                        rowKey={"actHash"}
                        dataSource={actions}
                        columns={getActionColumns()}
                        style={{ width: "100%" }}
                        scroll={{ x: true }}
                        pagination={{
                          pageSize: count,
                          total: numActions
                        }}
                        onChange={pagination => {
                          const current = pagination.current || 0;
                          const cStart = start - (current - 1) * count;
                          fetchMore({
                            query: GET_ACTIONS_BY_INDEX,
                            variables: {
                              byIndex: {
                                start: cStart < 0 ? 0 : cStart,
                                count: count
                              }
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                              if (!fetchMoreResult) {
                                return prev;
                              }
                              return fetchMoreResult;
                            }
                          });
                        }}
                      />
                    </SpinPreloader>
                  </div>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}
