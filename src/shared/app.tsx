// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { mobileViewPortContent } from "onefx/lib/iso-react-render/root/mobile-view-port-content";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { AddressDetails } from "./address-details/address-details";
import { BlockDetail } from "./block/block-detail";
import { Blocks as BlockList } from "./block/blocks";
import { Blocks } from "./blocks";
import { Footer, FOOTER_ABOVE } from "./common/footer";
// @ts-ignore
import initGoogleAnalytics from "./common/google-analytics";
import { NotFound } from "./common/not-found";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TopBar } from "./common/top-bar";
import { Home } from "./home/home";

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
        <Helmet
          title={`${t("meta.title")} - ${t("meta.description")}`}
          meta={[
            { name: "viewport", content: mobileViewPortContent },
            { name: "description", content: t("meta.description") },
            { name: "theme-color", content: colors.primary },

            // social
            { property: "og:title", content: `${t("meta.title")}` },
            { property: "og:description", content: t("meta.description") },
            { property: "twitter:card", content: "summary" }
          ]}
          link={[
            // PWA & mobile
            { rel: "manifest", href: "/manifest.json" },
            { rel: "apple-touch-icon", href: "/favicon.png" },

            {
              rel: "icon",
              type: "image/png",
              sizes: "any",
              href: assetURL("/favicon.png")
            },

            // styles
            {
              rel: "stylesheet",
              type: "text/css",
              href: assetURL("/stylesheets/main.css")
            },
            {
              rel: "stylesheet",
              type: "text/css",
              href: assetURL("/antd.css")
            },
            {
              href:
                "https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic",
              rel: "stylesheet",
              type: "text/css"
            }
          ]}
        >
          <html lang={locale} />
        </Helmet>
        <TopBar />
        <div style={FOOTER_ABOVE}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/blocks/" component={Blocks} />
            <Route exact path="/address/:address" component={AddressDetails} />
            <Route exact path="/block/:hash" component={BlockDetail} />
            <Route exact path="/blocks" component={Blocks} />
            <Route exact path="/blocklist" component={BlockList} />
            <Route component={NotFound} />
          </Switch>
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
