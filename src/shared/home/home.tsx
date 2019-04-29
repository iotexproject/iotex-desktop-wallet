import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import { get } from "dottie";
import { GetChainMetaResponse } from "iotex-antenna/protogen/proto/api/api_pb";
import BlockProducers from "iotex-react-block-producers";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import {
  BlockMeta,
  ChainMeta,
  GetBlockMetasResponse
} from "../../api-gateway/resolvers/antenna-types";
import { CoinPrice } from "../../api-gateway/resolvers/meta";
import { Flex } from "../common/flex";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_CHAIN_META, GET_TILE_DATA } from "../queries";

type State = {
  marketCap: number;
  price: number;
  name: string;
};

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class HomeComponent extends Component<Props, State> {
  public state: State = {
    marketCap: 0,
    price: 0,
    name: "IOSG"
  };

  private readonly getTiles = (data: {
    chainMeta: ChainMeta;
    fetchCoinPrice: CoinPrice;
  }): Array<TileProps> => {
    const { history } = this.props;
    const { height, tps } = get(data, "chainMeta", {}) as ChainMeta;
    const { producerAddress = "", hash } = get(
      data,
      "getBlockMetas.blkMetas.0",
      {}
    ) as BlockMeta;
    const { priceUsd, marketCapUsd } = get(
      data,
      "fetchCoinPrice",
      {}
    ) as CoinPrice;

    return [
      {
        title: t("home.producer"),
        value: producerAddress.substring(0, 8),
        icon: "fire",
        action: () => {
          if (!producerAddress) {
            return;
          }
          history.push(`/address/${producerAddress}`);
        }
      },
      {
        title: t("home.blockHeight"),
        value: parseInt(height, 10).toLocaleString(),
        icon: "build",
        action: () => {
          if (!height) {
            return;
          }
          history.push(`/block/${hash}`);
        }
      },
      {
        title: t("home.currentTPS"),
        value: parseInt(tps, 10).toLocaleString(),
        icon: "dashboard",
        action: () => {
          history.push(`/actions`);
        }
      },
      {
        title: t("home.IOTXPrice"),
        value: `${priceUsd || 0} USD`,
        icon: "dollar",
        action: () => {
          window.location.href = `https://coinmarketcap.com/currencies/iotex/?utm_source=iotexscan.i`;
        }
      },
      {
        title: t("home.marketCap"),
        value: `${marketCapUsd || 0} M`,
        icon: "bank",
        action: () => {
          window.location.href = `https://coinmarketcap.com/currencies/iotex/?utm_source=iotexscan.i`;
        }
      }
    ];
  };

  public render(): JSX.Element {
    return (
      <ContentPadding>
        <div className={"section-top"}>
          <Query query={GET_CHAIN_META}>
            {({
              loading,
              error,
              data
            }: QueryResult<{ chainMetaData: GetChainMetaResponse }>) => {
              if (loading) {
                return "Loading...";
              }
              if (error || !data) {
                return null;
              }

              const chainMetaData = data;
              const byIndex = {
                start: parseInt(get(chainMetaData, "chainMeta.height"), 10),
                count: 1
              };
              return (
                <Query query={GET_TILE_DATA} variables={{ byIndex }}>
                  {({
                    loading,
                    error,
                    data
                  }: QueryResult<{
                    fetchCoinPrice: CoinPrice;
                    getBlockMetas: GetBlockMetasResponse;
                  }>) => {
                    if (error || (!loading && !data)) {
                      return null;
                    }

                    //@ts-ignore
                    const tiles = this.getTiles({ ...chainMetaData, ...data });
                    return (
                      <SpinPreloader spinning={loading}>
                        <div
                          className={"front-top-info"}
                          style={{
                            padding: 30,
                            margin: "30px 0",
                            border: "1px solid rgb(230,230,230)",
                            borderRadius: 5
                          }}
                        >
                          <Flex>
                            {tiles.map((tile, i) => (
                              <div key={i} className={"item"}>
                                <Tile
                                  action={tile.action}
                                  title={tile.title}
                                  value={tile.value}
                                  icon={tile.icon}
                                />
                              </div>
                            ))}
                          </Flex>
                        </div>
                      </SpinPreloader>
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
              <BlockProducers />
            </div>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}

export const Home = withRouter(HomeComponent);

type TileProps = {
  title: string;
  value: string | number;
  icon: string;
  action: Function;
};

function Tile({ title, value, icon, action }: TileProps): JSX.Element {
  return (
    <Flex center>
      <div
        style={{ width: "100%", cursor: "pointer", textAlign: "center" }}
        role="button"
        // @ts-ignore
        onClick={action}
      >
        <div>
          <Icon type={icon} />
        </div>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</div>
        <div>{title}</div>
      </div>
    </Flex>
  );
}
