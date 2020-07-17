import Spin from "antd/lib/spin";
import Tag from "antd/lib/tag";
import { get } from "dottie";
import React from "react";
import { Query } from "react-apollo";
import { NotFound } from "../common/not-found";
import { Dict } from "../common/types";
import { VerticalTableRender } from "../common/vertical-table";
import {
  GetActionDetailsResponse,
  IActionsDetails
} from "../pages/action-detail-page";
import { GET_ACTION_STATUS_BY_HASH } from "../queries";

const parseActionDetailsStatus = (data: IActionsDetails) => {
  // destruct receipt info
  const { status }: Dict = get(data, "receipt.receiptInfo.receipt") || {};

  return status;
};

const IOTXStatusRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <Query
      errorPolicy="ignore"
      query={GET_ACTION_STATUS_BY_HASH}
      variables={{ actionHash: value, checkingPending: true }}
      pollInterval={3000}
    >
      {({ error, data, loading, stopPolling }: GetActionDetailsResponse) => {
        if (error || (!loading && (!data || !data.action || !data.receipt))) {
          return null;
        }
        if (data && data.action) {
          stopPolling();
        }
        if (loading) {
          return <Spin />;
        }

        const status = parseActionDetailsStatus(data || {});
        return (
          <Tag color={status === "Success" ? "green" : "volcano"}>{status}</Tag>
        );
      }}
    </Query>
  );
};

export { IOTXStatusRenderer };
