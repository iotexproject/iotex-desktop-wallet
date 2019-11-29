// @ts-ignore

// @ts-ignore
import Footer, { FOOTER_HEIGHT } from "iotex-react-footer";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
// @ts-ignore
import initGoogleAnalytics from "./common/google-analytics";
import { HtmlHead } from "./common/html-head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TOP_BAR_HEIGHT, TopMenuBar } from "./common/top-menu-bar";
import { Home } from "./home/home";
import { ActionDetailPage } from "./pages/action-detail-page";
import { ActionListPage } from "./pages/action-list-page";
import { AddressDetailsPage } from "./pages/address-details-page";
import { BlockDetailPage } from "./pages/block-detail-page";
import { BlockListPage } from "./pages/block-list-page";
import { XRC20ActionListPage } from "./pages/xrc20-action-list-page";
import { Wallet } from "./wallet/wallet";

type Props = {
  googleTid: string;
  locale: string;
};

export class App extends Component<Props> {
  public componentDidMount(): void {
    initGoogleAnalytics({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    const { locale } = this.props;

    return (
      <RootStyle>
        <HtmlHead locale={locale} />
        <TopMenuBar />
        <div
          style={{
            minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
          }}
        >
          <ScrollToTop>
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route
                exact={true}
                path="/address/:address"
                component={AddressDetailsPage}
              />
              <Route path="/block/:height" component={BlockDetailPage} />
              <Route exact={true} path="/block" component={BlockListPage} />
              <Route
                exact={true}
                path="/action/:hash"
                component={ActionDetailPage}
              />
              <Route exact={true} path="/action" component={ActionListPage} />
              <Route
                exact={true}
                path="/tokentxns"
                component={XRC20ActionListPage}
              />
              <Route path="/wallet" component={Wallet} />
              <Route component={NotFound} />
            </Switch>
          </ScrollToTop>
        </div>
        <Footer />
      </RootStyle>
    );
  }
}

const RootStyle = styled("div", () => ({
  ...fonts.body,
  backgroundColor: colors.white,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));
