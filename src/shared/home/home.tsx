import { Col, Row } from "antd";
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
import { webBpApolloClient } from "../common/apollo-client";
import { assetURL } from "../common/asset-url";
import { Flex } from "../common/flex";
import { IoTeXExplorer } from "../common/icons/iotex.svg";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_CHAIN_META, GET_TILE_DATA } from "../queries";
import { BlockList } from "./block-list";
import { SearchBox } from "./search-box";

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
          history.push(`/action`);
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

  public renderStats(): JSX.Element {
    return (
      <div className={"section-top"}>
        <Query query={GET_CHAIN_META}>
          {({
            error,
            data
          }: QueryResult<{ chainMetaData: GetChainMetaResponse }>) => {
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
                    <SpinPreloader spinning={!data}>
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
    );
  }

  public render(): JSX.Element {
    return (
      <Layout tagName={"main"} className={"main-container"}>
        <Layout.Content tagName={"main"}>
          <div
            style={{
              backgroundImage: `url(${assetURL("/bg_search.png")})`,
              width: "100%",
              height: "40vh",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minHeight: 400
            }}
          >
            <Row
              type="flex"
              justify="center"
              align="middle"
              style={{
                fontSize: 34,
                color: colors.white,
                paddingTop: 50,
                paddingBottom: 20
              }}
            >
              I{" "}
              <Icon component={IoTeXExplorer} style={{ padding: "0px 6px" }} />{" "}
              TeX.Explorer
            </Row>
            <Row type="flex" justify="center" align="middle">
              <Col xs={20} md={12}>
                <SearchBox
                  enterButton
                  size="large"
                  placeholder={t("topbar.search")}
                />
              </Col>
            </Row>
          </div>
        </Layout.Content>
        <ContentPadding>
          <Layout.Content
            tagName={"main"}
            style={{ backgroundColor: "rgba(0,0,0,0)", marginTop: "-10vh" }}
          >
            {this.renderStats()}
          </Layout.Content>
          <Layout.Content tagName={"main"} style={{ marginBottom: "15px" }}>
            <Row>
              <Col xs={24} sm={24} md={19} lg={20} xl={20} xxl={21}>
                <div style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                  <BlockProducers
                    apolloClient={webBpApolloClient}
                    height="750px"
                  />
                </div>
              </Col>
              <Col xs={0} sm={0} md={5} lg={4} xl={4} xxl={3}>
                {/** Don't show block list on small devices */}
                <BlockList height="836px" />
              </Col>
            </Row>
          </Layout.Content>
        </ContentPadding>
      </Layout>
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
