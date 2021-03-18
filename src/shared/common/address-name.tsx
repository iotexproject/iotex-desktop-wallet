import { get } from "dottie";
import { validateAddress } from "iotex-antenna/lib/account/utils";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { GET_ADDRESS_META } from "../queries";
import { LinkButton } from "./buttons";

const AddressName: React.FC<{ address: string }> = ({ address }) => {
  if (!validateAddress(address)) {
    return <LinkButton>{address}</LinkButton>;
  }
  return (
    <Query
      query={GET_ADDRESS_META}
      variables={{ address }}
      errorPolicy="ignore"
    >
      {({ data }: QueryResult<{ name: string }>) => {
        const { name = address } = get(data || {}, "addressMeta") || {};
        if (!name) {
          return (
            <LinkButton href={`/address/${address}`}>{address}</LinkButton>
          );
        }
        return (
          <LinkButton href={`/address/${address}`}>
            {name || address}
          </LinkButton>
        );
      }}
    </Query>
  );
};

export { AddressName };
