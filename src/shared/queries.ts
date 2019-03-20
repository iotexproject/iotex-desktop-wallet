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

export const SUGGEST_GAS_PRICE = gql`
  query suggestGasPrice {
    suggestGasPrice {
      gasPrice
    }
  }
`;

export const GET_RECEIPT_BY_ACTION = gql`
  query($actionHash: String!) {
    getReceiptByAction(actionHash: $actionHash) {
      receipt {
        returnValue
        status
        actHash
        gasConsumed
        contractAddress
        logs {
          address
          topics
          data
          blockNumber
          txnHash
          index
        }
      }
    }
  }
`;

export const GET_BLOCK_METAS = gql`
  query getBlockMetas(
    $byIndex: GetBlockMetasByIndexRequest!
    $byHash: GetBlockMetasByHashRequest!
  ) {
    getBlockMetas(byIndex: $byIndex, byHash: $byHash) {
      blkMetas {
        hash
        height
        timestamp
        numActions
        producerAddress
        transferAmount
        txRoot
        receiptRoot
        deltaStateDigest
      }
    }
  }
`;

export const GET_ACTIONS = gql`
  query getActions($byAddr: GetActionsByAddressRequest) {
    getActions(byAddr: $byAddr) {
      actions {
        core {
          version
          nonce
          gasLimit
          gasPrice
          transfer {
            amount
            recipient
            payload
          }
          execution {
            amount
            contract
            data
          }
        }
        signature
        senderPubKey
      }
    }
  }
`;

export const READ_CONTRACT = gql`
  query readContract($action: ActionInput!) {
    readContract(action: $action) {
      data
    }
  }
`;
