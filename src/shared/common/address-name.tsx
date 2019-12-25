import { get } from "dottie";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { GET_ADDRESS_META } from "../queries";
import { LinkButton } from "./buttons";

const AddressName: React.FC<{ address: string }> = ({ address }) => {
  return (
    <Query
      query={GET_ADDRESS_META}
      variables={{ address }}
      errorPolicy="ignore"
    >
      {({ data, error }: QueryResult<{ name: string }>) => {
        if (error) {
          return (
            <LinkButton href={`/address/${address}`}>{address}</LinkButton>
          );
        }
        const { name = address } = get(data || {}, "addressMeta") || {};
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
