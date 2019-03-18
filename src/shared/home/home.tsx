import { Layout, Table } from "antd";
import gql from "graphql-tag";
import { Component } from "react";
import React from "react";
import { Query } from "react-apollo";
import { ContentPadding } from "../common/styles/style-padding";

const GET_CHAIN_META = gql`
  query {
    chainMeta {
      height
      numActions
      tps
      epoch {
        num
        height
      }
    }
  }
`;

type State = {
  marketCap: number;
  price: number;
  name: string;
};

export class Home extends Component<{}, State> {
  public state: State = {
    marketCap: 0,
    price: 0,
    name: "IOSG"
  };

  public thousands(num: number): string {
    const str = num.toString();
    const reg =
      str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
  }

  public componentDidMount(): void {
    fetchCoinPrice().then(
      (r: {
        status: number;
        data?: [{ market_cap_usd?: number; name?: string; price_btc?: number }];
      }) => {
        if (r.status === 200) {
          const resultData = r.data || [];
          let marketCap = 0;
          let price = 0;
          let name = "";

          if (resultData.length) {
            marketCap =
              (resultData[0].market_cap_usd &&
                resultData[0].market_cap_usd / 1000000) ||
              0;
            price = resultData[0].price_btc || 0;
            name = resultData[0].name || "IOSG";
          }
          this.setState({
            marketCap,
            price,
            name
          });
        }
      }
    );
  }

  public render(): JSX.Element {
    return (
      <ContentPadding>
        {/* <Query query={GET_CHAIN_META}>
          {({ loading, error, data }) => {
            if (loading) {
              return "Loading...";
            }
            if (error) {
              return `Error! ${error.message}`;
            }

            return <div>{JSON.stringify(data)}</div>;
          }}
        </Query> */}
        <Row>
          <Col span={12} />
          <Col span={12}>
            <div
              className="certain-category-search-wrapper"
              style={{
                width: 350,
                marginTop: 20,
                marginBottom: 20,
                float: "right"
              }}
            >
              <Input
                className="certain-category-search"
                placeholder="Search by Block # / Account / Public Key / TX"
                suffix={
                  <Icon type="search" className="certain-category-icon" />
                }
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="current user" value={112893} />
          </Col>
          <Col span={6}>
            <Statistic title="account" value={112893} precision={2} />
          </Col>
          <Col span={6}>
            <Statistic title="info" value={112893} />
          </Col>
          <Col span={6}>
            <Statistic title="block" value={112893} precision={2} />
          </Col>
        </Row>
        <Layout tagName={"main"}>
          <Layout.Content
            tagName={"main"}
            style={{ backgroundColor: "#fff", padding: "8px" }}
          >
            <Query query={GET_CHAIN_META}>
              {({ loading, error, data }) => {
                if (loading) {
                  return "Loading...";
                }
                if (error) {
                  return `Error! ${error.message}`;
                }

                return (
                  <div>
                    <Flex>
                      <Flex center>
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <div>
                            <Icon type="fire" />
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {this.state.name}
                          </div>
                          <div>PRODUCER</div>
                        </div>
                      </Flex>
                      <Flex center>
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <div>
                            <Icon type="build" />
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {this.thousands(
                              (data.chainMeta && data.chainMeta.height) || 0
                            )}
                          </div>
                          <div>BLOCK HEIGHT</div>
                        </div>
                      </Flex>
                      <Flex center>
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <div>
                            <Icon type="dashboard" />
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {this.thousands(
                              (data.chainMeta && data.chainMeta.tps) || 0
                            )}
                          </div>
                          <div>CURRENT TPS</div>
                        </div>
                      </Flex>
                      <Flex center>
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <div>
                            <Icon type="dollar" />
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            ${this.state.price || 0}
                          </div>
                          <div>IOTX PRICE</div>
                        </div>
                      </Flex>
                      <Flex center>
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <div>
                            <Icon type="bank" />
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            $ {this.state.marketCap || 0} M
                          </div>
                          <div>MARKETCAP</div>
                        </div>
                      </Flex>
                    </Flex>
                  </div>
                );
              }}
            </Query>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}
