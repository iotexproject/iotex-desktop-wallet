// @ts-ignore
import {assetURL} from 'onefx/lib/asset-url';
// @ts-ignore
import {t} from 'onefx/lib/iso-i18n';
// @ts-ignore
import {mobileViewPortContent} from 'onefx/lib/iso-react-render/root/mobile-view-port-content';
// @ts-ignore
import Helmet from 'onefx/lib/react-helmet';
// @ts-ignore
import {styled} from 'onefx/lib/styletron-react';
import {Component} from 'react';
import React from 'react';
import {Switch} from 'react-router';
import {Link, Route} from 'react-router-dom';
import {Flex} from '../../../common/flex';
import {Footer, FOOTER_ABOVE} from '../../../common/footer';
// @ts-ignore
import initGoogleAnalytics from '../../../common/google-analytics';
import {NotFound} from '../../../common/not-found';
import {colors} from '../../../common/styles/style-color';
import {fonts} from '../../../common/styles/style-font';
import {ContentPadding} from '../../../common/styles/style-padding';
import {TopBar} from '../../../common/top-bar';
import {ForgotPassword} from './forgot-password';
import {ResetPasswordContainer} from './reset-password';
import {SignIn} from './sign-in';
import {SignUp} from './sign-up';

type Props = {
  googleTid?: string,
};

export class IdentityApp extends Component<Props> {
  public componentDidMount() {
    initGoogleAnalytics({tid: this.props.googleTid});
  }

  public render() {
    return (
      <RootStyle>
        <Helmet
          title={`${t('meta.title')} - ${t('meta.description')}`}
          meta={[
            {name: 'viewport', content: mobileViewPortContent},
            {name: 'description', content: t('meta.description')},
            {name: 'theme-color', content: colors.brand01},

            // social
            {property: 'og:title', content: `${t('meta.title')}`},
            {property: 'og:description', content: t('meta.description')},
            {property: 'twitter:card', content: 'summary'},
          ]}
          link={[
            // PWA & mobile
            {rel: 'manifest', href: '/manifest.json'},
            {rel: 'apple-touch-icon', href: '/favicon.png'},

            {rel: 'icon', type: 'image/png', sizes: 'any', href: assetURL('/favicon.png')},

            // styles
            {rel: 'stylesheet', type: 'text/css', href: assetURL('/stylesheets/main.css')},
            {href: 'https://fonts.googleapis.com/css?family=Noto+Sans', rel: 'stylesheet', type: 'text/css'},
          ]}
        />
        <TopBar/>
        <div style={FOOTER_ABOVE}>
          <Route path="/email-token/*" component={EmailTokenInvalid}/>
          <Switch>
            <Route exact path="/login" component={SignIn}/>
            <Route exact path="/sign-up" component={SignUp}/>
            <Route exact path="/forgot-password" component={ForgotPassword}/>
            <Route exact path="/email-token/*" component={ForgotPassword}/>
            <Route exact path="/settings/reset-password" component={ResetPasswordContainer}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
        <Footer/>
      </RootStyle>
    );
  }
}

const RootStyle = styled('div', (_: React.CSSProperties) => ({
  ...fonts.body,
  backgroundColor: colors.ui02,
  color: colors.text01,
  textRendering: 'optimizeLegibility',
}));

function EmailTokenInvalid() {
  return (
    <Alert>
      <ContentPadding>
        <Flex>
          {t('auth/forgot_password.email_token_failure')}
          <Link to="/forgot-password/"><i style={{color: colors.inverse01}} className="fas fa-times"></i></Link>
        </Flex>
      </ContentPadding>
    </Alert>
  );
}

const Alert = styled('div', {
  padding: '16px 0 16px 0',
  backgroundColor: colors.error,
  color: colors.inverse01,
});
