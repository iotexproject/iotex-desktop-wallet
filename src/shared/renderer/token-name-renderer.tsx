import React from "react";
import { Query, QueryResult } from "react-apollo";
import { VerticalTableRender } from "../common/vertical-table";
import { GET_ADDRESS_META } from "../queries";

const TokenNameRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <Query
      query={GET_ADDRESS_META}
      variables={{ address: value }}
      errorPolicy="ignore"
    >
      {({
        data,
        error,
        loading
      }: QueryResult<{ addressMeta: { name: string } }>) => {
        if (error || loading || !data) {
          return null;
        }
        return `${(data.addressMeta && data.addressMeta.name) || ""}`;
      }}
    </Query>
  );
};

export { TokenNameRenderer };
