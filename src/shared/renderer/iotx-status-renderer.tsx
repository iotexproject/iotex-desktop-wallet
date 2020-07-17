import Tag from "antd/lib/tag";
import React from "react";
import { VerticalTableRender } from "../common/vertical-table";
import { Query } from "react-apollo";
import { GET_ACTION_STATUS_BY_HASH } from "../queries";
import {
  GetActionDetailsResponse,
  IActionsDetails
} from "../pages/action-detail-page";
import { NotFound } from "../common/not-found";
import Spin from "antd/lib/spin";
import { get } from "dottie";
import { Dict } from "../common/types";

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
        if (loading) return <Spin />;

        const status = parseActionDetailsStatus(data || {});
        return (
          <Tag color={status === "Success" ? "green" : "volcano"}>{status}</Tag>
        );
      }}
    </Query>
  );
};

export { IOTXStatusRenderer };
