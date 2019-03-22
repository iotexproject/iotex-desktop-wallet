import { notification, Table } from "antd";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { getColumns } from "../address-details/action-table";
import { Flex } from "../common/flex";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACTIONS_BY_HASH } from "../queries";

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class ActionDetailsInner extends PureComponent<Props> {
  public render(): JSX.Element {
    const {
      match: {
        params: { hash }
      }
    } = this.props;

    return (
      <ContentPadding>
        <Query
          query={GET_ACTIONS_BY_HASH}
          variables={{ byHash: { actionHash: hash, checkingPending: true } }}
        >
          {({
            loading,
            error,
            data
          }: QueryResult<{ getActions: GetActionsResponse }>) => {
            if (error) {
              notification.error({
                message: "Error",
                description: `failed to get account: ${error}`,
                duration: 3
              });
              return `failed to get account: ${error}`;
            }

            const actions = data && data.getActions && data.getActions.actions;

            return (
              <div className={"table-list"}>
                <SpinPreloader spinning={loading}>
                  <Flex
                    column={true}
                    alignItems={"baselines"}
                    backgroundColor={colors.white}
                  >
                    <h1 style={{ padding: "16px" }}>Action</h1>
                    <Table
                      columns={getColumns()}
                      dataSource={actions}
                      rowKey={"__typename"}
                      pagination={{ hideOnSinglePage: true }}
                    />
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                  </Flex>
                </SpinPreloader>
              </div>
            );
          }}
        </Query>
        .{" "}
      </ContentPadding>
    );
  }
}

export const ActionDetail = withRouter(ActionDetailsInner);
