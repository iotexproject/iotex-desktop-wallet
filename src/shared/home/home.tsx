import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import React, { Component } from "react";
import { Query } from "react-apollo";
import { ChainMeta } from "../../api-gateway/resolvers/antenna-types";
import { CoinPrice } from "../../api-gateway/resolvers/meta";
import { Flex } from "../common/flex";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_CHAIN_META, GET_COIN_MARKET_CAP } from "../queries";
import { BpTable } from "./bp-table";

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
    fetchCoinPrice: CoinPrice;
  }): Array<TileProps> => {
    return [
      {
        title: "PRODUCER",
        value: data.fetchCoinPrice.name,
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
        value: data.fetchCoinPrice.priceBtc || 0,
        icon: "dollar"
      },
      {
        title: "MARKETCAP",
        value: `${data.fetchCoinPrice.priceUsd || 0} M`,
        icon: "bank"
      }
    ];
  };

  public render(): JSX.Element {
    return (
      <ContentPadding>
        <div className={"section-top"}>
          <Query query={GET_CHAIN_META}>
            {({ loading, error, data }) => {
              if (loading) {
                return "Loading...";
              }
              if (error) {
                return `Error! ${error.message}`;
              }

              const chainMetaData = data;

              return (
                <Query query={GET_COIN_MARKET_CAP}>
                  {({ loading, error, data }) => {
                    if (loading) {
                      return "Loading...";
                    }
                    if (error) {
                      return `Error! ${error.message}`;
                    }

                    const tiles = this.getTiles({ ...chainMetaData, ...data });

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
