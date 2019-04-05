import notification from "antd/lib/notification";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { SpinPreloader } from "./common/spin-preloader";
import { ContentPadding } from "./common/styles/style-padding";
import {
  ESTIMATE_GAS_FOR_ACTION,
  GET_ACCOUNT,
  GET_ACTIONS,
  GET_ACTIONS_BY_HASH,
  GET_ACTIONS_BY_INDEX,
  GET_BLOCK_METAS_BY_HASH,
  GET_BLOCK_METAS_BY_INDEX,
  GET_RECEIPT_BY_ACTION,
  READ_CONTRACT,
  SEND_ACTION,
  SUGGEST_GAS_PRICE
} from "./queries";

import Antenna from "iotex-antenna";

const antenna = new Antenna("http://localhost:4004/iotex-core-proxy");

type PathParamsType = {};

type RequestProp = {
  query: object;
  variables: object;
  name: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

export const action = {
  core: {
    version: 1,
    nonce: "0",
    gasLimit: "0",
    gasPrice: "0",
    transfer: null,
    execution: null,
    depositToRewardingFund: null,
    claimFromRewardingFund: null,
    grantReward: {
      type: "BlockReward"
    }
  },
  senderPubKey:
    "044e18fc7840341bd749acc4151d47b00e2f57494d735f20de631f8dfb2eed237748b54cf52aed961afa051e53e027a4cdf7ffed7b888a4e8f0be0bc083af07116",
  signature:
    "c8b2dcda49898b24dd1474711bdf1fe026237844698dc27cb0a372ebda6caf853da9e9485d1ba84124f34242e87830f44e5fbd2aefce7d17ca077d610ee0515300"
};

class TestAntennaInner extends PureComponent<Props> {
  public requests: Array<RequestProp> = [
    {
      query: ESTIMATE_GAS_FOR_ACTION,
      variables: { action },
      name: "ESTIMATE_GAS_FOR_ACTION"
    },
    {
      query: SEND_ACTION,
      variables: { action },
      name: "SEND_ACTION"
    },
    {
      name: "READ_CONTRACT",
      query: READ_CONTRACT,
      variables: { action }
    },
    {
      name: "GET_ACTIONS_BY_HASH",
      query: GET_ACTIONS_BY_HASH,
      variables: {
        byHash: {
          actionHash:
            "7d9573833bc1c35b6d13ee920c63f3692a6c50c9e65811a84930432eec02ba10",
          checkingPending: false
        }
      }
    },
    {
      name: "GET_ACTIONS",
      query: GET_ACTIONS,
      variables: {
        byAddr: {
          address: "io1dg65erd07hrvyme0493f2kqj2utuvpyf6jeuhd",
          start: 1,
          count: 10
        }
      }
    },
    {
      name: "GET_ACTIONS_BY_INDEX",
      query: GET_ACTIONS_BY_INDEX,
      variables: { byIndex: { start: 0, count: 10 } }
    },
    {
      query: GET_BLOCK_METAS_BY_INDEX,
      variables: {
        byIndex: { start: 1, count: 10 }
      },
      name: "GET_BLOCK_METAS_BY_INDEX"
    },

    {
      query: GET_BLOCK_METAS_BY_HASH,
      variables: {
        byHash: {
          blkHash:
            "3199b813a058af5886660af86360ceb9d9318c6f14857017dad674a6cad3993d"
        }
      },
      name: "GET_BLOCK_METAS_BY_HASH"
    },
    {
      query: GET_RECEIPT_BY_ACTION,
      variables: {
        actionHash:
          "f94c3b5976ca3543bb84a1e7c1281913746250ed1afdaa2fe06e9969189dd66b"
      },
      name: "GET_RECEIPT_BY_ACTION"
    },
    { query: SUGGEST_GAS_PRICE, variables: {}, name: "SUGGEST_GAS_PRICE" },
    {
      query: GET_ACCOUNT,
      variables: {
        address: "io1qypqqqqqjntmcu9d60u4w465t33l2et6drtaqyrqwm0gma"
      },
      name: "GET_ACCOUNT"
    }
  ];

  public componentDidMount(): void {
    antenna.iotx
      .getAccount({
        address: "io126xcrjhtp27end76ac9nmx6px2072c3vgz6suw"
      })
      .then((resp: any) => {
        console.log("resp", resp);
      });
  }

  public render(): JSX.Element {
    const tmp = [
      {
        name: "GET_ACTIONS_BY_INDEX",
        query: GET_ACTIONS_BY_INDEX,
        variables: { byIndex: { start: 0, count: 10 } }
      },
      {
        query: ESTIMATE_GAS_FOR_ACTION,
        variables: { action },
        name: "ESTIMATE_GAS_FOR_ACTION"
      }
    ];

    return (
      <ContentPadding>
        {tmp.map(({ query, variables, name }: RequestProp, key: number) => (
          // @ts-ignore
          <Query key={key} query={query} variables={variables}>
            {({ loading, error, data }) => {
              let color = "blue";
              if (error) {
                notification.error({
                  message: "Error",
                  description: `failed to query  ${name}: ${error}`,
                  duration: 3
                });
                window.console.log(error);
                color = "red";
              }
              return (
                <SpinPreloader spinning={loading}>
                  <div>
                    <h3>{name}</h3>
                    <pre style={{ color }}>
                      {error
                        ? JSON.stringify(error, null, 2)
                        : JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </SpinPreloader>
              );
            }}
          </Query>
        ))}
      </ContentPadding>
    );
  }
}

export const mock = [
  { execution: { amount: 1001, contract: "contractaaa", data: "huhuu" } },
  {
    transfer: { amount: 1001, recipient: "recipient bb", payload: "payload bb" }
  },
  {
    startSubChain: {
      chainID: 1001,
      securityDeposit: "securityDeposit",
      operationDeposit: "operationDeposit",
      startHeight: 2002,
      parentHeightOffset: 4004
    }
  },
  {
    stopSubChain: {
      chainID: 2002,
      stopHeight: 123,
      subChainAddress: "subChainAddress aa"
    }
  },
  {
    putBlock: {
      height: 4000,
      subChainAddress: "subChainAddress bb",
      roots: [{ name: "tname", value: "tvalue" }]
    }
  },
  { createDeposit: { amount: 1001, chainID: 3003, recipient: "huhuu" } },
  { settleDeposit: { amount: 1001, index: 3003, recipient: "huhuu" } },

  { createPlumChain: { amount: 1001, contract: "contractaaa", data: "huhuu" } },
  { terminatePlumChain: { subChainAddress: "huhuu" } },
  {
    plumPutBlock: {
      height: 4000,
      subChainAddress: "subChainAddress bb",
      roots: [{ name: "tname", value: "tvalue" }]
    }
  },
  {
    plumCreateDeposit: {
      amount: 4000,
      subChainAddress: "subChainAddress bb",
      recipient: "recipient"
    }
  },
  {
    plumStartExit: {
      subChainAddress: "subChainAddress",
      previousTransfer: "previousTransfer",
      previousTransferBlockProof: "previousTransferBlockProof",
      previousTransferBlockHeight: 1001,
      exitTransfer: "exitTransfer",
      exitTransferBlockProof: "exitTransferBlockProof",
      exitTransferBlockHeight: 1001
    }
  },
  {
    plumChallengeExit: {
      subChainAddress: "subChainAddress",
      coinID: 1001,
      challengeTransfer: "challengeTransfer",
      challengeTransferBlockProof: "challengeTransferBlockProof",
      challengeTransferBlockHeight: 1001
    }
  },
  {
    plumResponseChallengeExit: {
      subChainAddress: "subChainAddress",
      coinID: 1001,
      challengeTransfer: "challengeTransfer",
      responseTransfer: "responseTransfer",
      responseTransferBlockProof: "responseTransferBlockProof",
      previousTransferBlockHeight: 1001
    }
  },
  {
    plumFinalizeExit: {
      subChainAddress: "subChainAddress",
      coinID: 1001
    }
  },
  {
    plumFinalizeExit: {
      coinID: 1001
    }
  },
  {
    plumTransfer: {
      coinID: 1001,
      denomination: "denomination",
      owner: "owner",
      recipient: "recipient"
    }
  },
  {
    putPollResult: {
      height: "huhuu",
      candidates: {
        candidates: [
          {
            address: "address",
            votes: "votes",
            pubKey: "pubKey",
            rewardAddress: "rewardAddress"
          }
        ]
      }
    }
  }
];

export function loadMockActions(
  actions: [object],
  inputIndex: number = -1
): void {
  // @ts-ignore
  actions.forEach((value: object, index: number) => {
    // @ts-ignore
    const {
      version,
      nonce,
      gasLimit,
      gasPrice
      // @ts-ignore
    } = value.action.core;

    const mockIndex = inputIndex >= 0 ? inputIndex : index % mock.length;
    const object = mock[mockIndex];
    // @ts-ignore
    value.action.core = {
      version,
      nonce,
      gasLimit,
      gasPrice,
      ...object
    };
  });
}

export const DebugResolver = withRouter(TestAntennaInner);
