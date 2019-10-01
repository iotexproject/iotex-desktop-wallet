import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { IActionCore, IReceipt } from "iotex-antenna/lib/rpc-method/types";
import React from "react";
import { Query } from "react-apollo";
import { VerticalTableRender } from "../common/vertical-table";
import { GetActionDetailsResponse } from "../pages/action-detail-page";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";

const ActionFeeRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <Query
      query={GET_ACTION_DETAILS_BY_HASH}
      variables={{ actionHash: value, checkingPending: true }}
    >
      {({ data }: GetActionDetailsResponse) => {
        if (!data) {
          return null;
        }
        const { gasPrice = "0" } =
          get<IActionCore>(data, "action.actionInfo.0.action.core") || {};
        const { gasConsumed = 0 } =
          get<IReceipt>(data, "receipt.receiptInfo.receipt") || {};
        return `${fromRau(`${gasConsumed * Number(gasPrice)}`, "Iotx")}`;
      }}
    </Query>
  );
};

export { ActionFeeRenderer };
