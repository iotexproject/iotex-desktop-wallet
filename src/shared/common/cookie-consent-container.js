import {styled} from 'styletron-inferno';
import Component from 'inferno-component';
import window from 'global/window';
import {colors} from './styles/style-color';
import {contentPadding} from './styles/style-padding';

const SMALL_WIDTH = '@media only screen and (max-width: 360px)';

export class CookieConsentContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      closeCookieConsent: true,
    };

    this.closeCookieConsentBanner = this.closeCookieConsentBanner.bind(this);
  }

  componentDidMount() {
    const closed = window.localStorage ? window.localStorage.getItem('closeCookieConsent') : false;
    this.setState({
      closeCookieConsent: closed,
    });
  }

  closeCookieConsentBanner() {
    this.setState({
      closeCookieConsent: true,
    });
    if (window.localStorage) {
      window.localStorage.setItem('closeCookieConsent', true);
    }
  }

  render() {
    let {content, accept} = this.props;
    content = content || 'We use cookies to offer you a better browsing experience, analyse\n' +
      '              site traffic, personalise content. By using our site, you consent to our use of cookies.';
    accept = accept || 'Accept Cookies';

    return (
      <CookieConsentFlex id={'cookie-consent'} display= {this.state.closeCookieConsent ? 'none' : 'block'} >
        <CookieConsentContent>
          <div className='optanon-alert-box-body'>
            <ConsentText> {content} </ConsentText>
          </div>
          <AcceptButtonWrap>
            <SampleButton onClick={this.closeCookieConsentBanner} width='100%'>
              {accept}
            </SampleButton>
          </AcceptButtonWrap>
        </CookieConsentContent>
      </CookieConsentFlex>
    );
  }
}

const AcceptButtonWrap = styled('div', props => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '12px',
}));

const CookieConsentFlex = styled('div', props => ({
  position: 'fixed',
  left: '0px',
  bottom: '4px',
  display: props.display,
  width: '100%',
  zIndex: 71,
  ...contentPadding,
}));

const CookieConsentContent = styled('div', props => ({
  padding: '8px',
  fontSize: '13px!important',
  backgroundColor: colors.nav01,
  opacity: 0.97,
  width: '100%',
  maxWidth: '885px',
  margin: '0 auto',
  display: 'flex',
  color: colors.inverse01,
  border: '1px #00bfbf45 solid',
  borderRadius: '5px',
  [SMALL_WIDTH]: {
    flexDirection: 'column',
  },
}));

const ConsentText = styled('div', props => ({
  margin: 0,
  [SMALL_WIDTH]: {
    marginBottom: '8px',
  },
}));

export const SampleButton = styled('button', {
  cursor: 'pointer',
  '-webkit-transition': 'background 0.3s, border-color 0.3s',
  '-moz-transition': 'background 0.3s, border-color 0.3s',
  transition: 'background 0.3s, border-color 0.3s',
  position: 'relative',
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  textTransform: 'uppercase',
  border: '2px solid transparent',
  borderRadius: '5px !important',
  lineHeight: '22px',
  letterSpacing: 'undefined',
  padding: '7px 10px!important',
  minWidth: '140px',
  fontSize: '12px',
  color: `${colors.inverse01}`,
  fontWeight: '700',
  paddingRight: '24px',
  paddingLeft: '24px',
  background: `${colors.brand03}`,
  ':hover': {
    background: `${colors.brand02}`,
  },
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}
);
