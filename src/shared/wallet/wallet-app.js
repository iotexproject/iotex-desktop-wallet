import Component from 'inferno-component';
import {styled} from 'styletron-inferno';
import Helmet from 'inferno-helmet';

import window from 'global';
import {assetURL} from '../../lib/asset-url';
import {fonts} from '../common/styles/style-font';
import {colors} from '../common/styles/style-color';
import {Footer} from '../common/footer';
import {NavContainer} from '../common/nav/nav-container';
import {ProgressBar} from '../common/progress-bar';

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
            {rel: 'stylesheet', type: 'text/css', href: `${assetURL('/stylesheets/blockchain-explorer.css')}`},
            {rel: 'stylesheet', type: 'text/css', href: `${assetURL('/stylesheets/custom.css')}`},
          ]}
          script={[
            {defer: true, src: 'https://use.fontawesome.com/releases/v5.0.7/js/all.js'},
          ]}
        />
        <ProgressBar
          fetching={this.props.fetching}
        />
        <NavContainer/>

        <div style={{minHeight: '100vh'}}>
          {children}
        </div>
        <Footer/>
      </RootStyle>
    );
  }
}

const RootStyle = styled('div', props => ({
  ...fonts.body,
  color: colors.text01,
}));
