import notification from "antd/lib/notification";
import Table from "antd/lib/table";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { getActionColumns } from "../address-details/action-table";
import { Flex } from "../common/flex";
import { PageTitle } from "../common/page-title";
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

            const actionInfo =
              data && data.getActions && data.getActions.actionInfo;

            return (
              <SpinPreloader spinning={loading}>
                <Flex
                  column={true}
                  width={"100%"}
                  alignItems={"baselines"}
                  backgroundColor={colors.white}
                >
                  <PageTitle>{t("action.action")}</PageTitle>
                  <Table
                    columns={getActionColumns()}
                    dataSource={actionInfo}
                    rowKey={"actHash"}
                    style={{ width: "100%" }}
                    pagination={{ hideOnSinglePage: true }}
                    scroll={{ x: true }}
                  />
                </Flex>
              </SpinPreloader>
            );
          }}
        </Query>
        .{" "}
      </ContentPadding>
    );
  }
}

export const ActionDetail = withRouter(ActionDetailsInner);
