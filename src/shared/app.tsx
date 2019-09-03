// @ts-ignore

// @ts-ignore
import Footer, { FOOTER_HEIGHT } from "iotex-react-footer";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { mobileViewPortContent } from "onefx/lib/iso-react-render/root/mobile-view-port-content";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { ActionDetail } from "./action/action-detail";
import { Actions } from "./actions/actions";
import { AddressDetails } from "./address-details/address-details";
import { BlockDetail } from "./block/block-detail";
import { Blocks } from "./block/blocks";
// @ts-ignore
import initGoogleAnalytics from "./common/google-analytics";
import { HtmlHead } from "./common/html-head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TOP_BAR_HEIGHT } from "./common/top-bar";
import { TopMenuNav } from "./common/top-menu-nav";
import { Home } from "./home/home";
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
        <TopMenuNav />
        <div
          style={{
            minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
          }}
        >
          <ScrollToTop>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                exact
                path="/address/:address"
                component={AddressDetails}
              />
              <Route path="/block/:height" component={BlockDetail} />
              <Route exact path="/block" component={Blocks} />
              <Route exact path="/action/:hash" component={ActionDetail} />
              <Route exact path="/action" component={Actions} />
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
