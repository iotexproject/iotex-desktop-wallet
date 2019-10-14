import { get } from "dottie";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { GET_BP_CANDIDATE } from "../queries";
import { webBpApolloClient } from "./apollo-client";
import { LinkButton } from "./buttons";

const AddressName: React.FC<{ address: string }> = ({ address }) => {
  return (
    <Query
      query={GET_BP_CANDIDATE}
      variables={{ ioOperatorAddress: address }}
      client={webBpApolloClient}
      errorPolicy="ignore"
    >
      {({ data }: QueryResult<{}>) => {
        const { registeredName = address } =
          get(data || {}, "bpCandidate") || {};
        return (
          <LinkButton href={`/address/${address}`}>
            {registeredName || address}
          </LinkButton>
        );
      }}
    </Query>
  );
};

export { AddressName };
