import Col from "antd/lib/col";
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
// @ts-ignore
import * as utils from "iotex-antenna/lib/account/utils";
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
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
  vitaBalance: string;
};

type Props = RouteComponentProps<PathParamsType> & {
  xrc20tokens: Array<string>;
  vitaToken: string;
};

class AddressDetailsInner extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      xrc20Infos: [],
      address: "",
      vitaBalance: "0"
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

  public async componentDidMount(): Promise<void> {
    const {
      match: {
        params: { address }
      },
      xrc20tokens,
      vitaToken
    } = this.props;
    if (address === this.state.address) {
      return;
    }
    const vitaInfo = await Token.getToken(vitaToken).getInfo(address);
    const vitaBalance = vitaInfo.balanceString;
    this.setState({ vitaBalance });
    xrc20tokens.splice(xrc20tokens.indexOf(vitaToken), 1);
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
    <Row>
      <Col xs={12} md={6} className="item">
        <div className={"icon"}>
          <img id="iotx" alt="iotx" src={assetURL("/icon_balance_iotx.png")} />
        </div>
        <div className={"name"} style={{ marginTop: 5 }}>
          IOTX
        </div>
        <div className={"info"}>{`${Number(
          (+utils.fromRau(
            String((addressInfo && addressInfo.balance) || 0),
            "IOTX"
          )).toFixed(4)
        ).toLocaleString()} IOTX`}</div>
        {this.renderOtherTokenBalance()}
      </Col>
      <Col xs={12} md={6} className="item">
        <div className={"icon"}>
          <img id="vita" alt="vita" src={assetURL("/icon_balance_vita.png")} />
        </div>
        <div className={"name"} style={{ marginTop: 5 }}>
          VITA
        </div>
        <div className={"info"}>
          {`${Number(this.state.vitaBalance).toLocaleString()} VITA`}
        </div>
      </Col>
      <Col xs={12} md={6} className="item">
        <div className={"icon"}>
          <Icon type="border" />
        </div>
        <div className={"name"}>{t("address.nonce")}</div>
        <div className={"info"}>
          {(addressInfo && Number(addressInfo.nonce).toLocaleString()) || 0}
        </div>
      </Col>
      <Col xs={12} md={6} className="item">
        <div className={"icon"}>
          <Icon type="project" />
        </div>
        <div className={"name"}>{t("address.pendingNonce")}</div>
        <div className={"info"}>
          {(addressInfo && Number(addressInfo.pendingNonce).toLocaleString()) ||
            0}
        </div>
      </Col>
    </Row>
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

const mapStateToProps = (state: {
  base: { [index: string]: Array<string> };
}): {
  xrc20tokens: Array<string>;
  vitaToken: string;
} => ({
  xrc20tokens: (state.base || {}).defaultERC20Tokens || [],
  vitaToken: (state.base || {}).vitaTokens[0] || ""
});

export const AddressDetails = connect(mapStateToProps)(
  withRouter(AddressDetailsInner)
);
