// @ts-ignore
import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Divider from "antd/lib/divider";
import Row from "antd/lib/row";
import Table from "antd/lib/table";
// @ts-ignore
import * as utils from "iotex-antenna/lib/account/utils";
import isBrowser from "is-browser";
import * as _ from "lodash/fp";
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
  GetAccountResponse,
  GetActionsResponse
} from "../../api-gateway/resolvers/antenna-types";
import { ITokenInfo, Token } from "../../erc20/token";
import { buildKeyValueArray } from "../action/action-detail";
import { getColumns } from "../block/block-detail";
import { webBpApolloClient } from "../common/apollo-client";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { Navigation } from "../common/navigation";
import { ShowQrcodeButton } from "../common/show-qrcode-button";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { SearchBox } from "../home/search-box";
import { GET_ACCOUNT, GET_ACTIONS, GET_BP_CANDIDATE } from "../queries";
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

  public componentDidMount(): void {
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

  public renderAddressInfo = (
    address: string,
    addressInfo: AccountMeta
  ): JSX.Element => {
    return (
      <Query
        query={GET_ACTIONS}
        variables={{ byAddr: { address, start: 1, count: 1 } }}
        fetchPolicy="network-only"
        ssr={false}
      >
        {({ error, data }: QueryResult<{ getActions: GetActionsResponse }>) => {
          if (error) {
            return null;
          }

          const timestamp =
            data && data.getActions && data.getActions.actionInfo[0].timestamp;

          return (
            <Query
              query={GET_BP_CANDIDATE}
              variables={{ ioOperatorAddress: address }}
              client={webBpApolloClient}
            >
              {({ data }: QueryResult) => {
                const name =
                  (data &&
                    data.bpCandidate &&
                    data.bpCandidate.registeredName) ||
                  address;

                const balance = addressInfo && addressInfo.balance;
                const { xrc20Infos } = this.state;

                const tokenBalance = [];
                tokenBalance.push(balance);

                xrc20Infos.map(tokenInfo => {
                  tokenBalance.push(
                    `${tokenInfo.balanceString} ${tokenInfo.symbol}`
                  );
                });

                const source = {
                  timestamp,
                  balance: tokenBalance.join(","),
                  name
                };
                const dataSource = buildKeyValueArray(source);
                return (
                  <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={getColumns("")}
                    rowKey={"key"}
                    style={{ width: "100%" }}
                    scroll={{ x: true }}
                    showHeader={false}
                    className="action-table"
                  />
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  };

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
        <Row justify="end" type="flex">
          <Col xs={24} md={12} style={{ marginTop: 20 }}>
            <Navigation />
          </Col>
          <Col xs={24} md={12} style={{ marginTop: 30 }}>
            <SearchBox
              autoFocus={true}
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
                <div className="addressList">
                  <Card>
                    <div>
                      <span
                        style={{
                          color: "#333",
                          fontSize: 24,
                          wordBreak: "break-all"
                        }}
                      >
                        {`${t("address.address")}:`}{" "}
                        {(addressInfo && addressInfo.address) || address}{" "}
                      </span>
                      <CopyButtonClipboardComponent
                        icon="copy"
                        text={copyAddress}
                      />
                      <span style={{ marginLeft: "5px" }}>
                        <ShowQrcodeButton text={copyAddress} />
                      </span>
                    </div>

                    <Divider style={{ width: "102%", margin: "24px -10px" }} />
                    {this.renderAddressInfo(address, addressInfo)}
                  </Card>
                  <br />
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
                </div>
              </SpinPreloader>
            );
          }}
        </Query>
      </ContentPadding>
    );
  }
}

export const AddressDetails = withRouter(AddressDetailsInner);
