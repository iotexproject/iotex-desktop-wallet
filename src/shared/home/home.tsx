import { Icon, Input, Statistic } from "antd";
import Card from "antd/lib/card";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Layout from "antd/lib/layout";
import BlockProducers from "iotex-react-block-producers";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { BlockList } from "../common/block-list";
import { SearchBox } from "../common/search-box";
import { ContentPadding } from "../common/styles/style-padding";
const { Content } = Layout;

const GUTTER = 16;
const TILE_HEIGHT = 150;

const Tile = (props: {
  icon?: JSX.Element;
  title?: string;
  value?: string;
}) => {
  const { title, value = 99 } = props;
  return (
    <Card
      bordered={true}
      style={{
        height: TILE_HEIGHT,
        color: "#FFF",
        marginTop: GUTTER / 2,
        marginBottom: GUTTER / 2
      }}
    >
      <Statistic
        title={<h3>{title}</h3>}
        value={value}
        valueStyle={{ color: "#3f8600" }}
        prefix={<Icon type="arrow-up" />}
        suffix=""
      />
    </Card>
  );
};

const MapTile = () => {
  return (
    <Card
      bordered={true}
      style={{
        height: TILE_HEIGHT * 2 + GUTTER,
        color: "#FFF",
        marginTop: GUTTER / 2,
        marginBottom: GUTTER / 2
      }}
    >
      <h3>{"Map"}</h3>
      {
        //TODO
      }
    </Card>
  );
};

class HomeComponent extends Component {
  public renderSearchBar(): JSX.Element {
    return (
      <Layout tagName="main" style={{ marginTop: 20, background: "#f0f2f5" }}>
        <SearchBox
          className={"home-search"}
          placeholder={t("topbar.search")}
          enterButton={t("home.search")}
          size="large"
        />
      </Layout>
    );
  }

  public renderStats(): JSX.Element {
    return (
      <Layout
        tagName="main"
        style={{ margin: "20px 0px", background: "#f0f2f5" }}
      >
        <Row gutter={GUTTER}>
          <Col md={16}>
            <Row gutter={GUTTER}>
              <Col md={12}>
                <Tile title={"TPS"} value={`0`} />
              </Col>
              <Col md={12}>
                <Tile title={"# of Delegates"} value={`99`} />
              </Col>
              <Col md={12}>
                <Tile title={"Productivity"} value={`1/6`} />
              </Col>
              <Col md={12}>
                <Tile title={"# of Voters"} value={`999`} />
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <MapTile />
          </Col>
        </Row>
      </Layout>
    );
  }

  public render(): JSX.Element {
    return (
      <div style={{ background: "#f0f2f5" }}>
        <ContentPadding>
          <Layout
            tagName="main"
            className={"main-container"}
            style={{ background: "#f0f2f5" }}
          >
            {this.renderSearchBar()}
            {this.renderStats()}

            <Layout tagName="main">
              <Content tagName="main" style={{ background: "#f0f2f5" }}>
                <Row>
                  <Col lg={20} md={24}>
                    <BlockProducers />
                  </Col>
                  <Col lg={4} md={16}>
                    <BlockList />
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        </ContentPadding>
      </div>
    );
  }
}

export const Home = HomeComponent;
