// @ts-ignore

// @ts-ignore
import Footer, { FOOTER_HEIGHT } from "iotex-react-footer";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { RouteComponentProps, Switch } from "react-router";
import { Route } from "react-router-dom";
import { ENTERPRISE_FOOTER_ABOVE, EnterpriseFooter } from "./common/footer";
// @ts-ignore
import initGoogleAnalytics from "./common/google-analytics";
import { HtmlHead } from "./common/html-head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TOP_BAR_HEIGHT, TopMenuBar } from "./common/top-menu-bar";
import { Home } from "./home/home";
import { AccountListPage } from "./pages/account-list-page";
import { ActionDetailPage } from "./pages/action-detail-page";
import { ActionListPage } from "./pages/action-list-page";
import { AddressDetailsPage } from "./pages/address-details-page";
import { BlockDetailPage } from "./pages/block-detail-page";
import { BlockListPage } from "./pages/block-list-page";
import { XRC20ActionListPage } from "./pages/xrc20-action-list-page";
import { XRC20TokenListPage } from "./pages/xrc20-token-list-page";
import { Wallet } from "./wallet/wallet";

type Props = {
  googleTid: string;
  locale: string;
  isEnterprise: boolean;
} & RouteComponentProps;

export class App extends Component<Props> {
  public componentDidMount(): void {
    initGoogleAnalytics({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    const { locale, isEnterprise } = this.props;
    const footerAboveStyle = isEnterprise
      ? ENTERPRISE_FOOTER_ABOVE
      : {
          minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
        };
    return (
      <RootStyle>
        <HtmlHead locale={locale} isEnterprise={isEnterprise} />
        <TopMenuBar />
        <div style={footerAboveStyle}>
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
              <Route exact={true} path="/account" component={AccountListPage} />
              <Route
                exact={true}
                path="/tokens"
                component={XRC20TokenListPage}
              />
              <Route
                exact={true}
                path="/tokentxns"
                component={XRC20ActionListPage}
              />
              <Route
                exact={true}
                path="/token/:address"
                component={XRC20ActionListPage}
              />
              <Route path="/wallet" component={Wallet} />
              <Route component={NotFound} />
            </Switch>
          </ScrollToTop>
        </div>
        {isEnterprise ? <EnterpriseFooter /> : <Footer />}
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
