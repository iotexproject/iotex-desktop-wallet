import { Col, Icon, Input, Layout, Row, Statistic } from "antd";
import gql from "graphql-tag";
import { Component } from "react";
import React from "react";
import { Query } from "react-apollo";
import { ChainMeta } from "../../api-gateway/resolvers/antenna-types";
import { fetchCoinPrice } from "../../server/gateways/coin-market-cap";
import { Flex } from "../common/flex";
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

  private readonly getTiles = (data: {
    chainMeta: ChainMeta;
  }): Array<TileProps> => {
    return [
      {
        title: "PRODUCER",
        value: this.state.name,
        icon: "fire"
      },
      {
        title: "BLOCK HEIGHT",
        value: parseInt(
          data.chainMeta && data.chainMeta.height,
          10
        ).toLocaleString(),
        icon: "build"
      },
      {
        title: "CURRENT TPS",
        value: parseInt(
          data.chainMeta && data.chainMeta.tps,
          10
        ).toLocaleString(),

        icon: "dashboard"
      },
      {
        title: "IOTX PRICE",
        value: this.state.price || 0,
        icon: "dollar"
      },
      {
        title: "MARKETCAP",
        value: `${this.state.marketCap || 0} M`,
        icon: "bank"
      }
    ];
  };

  public render(): JSX.Element {
    return (
      <ContentPadding>
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

                const tiles = this.getTiles(data);

                return (
                  <div>
                    <Flex>
                      {tiles.map((tile, i) => (
                        <Tile
                          key={i}
                          title={tile.title}
                          value={tile.value}
                          icon={tile.icon}
                        />
                      ))}
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

type TileProps = { title: string; value: string | number; icon: string };

function Tile({ title, value, icon }: TileProps): JSX.Element {
  return (
    <Flex center>
      <div style={{ width: "100%", textAlign: "center" }}>
        <div>
          <Icon type={icon} />
        </div>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</div>
        <div>{title}</div>
      </div>
    </Flex>
  );
}
