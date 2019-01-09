import Component from 'inferno-component';
import {styled} from 'styletron-inferno';
import Helmet from 'inferno-helmet';

import window from 'global';
import {assetURL} from '../../lib/asset-url';
import {fonts} from '../common/styles/style-font';
import {colors} from '../common/styles/style-color';
import {Footer} from '../common/footer';
import {NavContainer} from '../common/nav/nav-container';
import {CookieConsentContainer} from '../common/cookie-consent-container';
import {t} from '../../lib/iso-i18n';

export class WalletApp extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.props.updateWidth(window.innerWidth);
  }

  render() {
    const {children} = this.props;
    return (
      <RootStyle>
        <Helmet
          link={[
            {rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css'},
            {rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Share+Tech'},
            {rel: 'stylesheet', href: '//use.fontawesome.com/releases/v5.0.9/css/all.css'},
            {rel: 'stylesheet', type: 'text/css', href: `${assetURL('/stylesheets/blockchain-explorer.css')}`},
            {rel: 'stylesheet', type: 'text/css', href: `${assetURL('/stylesheets/custom.css')}`},
          ]}
          script={[]}
        />
        <NavContainer/>

        <div style={{minHeight: '100vh'}}>
          {children}
        </div>
        <CookieConsentContainer content={t('other.cookie.content')} accept={t('other.cookie.accept')}/>
        <Footer/>
      </RootStyle>
    );
  }
}

const RootStyle = styled('div', props => ({
  ...fonts.body,
  color: colors.text01,
}));
