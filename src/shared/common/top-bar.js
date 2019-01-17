// @flow
/* eslint-disable no-invalid-this,no-unused-vars */
import {Component} from 'react';
import document from 'global/document';
import OutsideClickHandler from 'react-outside-click-handler';
import window from 'global/window';
import {Link} from 'react-router-dom';
import {styled} from 'onefx/lib/styletron-react';

import {assetURL} from 'onefx/lib/asset-url';
import {t} from 'onefx/lib/iso-i18n';
import {colors} from '../common/styles/style-color';
import {contentPadding} from '../common/styles/style-padding';
import {Cross} from '../common/icons/cross.svg.js';
import {Hamburger} from '../common/icons/hamburger.svg.js';
import {media, PALM_WIDTH} from '../common/styles/style-media';
import {transition} from '../common/styles/style-animation';
import {Icon} from './icon';

export const TOP_BAR_HEIGHT = 52;

type State = {
  displayMobileMenu: boolean,
}

export class TopBar extends Component<*, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      displayMobileMenu: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      if (document.documentElement && document.documentElement.clientWidth > PALM_WIDTH) {
        this.setState({
          displayMobileMenu: false,
        });
      }
    });
  }

  displayMobileMenu = () => {
    this.setState({
      displayMobileMenu: true,
    });
  };

  hideMobileMenu = () => {
    this.setState({
      displayMobileMenu: false,
    });
  };

  renderMenu = () => {
    return [
      (<A key={0} href='/' onClick={this.hideMobileMenu}>{t('topbar.home')}</A>),
    ];
  };

  renderMobileMenu = () => {
    if (!this.state.displayMobileMenu) {
      return null;
    }

    return (
      <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
        <Dropdown>
          {this.renderMenu()}
        </Dropdown>
      </OutsideClickHandler>
    );
  };

  render() {
    const displayMobileMenu = this.state.displayMobileMenu;

    return (
      <div>
        <Bar>
          <Flex>
            <BrandText href='/'>{t('topbar.brand')}</BrandText>
          </Flex>
          <Flex>
            <Menu>
              {this.renderMenu()}
            </Menu>
          </Flex>
          <HamburgerBtn
            onClick={this.displayMobileMenu}
            displayMobileMenu={displayMobileMenu}
          >
            <Hamburger/>
          </HamburgerBtn>
          <CrossBtn displayMobileMenu={displayMobileMenu}>
            <Cross/>
          </CrossBtn>
        </Bar>
        <BarPlaceholder/>
        {this.renderMobileMenu()}
      </div>
    );
  }
}

const Bar = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  lineHeight: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: colors.nav01,
  color: colors.inverse01,
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '100%',
  'z-index': '70',
  ...contentPadding,
  boxSizing: 'border-box',
});

const BarPlaceholder = styled('div', props => {
  const height = TOP_BAR_HEIGHT / 2;
  return {
    display: 'block',
    padding: `${height}px ${height}px ${height}px ${height}px`,
    backgroundColor: colors.nav01,
  };
});

function HamburgerBtn({displayMobileMenu, children, onClick}: any) {
  const Styled = styled('div', ({
    ':hover': {
      color: colors.brand01,
    },
    display: 'none!important',
    [media.palm]: {
      display: 'flex!important',
      ...(displayMobileMenu ? {display: 'none!important'} : {}),
    },
    cursor: 'pointer',
    justifyContent: 'center',
  }));
  return (
    <Styled onClick={onClick}>{children}</Styled>
  );
}

function CrossBtn({displayMobileMenu, children}: any) {
  const Styled = styled('div', ({
    ':hover': {
      color: colors.brand01,
    },
    display: 'none!important',
    [media.palm]: {
      display: 'none!important',
      ...(displayMobileMenu ? {display: 'flex!important'} : {}),
    },
    cursor: 'pointer',
    justifyContent: 'center',
    padding: '5px',
  }));
  return (
    <Styled>{children}</Styled>
  );
}

const LogoWrapper = styled('a', {
  width: '50px',
  height: '50px',
});

function Logo() {
  return (
    <LogoWrapper href='/'>
      <Icon url={assetURL('/favicon.png')}/>
    </LogoWrapper>
  );
}

const menuItem = {
  color: colors.inverse01,
  marginLeft: '14px',
  textDecoration: 'none',
  ':hover': {
    color: colors.brand01,
  },
  transition,
  fontWeight: 'bold',
  [media.palm]: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '16px 0 16px 0',
    borderBottom: '1px #EDEDED solid',
  },
};
const A = styled('a', menuItem);
const BrandText = styled('a', {
  ...menuItem,
  marginLeft: 0,
  [media.palm]: {},
});
const StyledLink = styled(Link, menuItem);

const Flex = styled('div', props => ({
  flexDirection: 'row',
  display: 'flex',
  boxSizing: 'border-box',
}));

const Menu = styled('div', {
  display: 'flex!important',
  [media.palm]: {
    display: 'none!important',
  },
});

const Dropdown = styled('div', {
  backgroundColor: colors.nav01,
  display: 'flex',
  flexDirection: 'column',
  ...contentPadding,
  position: 'fixed',
  top: TOP_BAR_HEIGHT,
  'z-index': '1',
  width: '100vw',
  height: '100vh',
  alignItems: 'flex-end!important',
  boxSizing: 'border-box',
});
