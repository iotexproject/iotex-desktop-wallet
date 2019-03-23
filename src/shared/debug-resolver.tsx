import notification from "antd/lib/notification";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { SpinPreloader } from "./common/spin-preloader";
import { ContentPadding } from "./common/styles/style-padding";
import {
  GET_ACCOUNT,
  GET_ACTIONS,
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

class TestAntennaInner extends PureComponent<Props> {
  public requests: Array<RequestProp> = [
    {
      query: SEND_ACTION,
      variables: {
        action: {
          core: {
            version: 1,
            nonce: "",
            gasLimit: "",
            gasPrice: "100",
            transfer: {
              amount: "100",
              recipient: "",
              payload: ""
            },
            execution: {
              amount: "100",
              contract: "",
              data: ""
            }
          },
          senderPubKey: "",
          signature: ""
        }
      },
      name: "SEND_ACTION"
    },
    {
      name: "READ_CONTRACT",
      query: READ_CONTRACT,
      variables: {
        action: {
          core: {
            version: 1,
            nonce: "",
            gasLimit: "",
            gasPrice: "100",
            transfer: {
              amount: "100",
              recipient: "",
              payload: ""
            },
            execution: {
              amount: "100",
              contract: "",
              data: ""
            }
          },
          senderPubKey: "",
          signature: ""
        }
      }
    },
    {
      name: "GET_ACTIONS",
      query: GET_ACTIONS,
      variables: {
        byIndex: { start: 1, count: 10 },
        byHash: {
          actionHash:
            "7d9573833bc1c35b6d13ee920c63f3692a6c50c9e65811a84930432eec02ba10",
          checkingPending: false
        },
        byAddr: {
          address: "io1dg65erd07hrvyme0493f2kqj2utuvpyf6jeuhd",
          start: 1,
          count: 10
        },
        unconfirmedByAddr: {
          address: "io1qypqqqqqjntmcu9d60u4w465t33l2et6drtaqyrqwm0gma",
          start: 1,
          count: 10
        },
        byBlk: {
          blkHash:
            "7d9573833bc1c35b6d13ee920c63f3692a6c50c9e65811a84930432eec02ba10",
          start: 1,
          count: 10
        }
      }
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
    return (
      <ContentPadding>
        {this.requests.map(
          ({ query, variables, name }: RequestProp, key: number) => (
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
          )
        )}
      </ContentPadding>
    );
  }
}

export const DebugResolver = withRouter(TestAntennaInner);
