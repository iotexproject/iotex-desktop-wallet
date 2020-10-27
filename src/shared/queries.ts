import gql from "graphql-tag";

const FULL_ACTION_INFO = `
  actionInfo {
    actHash
    blkHash
    timestamp {
      seconds
    }
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
          height
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
        stakeCreate{
          candidateName
          stakedAmount
          stakedDuration
          autoStake
          payload
        }
        stakeUnstake{
          bucketIndex
          payload
        }
        stakeWithdraw{
          bucketIndex
          payload
        }
        stakeAddDeposit{
          amount
          bucketIndex
          payload
        }
        stakeRestake{
          bucketIndex
          stakedDuration
          autoStake
          payload
        }
        stakeChangeCandidate{
          bucketIndex
          candidateName
          payload
        }
        stakeTransferOwnership{
          bucketIndex
          voterAddress
          payload
        }
        candidateRegister{
          candidate{
            name
            operatorAddress
            rewardAddress
          }
          ownerAddress
          stakedAmount
          stakedDuration
          autoStake
          payload
        }
        candidateUpdate{
          name
          operatorAddress
          rewardAddress
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
          actHash
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
        timestamp {
          seconds
        }
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
        timestamp {
          seconds
        }
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
        timestamp {
          seconds
        }
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
  query getActions($byIndex:GetActionsByIndexRequest, $byAddr: GetActionsByAddressRequest, $byHash: GetActionsByHashRequest, $byBlk: GetActionsByBlockRequest) {
    getActions(byAddr: $byAddr, byHash: $byHash, byBlk: $byBlk, byIndex: $byIndex) {
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

export const GET_ACTION_DETAILS_BY_HASH = gql`
  query getActions($actionHash: String!, $checkingPending:Boolean!) {
    action:getActions(byHash: {
      actionHash: $actionHash,
      checkingPending: $checkingPending
    }) {
      ${FULL_ACTION_INFO}
    }
    receipt:getReceiptByAction(actionHash: $actionHash) {
      receiptInfo {
        receipt {
          status
          blkHeight
          actHash
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

export const GET_ACTION_DETAILS_STATUS_BY_HASH = gql`
  query getActions($actionHash: String!) {
    receipt: getReceiptByAction(actionHash: $actionHash) {
      receiptInfo {
        receipt {
          status
        }
      }
    }
  }
`;

export const ACTION_EXISTS_BY_HASH = gql`
  query getActions($byHash: GetActionsByHashRequest) {
    getActions(byHash: $byHash) {
      actionInfo {
        actHash
      }
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

export const COMPILE_SOLIDITY = gql`
  query($source: String!, $version: String!) {
    compileSolidity(source: $source, version: $version) {
      name
      abi
      bytecode
    }
  }
`;
export const GET_SOLC_VERSIONS = gql`
  query {
    getSolcVersions {
      name
      version
    }
  }
`;

export const GET_ADDRESS_META = gql`
  query addressMeta($address: String!) {
    addressMeta(address: $address) {
      name
    }
  }
`;

export const GET_EPOCH_META = gql`
  query($epochNumber: Int!) {
    getEpochMeta(epochNumber: $epochNumber) {
      epochData {
        num
        height
        gravityChainStartHeight
      }
      totalBlocks
      blockProducersInfo {
        address
        votes
        active
        production
      }
    }
  }
`;

export const ADD_SUBSCRIPTION = gql`
  mutation addSubscription($email: String!) {
    addSubscription(email: $email) {
      isSubscribeSuccess
    }
  }
`;

export const GET_BP_STATS = gql`
  query stats {
    stats {
      height
      totalCandidates
      totalCandidatesHistory {
        ts
        count
      }
      totalVotedStakes
      totalVotedStakesHistory {
        ts
        count
      }
      totalVotes
      totalVotesHistory {
        ts
        count
      }
      nextEpoch
      currentEpochNumber
    }
    bpCandidates {
      productivity
      productivityBase
      category
    }
  }
`;

export const GET_ANALYTICS_TPS = gql`
  query chain {
    chain {
      mostRecentTPS(blockWindow: 8640)
    }
  }
`;

export const GET_ANALYTICS_CHAIN = gql`
  query chain {
    chain {
      mostRecentEpoch
      mostRecentBlockHeight
      numberOfActions {
        count
      }
    }
  }
`;

export const GET_ANALYTICS_BP_STATS = gql`
  query stats {
    chain {
      totalSupply
      totalCirculatingSupply
    }
  }
`;

export const GET_ANALYTICS_EVM_TRANSFERS = (hash: string) => {
  const query = `query {
    action {
      byHash(actHash: "${hash}") {
        evmTransfers {
          from
          to
          quantity
        }
      }
    }
  }`;
  return gql(query);
};

export const GET_ANALYTICS_ACTIONS_BY_DATES = ({
  startDate,
  endDate,
  skip,
  first
}: {
  startDate: Number;
  endDate: Number;
  skip: Number;
  first: Number;
}) => {
  const query = `query {
    action {
      byDates(startDate: ${startDate}, endDate: ${endDate}) {
        actions(pagination: { skip: ${skip}, first: ${first} }) {
          actHash
          blkHash
          timeStamp
          actType
          sender
          recipient
          amount
        }
        exist
        count
      }
    }
  }`;
  return gql(query);
};

export const GET_ADDRESS_DETAILS = gql`
  query($address: String!) {
    account: getAccount(address: $address) {
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

export const GET_ANALYTICS_XRC20_ACTIONS_BY_PAGE = gql`
  query($pagination: Pagination!) {
    xrc20 {
      data: byPage(pagination: $pagination) {
        exist
        xrc20 {
          contract
          hash
          timestamp
          from
          to
          quantity
        }
        count
      }
    }
  }
`;

export const GET_ANALYTICS_XRC721_ACTIONS_BY_PAGE = gql`
  query($pagination: Pagination!) {
    xrc721 {
      data: byPage(pagination: $pagination) {
        exist
        xrc721 {
          contract
          hash
          timestamp
          from
          to
          quantity
        }
        count
      }
    }
  }
`;

export const GET_ANALYTICS_XRC20_ACTIONS_BY_ADDRESS = gql`
  query($address: String!, $page: Int!, $numPerPage: Int!) {
    xrc20 {
      data: byAddress(address: $address, page: $page, numPerPage: $numPerPage) {
        exist
        xrc20 {
          contract
          hash
          timestamp
          from
          to
          quantity
        }
        count
      }
    }
  }
`;

export const GET_ANALYTICS_XRC20_ACTIONS_BY_CONTRACT = gql`
  query($address: String!, $page: Int!, $numPerPage: Int!) {
    xrc20 {
      data: byContractAddress(
        address: $address
        page: $page
        numPerPage: $numPerPage
      ) {
        exist
        xrc20 {
          contract
          hash
          timestamp
          from
          to
          quantity
        }
        count
      }
    }
  }
`;

export const GET_ANALYTICS_XRC721_ACTIONS_BY_CONTRACT = gql`
  query($address: String!, $page: Int!, $numPerPage: Int!) {
    xrc721 {
      data: byContractAddress(
        address: $address
        page: $page
        numPerPage: $numPerPage
      ) {
        exist
        xrc721 {
          contract
          hash
          timestamp
          from
          to
          quantity
        }
        count
      }
    }
  }
`;

export const GET_ANALYTICS_XRC721_ACTIONS_BY_ADDRESS = gql`
  query($address: String!, $page: Int!, $numPerPage: Int!) {
    xrc721 {
      data: byAddress(address: $address, page: $page, numPerPage: $numPerPage) {
        exist
        xrc721 {
          contract
          hash
          timestamp
          from
          to
          quantity
        }
        count
      }
    }
  }
`;

export const GET_ANALYTICS_CONTRACT_ACTIONS = gql`
  query contractActions($address: String!, $pagination: Pagination!) {
    action {
      evm: evmTransfersByAddress(address: $address) {
        count
        evmTransfers(pagination: $pagination) {
          from
          to
          quantity
          actHash
          blkHash
          timeStamp
        }
      }
    }
  }
`;

export const GET_ACTIONS_BY_BUCKET_INDEX = gql`
  query action($bucketIndex: Int!, $pagination: Pagination!) {
    action {
      byBucketIndex(bucketIndex: $bucketIndex) {
        count
        actions(pagination: $pagination) {
          actHash
          blkHash
          timeStamp
          actType
          sender
          recipient
          amount
          gasFee
        }
      }
    }
  }
`;

export const GET_ANALYTICS_CONTRACT_HOLDERS = gql`
  query tokenHolders($tokenAddress: String!, $skip: Int!, $first: Int!) {
    xrc20 {
      tokenHolderAddresses(tokenAddress: $tokenAddress) {
        addresses(pagination: { skip: $skip, first: $first })
        count
      }
    }
  }
`;

export const GET_ANALYTICS_XRC721_CONTRACT_HOLDERS = gql`
  query tokenHolders($tokenAddress: String!) {
    xrc721 {
      tokenHolderAddresses(tokenAddress: $tokenAddress) {
        addresses
        count
      }
    }
  }
`;

export const GET_ACCOUNT_DETAIL_BY_DETAIL = gql`
  query($adress: String) {
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

export const GET_TOP_HOLDERS = gql`
  query($endEpochNumber: Int!, $pagination: Pagination!) {
    topHolders(endEpochNumber: $endEpochNumber, pagination: $pagination) {
      address
      balance
    }
  }
`;

export const GET_XRC20_TOKENS = gql`
  query($pagination: Pagination!) {
    xrc20 {
      xrc20Addresses(pagination: $pagination) {
        exist
        count
        addresses
      }
    }
  }
`;

export const GET_XRC721_TOKENS = gql`
  query($pagination: Pagination!) {
    xrc721 {
      xrc721Addresses(pagination: $pagination) {
        exist
        count
        addresses
      }
    }
  }
`;

export const GET_TOKEN_ADDRESS_META = gql`
  query($address: String!) {
    addressMeta(address: $address) {
      name
    }
  }
`;

export const GET_ANALYTICS_ACTIONS_BY_TYPE = gql`
  query($type: String!, $pagination: Pagination!) {
    action {
      byType(type: $type) {
        count
        actions(pagination: $pagination) {
          actHash
          blkHash
          timeStamp
          actType
          sender
          recipient
          amount
          gasFee
        }
      }
    }
  }
`;
