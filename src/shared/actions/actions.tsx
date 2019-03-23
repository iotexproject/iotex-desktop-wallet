import { Layout, notification, Table } from "antd";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { getActionColumns } from "../address-details/action-table";
import { Flex } from "../common/flex";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACTIONS_BY_INDEX } from "../queries";

export class Actions extends Component {
  public render(): JSX.Element {
    return (
      <ContentPadding>
        <Layout tagName={"main"} className={"main-container"}>
          <Layout.Content tagName={"main"}>
            <Flex
              backgroundColor={colors.white}
              column={true}
              alignItems={"baselines"}
            >
              <h1 style={{ padding: "16px" }}>Actions</h1>
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
  public state: State = { start: 0, count: 10 };

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

          const actions = data && data.getActions && data.getActions.actions;

          return (
            <div className={"table-list"}>
              <SpinPreloader spinning={loading}>
                <Table
                  dataSource={actions}
                  columns={getActionColumns()}
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
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </SpinPreloader>
            </div>
          );
        }}
      </Query>
    );
  }
}
