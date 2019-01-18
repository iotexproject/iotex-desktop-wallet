// @flow

import {Component} from 'react';
import {styled} from 'onefx/lib/styletron-react';
import Helmet from 'onefx/lib/react-helmet';
import {Link, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import {t} from 'onefx/lib/iso-i18n';
import {mobileViewPortContent} from 'onefx/lib/iso-react-render/root/mobile-view-port-content';
import {assetURL} from 'onefx/lib/asset-url';
import {TopBar} from '../../../common/top-bar';
import {fonts} from '../../../common/styles/style-font';
import {colors} from '../../../common/styles/style-color';
import {Footer, FOOTER_ABOVE} from '../../../common/footer';
import {initGoogleAnalytics} from '../../../common/google-analytics';
import {NotFound} from '../../../common/not-found';
import {ContentPadding} from '../../../common/styles/style-padding';
import {Flex} from '../../../common/flex';
import {SignIn} from './sign-in';
import {SignUp} from './sign-up';
import {ForgotPassword} from './forgot-password';
import {ResetPasswordContainer} from './reset-password';

type Props = {
  googleTid: string,
};

export class IdentityApp extends Component<Props> {
  props: Props;

  componentDidMount() {
    initGoogleAnalytics({tid: this.props.googleTid});
  }

  render() {
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
          <Route path='/email-token/*' component={EmailTokenInvalid}/>
          <Switch>
            <Route exact path='/login' component={SignIn}/>
            <Route exact path='/sign-up' component={SignUp}/>
            <Route exact path='/forgot-password' component={ForgotPassword}/>
            <Route exact path='/email-token/*' component={ForgotPassword}/>
            <Route exact path='/settings/reset-password' component={ResetPasswordContainer}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
        <Footer/>
      </RootStyle>
    );
  }
}

const RootStyle = styled('div', props => ({
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
          <Link to='/forgot-password/'><i style={{color: colors.inverse01}} className='fas fa-times'></i></Link>
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
