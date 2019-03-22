import { Col, Icon, Input, Layout, Row } from "antd";
import React, { Component } from "react";
import { Query } from "react-apollo";
import { ChainMeta } from "../../api-gateway/resolvers/antenna-types";
import { Flex } from "../common/flex";
import { ContentPadding } from "../common/styles/style-padding";
import { BpTable } from "./bp-table";
import { GET_CHAIN_META, GET_COIN_MARKET_CAP } from "../queries";

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
        <div className={"section-top"}>
          <Row>
            <Col span={12} />
            <Col span={12}>
              <div
                className="certain-category-search-wrapper"
                style={{
                  width: 350,
                  margin: 20,
                  marginBottom: 0,
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
          <Query query={GET_CHAIN_META}>
            {({ loading, error, data }) => {
              if (loading) {
                return "Loading...";
              }
              if (error) {
                return `Error! ${error.message}`;
              }

              const chainMetaData = data.chainMeta;

              return (
                <Query query={GET_COIN_MARKET_CAP}>
                  {({ loading, error, data }) => {
                    if (loading) {
                      return "Loading...";
                    }
                    if (error) {
                      return `Error! ${error.message}`;
                    }

                    const tiles = this.getTiles(
                      Object.assign(chainMetaData, data)
                    );

                    return (
                      <div className={"front-top-info"} style={{ padding: 20 }}>
                        <Flex>
                          {tiles.map((tile, i) => (
                            <div key={i} className={"item"}>
                              <Tile
                                title={tile.title}
                                value={tile.value}
                                icon={tile.icon}
                              />
                            </div>
                          ))}
                        </Flex>
                      </div>
                    );
                  }}
                </Query>
              );
            }}
          </Query>
        </div>
        <Layout tagName={"main"} className={"main-container"}>
          <Layout.Content tagName={"main"}>
            <div style={{ backgroundColor: "#fff" }}>
              <BpTable />
            </div>
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
