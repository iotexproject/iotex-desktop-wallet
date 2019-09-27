// @ts-ignore
import { Icon } from "antd";
import Button from "antd/lib/button";
import Card from "antd/lib/card";
import Col from "antd/lib/col";
import DatePicker from "antd/lib/date-picker";
import Divider from "antd/lib/divider";
import Row from "antd/lib/row";
import Table from "antd/lib/table";
import Tabs from "antd/lib/tabs";
import { get } from "dottie";
// @ts-ignore
import * as utils from "iotex-antenna/lib/account/utils";
import isBrowser from "is-browser";
import * as _ from "lodash/fp";
import moment from "moment";
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
  start: moment.Moment;
  end: moment.Moment;
  filterTime: moment.Moment | null;
};

type Props = RouteComponentProps<PathParamsType> & {};

class AddressDetailsInner extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      xrc20Infos: [],
      address: "",
      start: moment(),
      end: moment(),
      filterTime: null
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

  public handleFilter = (dateFormat: moment.Moment, state: string) => {
    this.setState({ ...this.state, [state]: dateFormat });
  };

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
          const timestamp = get(
            data || {},
            "getActions.actionInfo.0.timestamp"
          );
          return (
            <Query
              query={GET_BP_CANDIDATE}
              variables={{ ioOperatorAddress: address }}
              client={webBpApolloClient}
            >
              {({ data }: QueryResult) => {
                const name =
                  get(data || {}, "bpCandidate.registeredName") || address;
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
                  ...(timestamp ? { timestamp } : {}),
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

  public renderActions = (address: string, numActions: number): JSX.Element => {
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    return (
      <Tabs onChange={() => undefined} type="card">
        <Tabs.TabPane tab={t("tabs.actions")} key="1">
          <div className="daterange">
            <DatePicker
              showTime
              placeholder="Start Date"
              format={dateFormat}
              onChange={dateFormat => this.handleFilter(dateFormat, "start")}
              value={this.state.start}
            />
            <span>~</span>
            <DatePicker
              showTime
              placeholder="End Date"
              format={dateFormat}
              onChange={dateFormat => this.handleFilter(dateFormat, "end")}
              value={this.state.end}
            />
            <Button
              onClick={() => {
                this.setState({ filterTime: moment() });
              }}
            >
              <Icon type="filter" />
            </Button>
          </div>
          <ActionTable
            totalActions={numActions}
            isAddressPage={true}
            // TO DO:send props to apply filter on actions timestamp
            // daterange={ this.state.filterTime ? { start: this.state.start, end: this.state.end } : {}}
            getVariable={({ current, pageSize }) => {
              const start = numActions - pageSize - (current - 1) * pageSize;
              return {
                byAddr: {
                  address,
                  start: start < 0 ? 0 : start,
                  count: pageSize
                }
              };
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t("tabs.erc_actions")} key="2">
          {/* TO DO: implement erc20 transactions table */}
        </Tabs.TabPane>
      </Tabs>
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
                  {this.renderActions(address, numActions)}
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
