import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import notification from "antd/lib/notification";
import Table from "antd/lib/table";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { getActionColumns } from "../address-details/action-table";
import { Flex } from "../common/flex";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACTIONS_BY_INDEX } from "../queries";

export class Actions extends Component {
  public render(): JSX.Element {
    return (
      <ContentPadding>
        <Helmet title={`${t("action.actions")} - ${t("meta.description")}`} />
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
  public state: State = { start: 0, count: 30 };

  public render(): JSX.Element {
    const { start, count } = this.state;

    return (
      <Query
        query={GET_ACTIONS_BY_INDEX}
        variables={{ byIndex: { start, count } }}
      >
        {({
          loading,
          error,
          data
        }: QueryResult<{ getActions: GetActionsResponse }>) => {
          if (!loading && error) {
            notification.error({
              message: "Error",
              description: `failed to get blocks: ${error.message}`,
              duration: 3
            });
            return null;
          }
          const actions = data && data.getActions && data.getActions.actionInfo;

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
                    // @ts-ignore
                    onChange: (page, pageSize) => {
                      const cStart = page > 0 ? (page - 1) * count : 0;
                      this.setState({
                        start: cStart,
                        count
                      });
                    },
                    total: start + count + 1,
                    defaultCurrent: start / count
                  }}
                />
              </SpinPreloader>
            </div>
          );
        }}
      </Query>
    );
  }
}
