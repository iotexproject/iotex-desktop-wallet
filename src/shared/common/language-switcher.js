import {Component} from 'react';
import {styled} from 'onefx/lib/styletron-react';
import window from 'global/window';
import {connect} from 'react-redux';
import document from 'global/document';
import OutsideClickHandler from 'react-outside-click-handler';
import {colors} from './styles/style-color';
import {Fa} from './fa';
import {shade} from './styles/shade';

export const DROPDOWN_MENU_WIDTH = 900;
export const MEDIA_DROPDOWN_MENU = `@media only screen and (max-width: ${DROPDOWN_MENU_WIDTH}px)`;

const GOTO_TRANS = 'GOTO_TRANS';
const GOOGLE_TRANSLATE = 'GOOGLE_TRANSLATE';

const languages = [
  {value: 'en', children: 'English'},
  {value: 'zh-CN', children: '简体中文'},
];

class LanguageSwitcher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayTranslationMenu: false,
    };
  }

  switchLanguage(e) {
    const locale = e.currentTarget.value;
    if (locale === GOTO_TRANS) {
      window.location.href = 'https://github.com/iotexproject/web-iotex-translations';
      return;
    }

    const uri = window.location.href;
    window.location.href = updateQueryStringParameter(uri, 'locale', locale);
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    window.googleTranslateElementInit = this.googleTranslateElementInit;
  }

  googleTranslateElementInit = () => {
    const google = window.google;
    if (google) {
      return new google.translate.TranslateElement({autoDisplay: false}, 'google_translate_element');
    }
    return undefined;
  };

  render() {
    let uri = '';
    if (window.location) {
      uri = window.location.href;
    }

    const translationBlock = (
      <div style={{display: this.state.displayTranslationMenu ? 'block' : 'none'}}>
        <LanguageMenu>
          {languages.map((o, i) => {
            if (o.value.toLowerCase() === GOTO_TRANS.toLowerCase()) {
              return (<LanguageItem key={i}><LAnchor href='https://github.com/iotexproject/web-iotex-translations' target='_blank' style={{fontSize: '14px'}}>{o.children}</LAnchor></LanguageItem>);
            }
            if (o.value.toLowerCase() === GOOGLE_TRANSLATE.toLowerCase()) {
              return (<LanguageItem key={i}><GoogleTranslateButton id='google_translate_element' /></LanguageItem>);
            }
            return (<LanguageItem key={i}><LAnchor href={updateQueryStringParameter(uri, 'locale', o.value)}>{o.children}</LAnchor></LanguageItem>);
          })}
        </LanguageMenu>
      </div>
    );

    const hideTranslationMenu = () => {
      this.setState({
        displayTranslationMenu: false,
      });
    };

    return (
      <Wrapper>
        <div>
          <LanguageSwitchButton onclick={e => this.setState({displayTranslationMenu: !this.state.displayTranslationMenu})}>
            <Icon className='fas fa-language'/>
          </LanguageSwitchButton>
          <OutsideClickHandler component='div' onOutsideClick={hideTranslationMenu}>
            {translationBlock}
          </OutsideClickHandler>
        </div>
      </Wrapper>
    );
  }
}

const Wrapper = styled('div', props => ({
  display: 'flex',
  alignSelf: 'center',
  [MEDIA_DROPDOWN_MENU]: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '0',
    lineHeight: '50px',
    height: '50px',
    margin: '2px 0',
    borderBottom: '1px #EDEDED solid',
  },
}));

const Icon = styled(Fa, props => ({
  padding: '13px 5px 13px 20px',
  color: colors.inverse01,
  [MEDIA_DROPDOWN_MENU]: {
    padding: '0 0 0 0',
    alignSelf: 'center',
  },
}));

const LAnchor = styled('a', {
  textDecoration: 'none',
  cursor: 'pointer',
  color: 'white',
  ':hover': {
    color: `${shade(colors.brand01)} !important`,
  },
});

const GoogleTranslateButton = styled('div', {
  overflow: 'hidden',
  position: 'relative',
  fontSize: '10pt',
  width: '98px',
  lineHeight: '7px',
  height: '38px',
  padding: '5px 0px 10px 0px',
  marginBottom: '10px',
  [MEDIA_DROPDOWN_MENU]: {
    display: 'none',
  },
});

const LanguageMenu = styled('ul', {
  position: 'fixed',
  marginLeft: '-10px',
  lineHeight: '40px',
  backgroundColor: colors.nav01,
  width: '170px',
  marginTop: '-7px',
  listStyle: 'none inside',
  paddingLeft: '20px',
  textAlign: 'left',
  [MEDIA_DROPDOWN_MENU]: {
    backgroundColor: '#fff',
  },
});

const LanguageSwitchButton = styled('button', {
  padding: '7px 0px 0px 0px',
  backgroundColor: 'transparent',
  borderStyle: 'none',
  cursor: 'pointer',
  ':focus': {
    outline: 0,
  },
});

const LanguageItem = styled('li', {
  margin: '0px',
  width: '160px',

});

// todo: move to a common file?
function updateQueryStringParameter(uri, key, value) {
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, `$1${key}=${value}$2`);
  }
  return `${uri + separator + key}=${value}`;
}

export const LanguageSwitcherContainer = connect(
  function mapStateToProps(state) {
    const {locale, acceptLanguage, localeSelected} = state.base;
    return {locale, acceptLanguage, localeSelected};
  }
)(LanguageSwitcher);
