import gql from "graphql-tag";

export const GET_ACCOUNT = gql`
  query($address: String!) {
    getAccount(address: $address) {
      accountMeta {
        address
        balance
        nonce
        pendingNonce
      }
    }
  }
`;
