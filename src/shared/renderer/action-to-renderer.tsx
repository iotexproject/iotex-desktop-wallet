import notification from "antd/lib/notification";
import { get } from "dottie";
import { IReceipt } from "iotex-antenna/lib/rpc-method/types";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query } from "react-apollo";
import { ActionInfo } from "../../api-gateway/resolvers/antenna-types";
import { AddressName } from "../common/address-name";
import { LinkButton } from "../common/buttons";
import { VerticalTableRender } from "../common/vertical-table";
import { GetActionDetailsResponse } from "../pages/action-detail-page";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";

const ActionToRenderer: VerticalTableRender<ActionInfo> = ({ value }) => {
  return (
    <Query
      query={GET_ACTION_DETAILS_BY_HASH}
      variables={{ actionHash: value.actHash, checkingPending: true }}
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

        if (
          value.action.core &&
          value.action.core.execution &&
          !value.action.core.execution.contract
        ) {
          return (
            <span
              className="ellipsis-text"
              style={{ maxWidth: "10vw", minWidth: 100 }}
            >
              <LinkButton href={`/address/${contractAddress}`}>
                {t("action.method.contract_creation")}
              </LinkButton>
            </span>
          );
        }

        return contractAddress !== "-" ? (
          <span
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100 }}
          >
            <AddressName address={contractAddress} />
          </span>
        ) : (
          "-"
        );
      }}
    </Query>
  );
};

export { ActionToRenderer };
