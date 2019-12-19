import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { Component } from "react";
import React from "react";
import { RouteComponentProps, Switch } from "react-router";
import { Link, Route } from "react-router-dom";
import { Flex } from "../../../common/flex";
// import { Footer, FOOTER_ABOVE } from "../../../common/footer";
// @ts-ignore
import initGoogleAnalytics from "../../../common/google-analytics";
import { HtmlHead } from "../../../common/html-head";
// import { Head } from "../../../common/head";
import { NotFound } from "../../../common/not-found";
import { colors } from "../../../common/styles/style-color";
import { fonts } from "../../../common/styles/style-font";
import { ContentPadding } from "../../../common/styles/style-padding";
import { TopMenuBar } from "../../../common/top-menu-bar";
import { ForgotPassword } from "./forgot-password";
import { ResetPasswordContainer } from "./reset-password";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

type Props = {
  googleTid?: string;
  locale?: string;
  isEnterprise?: boolean;
} & RouteComponentProps;

export class IdentityApp extends Component<Props> {
  public componentDidMount(): void {
    initGoogleAnalytics({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    const { locale = "en", isEnterprise = false } = this.props;
    return (
      <RootStyle>
        <HtmlHead locale={locale} isEnterprise={isEnterprise} />
        <TopMenuBar />
        <div>
          <Route path="/email-token/*" component={EmailTokenInvalid} />
          <Switch>
            <Route exact={true} path="/login" component={SignIn} />
            <Route exact={true} path="/sign-up" component={SignUp} />
            <Route
              exact={true}
              path="/forgot-password"
              component={ForgotPassword}
            />
            <Route
              exact={true}
              path="/email-token/*"
              component={ForgotPassword}
            />
            <Route
              exact={true}
              path="/settings/reset-password"
              component={ResetPasswordContainer}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
        {/* <Footer /> */}
      </RootStyle>
    );
  }
}

const RootStyle = styled("div", (_: React.CSSProperties) => ({
  ...fonts.body,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));

function EmailTokenInvalid(): JSX.Element {
  return (
    <Alert>
      <ContentPadding>
        <Flex>
          {t("auth/forgot_password.email_token_failure")}
          <Link to="/forgot-password/">
            <i style={{ color: colors.white }} className="fas fa-times" />
          </Link>
        </Flex>
      </ContentPadding>
    </Alert>
  );
}

const Alert = styled("div", {
  padding: "16px 0 16px 0",
  backgroundColor: colors.error,
  color: colors.white
});
