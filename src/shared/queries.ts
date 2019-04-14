import gql from "graphql-tag";

const FULL_ACTION_INFO = `
  actionInfo {
    actHash
    blkHash
    action {
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
        startSubChain{
          chainID
          securityDeposit
          operationDeposit
          startHeight
          parentHeightOffset
        }
        stopSubChain {
          chainID
          stopHeight
          subChainAddress
        }
        putBlock{
          subChainAddress
          height
          roots{
            name
            value
          }
        }
        createDeposit{
          chainID
          amount
          recipient
        }
        settleDeposit{
          amount
          recipient
          index
        }
        createPlumChain{
          TBD
        }
        terminatePlumChain{
          subChainAddress
        }
        plumPutBlock{
          subChainAddress
          height
          roots
        }
        plumCreateDeposit{
          subChainAddress
          amount
          recipient
        }
        plumStartExit{
          subChainAddress
          previousTransfer
          previousTransferBlockProof
          previousTransferBlockHeight
          exitTransfer
          exitTransferBlockProof
          exitTransferBlockHeight
        }
        plumChallengeExit{
          subChainAddress
          coinID
          challengeTransfer
          challengeTransferBlockProof
          challengeTransferBlockHeight
        }
        plumResponseChallengeExit{
          subChainAddress
          coinID
          challengeTransfer
          responseTransfer
          responseTransferBlockProof
          previousTransferBlockHeight
        }
        plumFinalizeExit{
          subChainAddress
          coinID
        }
        plumSettleDeposit{
          coinID
        }
        plumTransfer{
          coinID
          denomination
          owner
          recipient
        }
        depositToRewardingFund{
          amount
          data
        }
        claimFromRewardingFund{
          amount
          data
        }
        grantReward{
          type
        }
        putPollResult{
          height
          candidates{
            candidates{
              address
              votes
              pubKey
              rewardAddress
            }
          }
        }
      }
      signature
      senderPubKey
    }
  }
`;

export const GET_CHAIN_META = gql`
  query {
    chainMeta {
      height
      numActions
      tps
      epoch {
        num
        height
      }
    }
  }
`;

export const GET_TILE_DATA = gql`
  query getTileData($byIndex: GetBlockMetasByIndexRequest!) {
    fetchCoinPrice {
      priceUsd
      marketCapUsd
    }
    getBlockMetas(byIndex: $byIndex) {
      blkMetas {
        producerAddress
        hash
      }
    }
  }
`;

export const GET_LATEST_HEIGHT = gql`
  query {
    chainMeta {
      height
    }
  }
`;

export const GET_ACCOUNT = gql`
  query($address: String!) {
    getAccount(address: $address) {
      accountMeta {
        address
        balance
        nonce
        pendingNonce
        numActions
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
      receiptInfo {
        receipt {
          status
          blkHeight
          gasConsumed
          contractAddress
          logs {
            contractAddress
            topics
            data
            blkHeight
            actHash
            index
          }
        }
        blkHash
      }
    }
  }
`;

export const GET_BLOCK_METAS_BY_INDEX = gql`
  query getBlockMetas($byIndex: GetBlockMetasByIndexRequest!) {
    getBlockMetas(byIndex: $byIndex) {
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

export const GET_BLOCK_METAS_BY_HASH = gql`
  query getBlockMetas($byHash: GetBlockMetasByHashRequest) {
    getBlockMetas(byHash: $byHash) {
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

export const GET_BLOCK_METAS = gql`
  query getBlockMetas(
    $byIndex: GetBlockMetasByIndexRequest
    $byHash: GetBlockMetasByHashRequest
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
  query getActions($byAddr: GetActionsByAddressRequest, $byHash: GetActionsByHashRequest, $byBlk: GetActionsByBlockRequest) {
    getActions(byAddr: $byAddr, byHash: $byHash, byBlk: $byBlk) {
      ${FULL_ACTION_INFO}
    }
  }
`;

export const GET_ACTIONS_BY_HASH = gql`
  query getActions($byHash: GetActionsByHashRequest) {
    getActions(byHash: $byHash) {
      ${FULL_ACTION_INFO}
    }
  }
`;

export const GET_ACTIONS_BY_INDEX = gql`
  query getActions($byIndex: GetActionsByIndexRequest) {
    getActions(byIndex: $byIndex) {
      ${FULL_ACTION_INFO}
    }
  }
`;

export const GET_ACTIONS_BY_BLK = gql`
  query getActions($byBlk: GetActionsByBlockRequest) {
    getActions(byBlk: $byBlk) {
      ${FULL_ACTION_INFO}
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

export const SEND_ACTION = gql`
  query sendAction($action: ActionInput!) {
    sendAction(action: $action) {
      TBD
    }
  }
`;

export const ESTIMATE_GAS_FOR_ACTION = gql`
  query estimateGasForAction($action: ActionInput!) {
    estimateGasForAction(action: $action) {
      gas
    }
  }
`;

export const FETCH_VERSION_INFO = gql`
  query {
    fetchVersionInfo {
      explorerVersion
      iotexCoreVersion
    }
  }
`;
