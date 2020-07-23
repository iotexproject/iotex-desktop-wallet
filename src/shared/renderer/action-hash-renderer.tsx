import Icon from "antd/lib/icon";
import { get } from "dottie";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { Link } from "react-router-dom";
import { Dict } from "../common/types";
import { VerticalTableRender } from "../common/vertical-table";
import { GET_ACTION_DETAILS_STATUS_BY_HASH } from "../queries";
import { colors } from "../common/styles/style-color";
export interface IActionsDetails {
  receipt?: {
    receiptInfo: {
      recipient: {
        status: string;
      };
    };
  };
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseStatus = (data: IActionsDetails) => {
  const { status }: Dict = get(data, "receipt.receiptInfo.receipt") || {};
  return status;
};

const ActionHashRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="ellipsis-text" style={{ maxWidth: "10vw", minWidth: 100 }}>
      <Link to={`/action/${value}`}>
        <Query
          errorPolicy="ignore"
          query={GET_ACTION_DETAILS_STATUS_BY_HASH}
          variables={{ actionHash: value }}
        >
          {({ error, data, loading }: GetActionDetailsResponse) => {
            if (error || (!loading && (!data || !data.receipt))) {
              return null;
            }
            const status = parseStatus(data || {});
            if (loading || `${status}`.match(/success/i)) {
              return null;
            }
            return (
              <>
                <Icon
                  type="exclamation-circle"
                  style={{ color: colors.warning }}
                />
                &nbsp;
              </>
            );
          }}
        </Query>
        {value}
      </Link>
    </span>
  );
};

export { ActionHashRenderer };
