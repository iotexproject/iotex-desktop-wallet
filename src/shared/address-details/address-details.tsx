// @ts-ignore
import { Col, Row } from "antd";
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
import { ITokenInfo, Token } from "../../erc20/token";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { PageTitle } from "../common/page-title";
import { ShowQrcodeButton } from "../common/show-qrcode-button";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { SearchBox } from "../home/search-box";
import { GET_ACCOUNT } from "../queries";
import { ActionTable } from "./action-table";

type PathParamsType = {
  address: string;
};

type State = {
  xrc20Infos: Array<ITokenInfo>;
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class AddressDetailsInner extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      xrc20Infos: [],
      address: ""
    };
  }

  public pollTokenInfos = async (
    tokens: Array<string>,
    address: string
  ): Promise<void> => {
    const xrc20Infos = await Promise.all(
      tokens.map(token => Token.getToken(token).getInfo(address))
    );
    this.setState({
      xrc20Infos: xrc20Infos.filter(tokenInfo => !!tokenInfo.symbol),
      address
    });
  };

  public componentDidUpdate(): void {
    const {
      match: {
        params: { address }
      }
    } = this.props;
    if (address === this.state.address) {
      return;
    }
    const xrc20tokens =
      isBrowser && JsonGlobal("state").base.defaultERC20Tokens;
    this.pollTokenInfos(xrc20tokens, address);
  }

  public renderOtherTokenBalance = (): JSX.Element => (
    <>
      {this.state.xrc20Infos.map(tokenInfo => (
        <div
          key={`token${tokenInfo.symbol}`}
          className={"info"}
        >{`${tokenInfo.balanceString} ${tokenInfo.symbol}`}</div>
      ))}
    </>
  );

  public renderAddressInfo = (addressInfo: AccountMeta): JSX.Element => (
    <>
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
        <div className={"info"}>{(addressInfo && addressInfo.nonce) || 0}</div>
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
        <Row style={{ marginTop: 60 }} justify="end" type="flex">
          <Col xs={24} md={12}>
            <SearchBox
              enterButton
              size="large"
              placeholder={t("topbar.searchAddress")}
            />
          </Col>
        </Row>
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
                    {this.renderAddressInfo(addressInfo)}
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
