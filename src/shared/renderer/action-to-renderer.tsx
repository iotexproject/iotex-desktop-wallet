import notification from "antd/lib/notification";
import { get } from "dottie";
import { IReceipt } from "iotex-antenna/lib/rpc-method/types";
import React from "react";
import { Query } from "react-apollo";
import { AddressName } from "../common/address-name";
import { VerticalTableRender } from "../common/vertical-table";
import { GetActionDetailsResponse } from "../pages/action-detail-page";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";

const ActionToRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <Query
      query={GET_ACTION_DETAILS_BY_HASH}
      variables={{ actionHash: value, checkingPending: true }}
    >
      {({ data, error, loading }: GetActionDetailsResponse) => {
        if (error) {
          notification.error({
            message: `failed to query action details by hash in action-contract-render: ${error}`
          });
        }
        if (!data || loading) {
          return null;
        }
        const { contractAddress } =
          get<IReceipt>(data, "receipt.receiptInfo.receipt") || {};
        return contractAddress !== "-" ? (
          <span
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100 }}
          >
            <AddressName address={contractAddress} />
          </span>
        ) : (
          contractAddress
        );
      }}
    </Query>
  );
};

export { ActionToRenderer };
