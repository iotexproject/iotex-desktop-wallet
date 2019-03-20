import { notification } from "antd";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
// @ts-ignore
import { SpinPreloader } from "./common/spin-preloader";
import { ContentPadding } from "./common/styles/style-padding";
import {
  GET_ACCOUNT,
  GET_ACTIONS,
  GET_BLOCK_METAS,
  GET_RECEIPT_BY_ACTION,
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
      query: GET_ACTIONS,
      variables: {
        byIndex: { start: 1, count: 10 },
        byHash: {
          actionHash:
            "7d9573833bc1c35b6d13ee920c63f3692a6c50c9e65811a84930432eec02ba10",
          checkingPending: false
        },
        byAddr: {
          address: "io1qypqqqqqjntmcu9d60u4w465t33l2et6drtaqyrqwm0gma",
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
      },
      name: "GET_ACTIONS"
    },
    {
      query: GET_BLOCK_METAS,
      variables: {
        byIndex: { start: 1, count: 10 },
        byHash: {
          blkHash:
            "7d9573833bc1c35b6d13ee920c63f3692a6c50c9e65811a84930432eec02ba10"
        }
      },
      name: "GET_BLOCK_METAS"
    },
    {
      query: GET_RECEIPT_BY_ACTION,
      variables: {
        actionHash:
          "200778fb0a5d3e30ad86d836cd6d6333b654cd0aadfab42e3fb618499d3756c2"
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
                        {error ? JSON.stringify(error) : JSON.stringify(data)}
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
