// @ts-ignore
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
// @ts-ignore
import * as utils from "iotex-antenna/lib/account/utils";
import isBrowser from "is-browser";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import {
  AccountMeta,
  GetAccountResponse
} from "../../api-gateway/resolvers/antenna-types";
import { Token } from "../../erc20/token";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { PageTitle } from "../common/page-title";
import { ShowQrcodeButton } from "../common/show-qrcode-button";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACCOUNT } from "../queries";
import { ActionTable } from "./action-table";

type PathParamsType = {
  address: string;
};

type State = {
  vitaInfo: {
    balance: number;
    name: string;
  };
  xrc20Info: {
    balance: number;
    name: string;
  };
};

type Props = RouteComponentProps<PathParamsType> & {};

class AddressDetailsInner extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      vitaInfo: {
        balance: 0,
        name: ""
      },
      xrc20Info: {
        balance: 0,
        name: ""
      }
    };
  }

  public getDefaultNetworkTokens = async (
    defaultTokens: Array<string>
  ): Promise<Array<string>> => {
    // Check for default tokens supported.
    const supportStatus = await Promise.all(
      defaultTokens.map(token => Token.getToken(token).checkValid())
    );
    return defaultTokens.filter((_, i) => supportStatus[i]);
  };

  public async componentDidMount(): Promise<void> {
    const {
      match: {
        params: { address }
      }
    } = this.props;
    let defaultERC20Tokens =
      isBrowser && JsonGlobal("state").base.defaultERC20Tokens;

    let vitaTokens = isBrowser && JsonGlobal("state").base.vitaTokens;

    defaultERC20Tokens = await this.getDefaultNetworkTokens(defaultERC20Tokens);
    vitaTokens = await this.getDefaultNetworkTokens(vitaTokens);
    const xrc20Info = { ...this.state.xrc20Info };
    const vitaInfo = { ...this.state.vitaInfo };

    if (defaultERC20Tokens.length > 0) {
      const newXrc20Info = await Token.getToken(defaultERC20Tokens[0]).getInfo(
        address
      );
      xrc20Info.name = newXrc20Info.name;
      xrc20Info.balance = newXrc20Info.balance.toNumber();
    }

    if (vitaTokens.length > 0) {
      const newVitaInfo = await Token.getToken(vitaTokens[0]).getInfo(address);
      vitaInfo.name = newVitaInfo.name;
      vitaInfo.balance = newVitaInfo.balance.toNumber();
    }
    this.setState({ xrc20Info, vitaInfo });
  }

  public renderOtherTokenBalance = (): JSX.Element => (
    <>
      {this.state.vitaInfo.name && (
        <div className={"info"}>{`${(+utils.fromRau(
          String(this.state.vitaInfo.balance),
          String(this.state.vitaInfo.name)
        )).toFixed(4)} ${this.state.vitaInfo.name}`}</div>
      )}
      {this.state.xrc20Info.name && (
        <div className={"info"}>{`${(+utils.fromRau(
          String(this.state.xrc20Info.balance),
          String(this.state.xrc20Info.name)
        )).toFixed(4)} ${this.state.xrc20Info.name}`}</div>
      )}
    </>
  );

  public render(): JSX.Element {
    const {
      match: {
        params: { address }
      }
    } = this.props;
    let addressInfo: AccountMeta;
    return (
      <ContentPadding>
        <Helmet title={`IoTeX ${t("address.address")} ${address}`} />
        <Query query={GET_ACCOUNT} variables={{ address }}>
          {({
            loading,
            error,
            data
          }: QueryResult<{ getAccount: GetAccountResponse }>) => {
            if (error) {
              return null;
            }
            if (data && data.getAccount && data.getAccount.accountMeta) {
              addressInfo = data.getAccount.accountMeta;
            }
            const copyAddress = (addressInfo && addressInfo.address) || address;
            const numActions = +((addressInfo && addressInfo.numActions) || 0);
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
                    <span style={{ marginLeft: "5px" }}>
                      <ShowQrcodeButton text={copyAddress} />
                    </span>
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
                      {this.renderOtherTokenBalance()}
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
                  totalActions={numActions}
                  getVariable={({ current, pageSize }) => {
                    const start =
                      numActions - pageSize - (current - 1) * pageSize;
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
