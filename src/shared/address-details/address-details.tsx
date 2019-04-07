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
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACCOUNT } from "../queries";
import { ActionTable } from "./action-table";

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
                  <Divider orientation="left">{t("title.overview")}</Divider>
                  <div className="overview-list">
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="wallet" />
                      </div>
                      <div className={"name"}>{t("address.balance")}</div>
                      <div className={"info"}>{`${(+utils.fromRau(
                        String((addressInfo && addressInfo.balance) || 0),
                        "IOTX"
                      )).toFixed(4)} IOTX`}</div>
                    </div>
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="border" />
                      </div>
                      <div className={"name"}>{t("address.nonce")}</div>
                      <div className={"info"}>
                        {(addressInfo && addressInfo.nonce) || 0}
                      </div>
                    </div>
                    <div className={"item"}>
                      <div className={"icon"}>
                        <Icon type="project" />
                      </div>
                      <div className={"name"}>{t("address.pendingNonce")}</div>
                      <div className={"info"}>
                        {(addressInfo && addressInfo.pendingNonce) || 0}
                      </div>
                    </div>
                  </div>
                </div>
                <Divider style={{ marginTop: 60 }} orientation="left">
                  {t("title.actionList")}
                </Divider>
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
