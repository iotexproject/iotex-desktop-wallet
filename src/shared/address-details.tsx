import { Divider, Icon, notification } from "antd";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
// @ts-ignore
import { SpinPreloader } from "./common/spin-preloader";
import { ContentPadding } from "./common/styles/style-padding";
import { GET_ACCOUNT, GET_ACTIONS } from "./queries";

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class AddressDetailsInner extends PureComponent<Props> {
  public render(): JSX.Element {
    const {
      match: {
        params: { address }
      }
    } = this.props;
    let addressInfo: {
      address: string;
      balance: string;
      nonce: string;
      pendingNonce: string;
      __typename: string;
    };
    return (
      <ContentPadding>
        <Query query={GET_ACCOUNT} variables={{ address }}>
          {({ loading, error, data }) => {
            if (error) {
              notification.error({
                message: "Error",
                description: `failed to get account: ${error}`,
                duration: 3
              });
              return null;
            }
            if (data.getAccount && data.getAccount.accountMeta) {
              addressInfo = data.getAccount.accountMeta;
            }
            return (
              <SpinPreloader spinning={loading}>
                <div className="address-top">
                  <h3 className={"title"}>
                    <Icon type="wallet" />
                    Address:
                    <span>{addressInfo.address}</span>
                  </h3>
                  <Divider orientation="left">Overview</Divider>
                  <div className="overview-list">
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="money-collect" />
                      </div>
                      <div className={"name"}>balance</div>
                      <div className={"info"}>{addressInfo.balance}</div>
                    </div>
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="border" />
                      </div>
                      <div className={"name"}>nonce</div>
                      <div className={"info"}>{addressInfo.nonce}</div>
                    </div>
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="project" />
                      </div>
                      <div className={"name"}>pendingNonce</div>
                      <div className={"info"}>{addressInfo.pendingNonce}</div>
                    </div>
                  </div>
                  <Divider orientation="left">Transactions</Divider>
                  {/*<div>{JSON.stringify(data, null, 2)}</div>*/}
                </div>
              </SpinPreloader>
            );
          }}
        </Query>

        <Query
          query={GET_ACTIONS}
          variables={{ byAddr: { address: address, start: 0, count: 20 } }}
        >
          {({ loading, error, data }) => {
            if (error) {
              notification.error({
                message: "Error",
                description: `failed to get actions: ${error}`,
                duration: 3
              });
              return null;
            }
            return (
              <SpinPreloader spinning={loading}>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </SpinPreloader>
            );
          }}
        </Query>
      </ContentPadding>
    );
  }
}

export const AddressDetails = withRouter(AddressDetailsInner);
