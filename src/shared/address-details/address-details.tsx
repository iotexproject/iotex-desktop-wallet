// @ts-ignore
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import { get } from "dottie";
// @ts-ignore
import * as utils from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { PageTitle } from "../common/page-title";
import { Sections } from "../common/sections";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACCOUNT } from "../queries";
import { ActionTable } from "./action-table";

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class AddressDetailsInner extends PureComponent<Props> {
  private renderItem(icon: string, name: string, info: string): JSX.Element {
    return (
      <div className={"item"}>
        <div className={"icon"}>
          <Icon type={icon} />
        </div>
        <div className={"name"}>{name}</div>
        <div className={"info"}>{info}</div>
      </div>
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
        <Helmet title={`IoTeX ${t("address.address")} ${address}`} />
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
            const copyAddress = (addressInfo && addressInfo.address) || address;
            return (
              <SpinPreloader spinning={loading}>
                <div className="address-top">
                  <PageTitle>
                    <Icon type="wallet" /> {t("address.address")}:
                    <span>
                      {" "}
                      {(addressInfo && addressInfo.address) || address}{" "}
                    </span>
                    <CopyButtonClipboardComponent text={copyAddress} />
                  </PageTitle>
                  <Sections>
                    <Divider orientation="left">{t("title.overview")}</Divider>
                    <div className="overview-list">
                      {this.renderItem(
                        "money-collect",
                        "balance",
                        `${(+utils.fromRau(
                          String((addressInfo && addressInfo.balance) || 0),
                          "IOTX"
                        )).toFixed(4)} IOTX`
                      )}
                      {this.renderItem(
                        "border",
                        "nonce",
                        ((addressInfo && addressInfo.nonce) || 0).toString()
                      )}
                      {this.renderItem(
                        "project",
                        "pendingNonce",
                        (
                          (addressInfo && addressInfo.pendingNonce) ||
                          0
                        ).toString()
                      )}
                    </div>
                  </Sections>
                </div>
                <Sections>
                  <Divider orientation="left">
                    {t("action.actionsList")}
                  </Divider>
                  <ActionTable
                    totalActions={get(
                      data,
                      "getAccount.accountMeta.numActions"
                    )}
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
                </Sections>
              </SpinPreloader>
            );
          }}
        </Query>
      </ContentPadding>
    );
  }
}

export const AddressDetails = withRouter(AddressDetailsInner);
