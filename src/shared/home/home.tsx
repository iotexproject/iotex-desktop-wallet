import { Col, Row } from "antd";
import Layout from "antd/lib/layout";
import BlockProducers from "iotex-react-block-producers";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { webBpApolloClient } from "../common/apollo-client";
import { assetURL } from "../common/asset-url";
import { ContentPadding } from "../common/styles/style-padding";
import { BlockList } from "./block-list";
import { SearchBox } from "./search-box";
import { StatsArea } from "./stats-area";

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
              backgroundPosition: "center"
            }}
          >
            <Row type="flex" justify="center" align="middle">
              <Col xs={20} md={12} style={{ padding: "8vh 0" }}>
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
            style={{
              backgroundColor: "rgba(0,0,0,0)",
              marginTop: "-10vh",
              marginBottom: 40
            }}
          >
            <StatsArea />
          </Layout.Content>
          <Layout.Content tagName={"main"}>
            <Row>
              <Col xs={24} sm={24} md={20} lg={21}>
                <div style={{ backgroundColor: "#fff" }}>
                  <BlockProducers apolloClient={webBpApolloClient} />
                </div>
              </Col>
              <Col xs={0} sm={0} md={4} lg={3}>
                {/** Don't show block list on small devices */}
                <BlockList />
              </Col>
            </Row>
          </Layout.Content>
        </ContentPadding>
      </Layout>
    );
  }
}
export const Home = withRouter(HomeComponent);
