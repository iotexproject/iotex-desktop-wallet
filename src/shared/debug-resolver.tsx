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

type PathParamsType = {};

type RequestProp = {
  query: object;
  variables: object;
  name: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

const action = {
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

export const DebugResolver = withRouter(TestAntennaInner);
