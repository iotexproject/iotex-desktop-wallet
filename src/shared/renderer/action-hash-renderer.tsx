import { Icon, notification } from "antd";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { Link } from "react-router-dom";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { VerticalTableRender } from "../common/vertical-table";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";

const ActionHashRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <Query
      query={GET_ACTION_DETAILS_BY_HASH}
      variables={{
        actionHash: value,
        checkingPending: true
      }}
    >
      {({
        loading,
        error,
        data
      }: QueryResult<{ getActions: GetActionsResponse }>) => {
        if (error) {
          notification.error({
            message: "Error",
            description: `failed to query action detail hash: ${error}`
          });
        }
        // @ts-ignore
        const status = data.receipt.receiptInfo.receipt.status === "Success";
        return (
          <SpinPreloader spinning={loading}>
            <span
              className="ellipsis-text"
              style={{ maxWidth: "10vw", minWidth: 100 }}
            >
              <Link to={`/action/${value}`}>
                {!status && (
                  <span>
                    <Icon
                      style={{ color: colors.error }}
                      type="exclamation-circle"
                    />{" "}
                    {value}
                  </span>
                )}
                {status && value}
              </Link>
            </span>
          </SpinPreloader>
        );
      }}
    </Query>
  );
};

export { ActionHashRenderer };
