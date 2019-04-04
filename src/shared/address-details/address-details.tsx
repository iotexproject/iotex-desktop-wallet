// @ts-ignore
import Button from "antd/lib/button";
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Tooltip from "antd/lib/tooltip";
import { get } from "dottie";
// @ts-ignore
import * as utils from "iotex-antenna/lib/account/utils";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import * as copy from "text-to-clipboard";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACCOUNT } from "../queries";
import { ActionTable } from "./action-table";

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

type State = {
  trigger: "hover" | "focus" | "click" | "contextMenu" | undefined;
  title: string;
  copied: string;
};

class AddressDetailsInner extends PureComponent<Props, State> {
  public state: State = {
    trigger: "hover",
    title: "Copy address to clipboard",
    copied: ""
  };

  public copyToAddress = (address: string) => {
    copy.copyCB(address || "");
    this.setState({
      trigger: "click",
      title: "Copied",
      copied: "copied"
    });
  };
  public renderCopy(address: string): JSX.Element {
    return (
      <Tooltip
        placement="top"
        title={this.state.title}
        trigger={this.state.trigger}
      >
        <Button
          className={this.state.copied}
          shape="circle"
          icon="copy"
          onClick={() => this.copyToAddress(address)}
        />
      </Tooltip>
    );
  }
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
            if (error && String(error).indexOf("NOT_FOUND") === -1) {
              notification.error({
                message: "Error",
                description: `failed to get account: ${error}`,
                duration: 5
              });
            }
            if (data && data.getAccount && data.getAccount.accountMeta) {
              addressInfo = data.getAccount.accountMeta;
            }
            return (
              <SpinPreloader spinning={loading}>
                <div className="address-top">
                  <PageTitle>
                    <Icon type="wallet" /> Address:
                    <span>
                      {" "}
                      {(addressInfo && addressInfo.address) || address}{" "}
                    </span>
                    {this.renderCopy(
                      (addressInfo && addressInfo.address) || address
                    )}
                  </PageTitle>
                  <Divider orientation="left">Overview</Divider>
                  <div className="overview-list">
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="money-collect" />
                      </div>
                      <div className={"name"}>balance</div>
                      <div className={"info"}>{`${(+utils.fromRau(
                        String((addressInfo && addressInfo.balance) || 0),
                        "IOTX"
                      )).toFixed(4)} IOTX`}</div>
                    </div>
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="border" />
                      </div>
                      <div className={"name"}>nonce</div>
                      <div className={"info"}>
                        {(addressInfo && addressInfo.nonce) || 0}
                      </div>
                    </div>
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="project" />
                      </div>
                      <div className={"name"}>pendingNonce</div>
                      <div className={"info"}>
                        {(addressInfo && addressInfo.pendingNonce) || 0}
                      </div>
                    </div>
                  </div>
                </div>
                <Divider orientation="left">Actions</Divider>
                <ActionTable
                  totalActions={get(data, "getAccount.accountMeta.numActions")}
                  getVariable={({ current, pageSize }) => {
                    const start = (current - 1) * pageSize;
                    return {
                      byAddr: {
                        address,
                        start: start < 0 ? 0 : start,
                        count: pageSize
                      }
                    };
                  }}
                />
              </SpinPreloader>
            );
          }}
        </Query>
      </ContentPadding>
    );
  }
}

export const AddressDetails = withRouter(AddressDetailsInner);
