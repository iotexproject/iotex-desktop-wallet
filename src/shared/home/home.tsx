import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import Row from "antd/lib/row";

import BlockProducers from "iotex-react-block-producers";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { webBpApolloClient } from "../common/apollo-client";
import { assetURL } from "../common/asset-url";
import { IoTeXExplorer } from "../common/icons/iotex.svg";
import { handleSearch } from "../common/search-handler";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { BlockList } from "./block-list";
import { SearchBox } from "./search-box";
import { StatsArea } from "./stats-area";

type State = {
  marketCap: number;
  price: number;
  search: string;
};

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> &
  WithApolloClient<{}> & {
    isEnterprise: boolean;
  };

class HomeComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const urlParams = new URLSearchParams(props.history.location.search);
    this.state = {
      marketCap: 0,
      price: 0,
      search: urlParams.get("search") || ""
    };
  }

  public componentDidMount(): void {
    if (this.state.search) {
      handleSearch(
        {
          history: this.props.history,
          client: this.props.client
        },
        this.state.search
      );
    }
  }

  public render(): JSX.Element {
    if (this.state.search) {
      return <></>;
    }
    const { isEnterprise } = this.props;
    return (
      <Layout className={"main-container"}>
        <Layout.Content>
          <div
            style={{
              backgroundImage: isEnterprise
                ? ""
                : `url(${assetURL("/bg_search.png")})`,
              backgroundColor: isEnterprise ? colors.white : "",
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
              {isEnterprise ? (
                <span style={{ color: colors.text01 }}>区块链浏览器</span>
              ) : (
                <>
                  I{" "}
                  <Icon
                    component={IoTeXExplorer}
                    style={{ padding: "0px 6px" }}
                  />{" "}
                  {"TeX.Explorer"}
                </>
              )}
            </Row>
            <Row type="flex" justify="center" align="middle">
              <Col xs={20} md={12}>
                <SearchBox
                  autoFocus={true}
                  enterButton={true}
                  size="large"
                  placeholder={t("topbar.search")}
                />
              </Col>
            </Row>
          </div>
        </Layout.Content>
        {!this.props.isEnterprise && (
          <ContentPadding>
            <Layout.Content
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                marginTop: "-10vh",
                marginBottom: 40
              }}
            >
              <StatsArea />
            </Layout.Content>
            <Layout.Content style={{ marginBottom: "15px" }}>
              <Row>
                <Col xs={24} sm={24} md={19} lg={20} xl={20} xxl={21}>
                  <div style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                    {/*
                      // @ts-ignore */}
                    <BlockProducers
                      badgeImg={assetURL("bnbridge/hermes.svg")}
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
        )}
      </Layout>
    );
  }
}
export const Home = connect((state: { base: { isEnterprise: boolean } }) => {
  return { isEnterprise: state.base.isEnterprise };
})(withRouter(withApollo(HomeComponent)));
