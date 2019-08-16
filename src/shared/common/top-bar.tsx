// @ts-ignore
import AntdDropdown from "antd/lib/dropdown";
import AntdMenu from "antd/lib/menu";
import isBrowser from "is-browser";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled, StyleObject } from "onefx/lib/styletron-react";
import { Component } from "react";
import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

// @ts-ignore
import LanguageSwitcher, { Languages } from "iotex-react-language-dropdown";
import { connect } from "react-redux";
import { assetURL } from "./asset-url";
import { Logo } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { SignInModal } from "./sign-in-modal";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { LAP_WIDTH, media } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";

export const TOP_BAR_HEIGHT = 80;

const globalState = isBrowser && JsonGlobal("state");
const multiChain: {
  current: string;
  chains: [
    {
      name: string;
      url: string;
    }
  ];
} = isBrowser && globalState.base.multiChain;

type BlockChainMenu = "dashboard" | "actions" | "blocks";

type State = {
  displayMobileMenu: boolean;
  blockChainMenu: BlockChainMenu;
  isSignInModalShow: boolean;
};

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> &
  WithApolloClient<{}> & { enableSignIn: boolean };

interface MenuItem {
  directTo: string;
  itemText: string;
}

interface LocationMenuItem extends MenuItem {
  menuText: BlockChainMenu;
}

class TopBarComponent extends Component<Props, State> {
  private readonly blockChainMenus: Array<LocationMenuItem> = [
    { directTo: "/", menuText: "dashboard", itemText: "topbar.dashboard" },
    { directTo: "/action", menuText: "actions", itemText: "topbar.actions" },
    { directTo: "/block", menuText: "blocks", itemText: "topbar.blocks" }
  ];

  private readonly toolMenus: Array<MenuItem> = [
    { directTo: "/api-gateway/", itemText: "topbar.explorer_playground" },
    {
      directTo: "https://analytics.iotexscan.io/",
      itemText: "topbar.analytics_playground"
    }
  ];

  constructor(props: Props) {
    super(props);
    this.state = {
      displayMobileMenu: false,
      blockChainMenu: "dashboard",
      isSignInModalShow: false
    };
  }

  public componentDidMount(): void {
    const { location, history } = this.props;
    if (location.pathname === "/") {
      this.setState({ blockChainMenu: "dashboard" });
    } else if (location.pathname.match(/action/)) {
      this.setState({ blockChainMenu: "actions" });
    } else if (location.pathname.match(/block/)) {
      this.setState({ blockChainMenu: "blocks" });
    }
    history.listen(() => {
      this.hideMobileMenu();
    });
    window.addEventListener("resize", () => {
      if (
        document.documentElement &&
        document.documentElement.clientWidth > LAP_WIDTH
      ) {
        this.setState({
          displayMobileMenu: false
        });
      }
    });
  }

  public displayMobileMenu = () => {
    this.setState({
      displayMobileMenu: true
    });
  };

  public hideMobileMenu = () => {
    this.setState({
      displayMobileMenu: false
    });
  };

  public renderBlockchainMenu = () => {
    return (
      <AntdMenu style={overlayStyle}>
        {this.blockChainMenus.map(({ itemText, menuText, directTo }) => (
          <AntdMenu.Item key={itemText}>
            <StyledLink
              to={directTo}
              onClick={() => this.setState({ blockChainMenu: menuText })}
            >
              {t(itemText)}
            </StyledLink>
          </AntdMenu.Item>
        ))}
      </AntdMenu>
    );
  };

  public renderToolMenu = (): JSX.Element => {
    return (
      <AntdMenu style={overlayStyle}>
        {this.toolMenus.map(({ directTo, itemText }) => (
          <AntdMenu.Item key={itemText}>
            {
              <A href={directTo} target="_blank">
                {t(itemText)}
              </A>
            }
          </AntdMenu.Item>
        ))}
      </AntdMenu>
    );
  };

  public renderMutichainMenu = (): JSX.Element | null => {
    if (!multiChain) {
      return null;
    }
    return (
      <AntdMenu style={overlayStyle}>
        {multiChain.chains.map(chain => (
          <AntdMenu.Item key={chain.name}>
            <A href={chain.url} target="_blank" rel="noreferrer">
              {chain.name}
            </A>
          </AntdMenu.Item>
        ))}
      </AntdMenu>
    );
  };

  public renderMenu = () => {
    const votingPageUrl = "https://member.iotex.io";
    const result = [
      <AntdDropdown
        key={0}
        trigger={["click", "hover"]}
        overlay={this.renderBlockchainMenu()}
        getPopupContainer={trigger => trigger.parentElement || document.body}
      >
        <DropDownTitle>
          {t(`topbar.${this.state.blockChainMenu}`)} {DownIcon()}
        </DropDownTitle>
      </AntdDropdown>,
      <AntdDropdown
        key={1}
        trigger={["click", "hover"]}
        overlay={this.renderToolMenu()}
        getPopupContainer={trigger => trigger.parentElement || document.body}
      >
        <DropDownTitle>
          {t("topbar.tools")} {DownIcon()}
        </DropDownTitle>
      </AntdDropdown>,
      <NoBgA href={votingPageUrl} key={2}>
        {t("topbar.voting")}
      </NoBgA>,
      <NoBgLink to="/wallet" key={3}>
        {t("topbar.wallet")}
      </NoBgLink>
    ];

    return this.state.displayMobileMenu && multiChain
      ? [
          ...result,
          <AntdDropdown
            key={4}
            trigger={["click", "hover"]}
            overlay={this.renderMutichainMenu()}
          >
            <StyledLink
              className="ant-dropdown-link"
              style={{ textTransform: "capitalize" }}
              to="#"
            >
              {multiChain.current} {DownIcon()}
            </StyledLink>
          </AntdDropdown>
        ]
      : result;
  };

  public renderMobileMenu = () => {
    if (!this.state.displayMobileMenu) {
      return null;
    }

    return (
      <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
        <Dropdown>{this.renderMenu()}</Dropdown>
      </OutsideClickHandler>
    );
  };

  public renderChainMenu(): JSX.Element | null {
    if (!multiChain) {
      return null;
    }
    return (
      <AntdDropdown
        overlay={this.renderMutichainMenu()}
        trigger={["click", "hover"]}
      >
        <DropDownTitle>
          {multiChain.current} {DownIcon()}
        </DropDownTitle>
      </AntdDropdown>
    );
  }

  public showSignInModal(): void {
    this.setState({ isSignInModalShow: true });
  }

  public closeSignInModal = (): void => {
    this.setState({ isSignInModalShow: false });
  };

  public render(): JSX.Element {
    const displayMobileMenu = this.state.displayMobileMenu;
    const { enableSignIn } = this.props;
    return (
      <div>
        <SignInModal
          visible={this.state.isSignInModalShow}
          closeModal={this.closeSignInModal}
        />
        <Bar>
          <Flex>
            <LogoContent />
          </Flex>
          <Flex style={{ flex: 1, paddingLeft: 1, whiteSpace: "nowrap" }}>
            <Menu>{this.renderMenu()}</Menu>
          </Flex>
          <Flex
            style={{
              flex: 1,
              paddingLeft: 1,
              whiteSpace: "nowrap",
              justifyContent: "flex-end",
              paddingTop: "4px"
            }}
          >
            <Menu>{this.renderChainMenu()}</Menu>
            {enableSignIn ? (
              <SignIn onClick={() => this.showSignInModal()}>
                {t("topbar.sign_in")}
              </SignIn>
            ) : null}
            <LanguageSwitcherWrapper>
              <LanguageSwitcher
                supportedLanguages={[
                  Languages.EN,
                  Languages.ZH_CN,
                  Languages.IT
                ]}
              />
            </LanguageSwitcherWrapper>
          </Flex>
          <HamburgerBtn
            onClick={this.displayMobileMenu}
            displayMobileMenu={displayMobileMenu}
          >
            <Hamburger />
          </HamburgerBtn>
          <CrossBtn displayMobileMenu={displayMobileMenu}>
            <Cross />
          </CrossBtn>
        </Bar>
        <BarPlaceholder />
        {this.renderMobileMenu()}
      </div>
    );
  }
}

export const TopBar = withRouter(
  withApollo<{}>(
    // @ts-ignore
    connect<{ enableSignIn: boolean }>(state => {
      // @ts-ignore
      const { enableSignIn } = state.base;
      return { enableSignIn };
    })(TopBarComponent)
  )
);

const Bar = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  lineHeight: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: colors.nav01,
  color: colors.white,
  position: "fixed",
  top: "0px",
  left: "0px",
  width: "100%",
  "z-index": "70",
  ...contentPadding,
  boxSizing: "border-box"
});

const BarPlaceholder = styled("div", (_: React.CSSProperties) => {
  const height = TOP_BAR_HEIGHT / 2;
  return {
    display: "block",
    padding: `${height}px ${height}px ${height}px ${height}px`,
    backgroundColor: colors.nav01
  };
});

function HamburgerBtn({
  displayMobileMenu,
  children,
  onClick
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
  onClick(): void;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    display: "none!important",
    [media.toLap]: {
      display: "flex!important",
      ...(displayMobileMenu ? { display: "none!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center"
  });
  return <Styled onClick={onClick}>{children}</Styled>;
}

function CrossBtn({
  displayMobileMenu,
  children
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    display: "none!important",
    [media.toLap]: {
      display: "none!important",
      ...(displayMobileMenu ? { display: "flex!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center",
    padding: "5px"
  });
  return <Styled>{children}</Styled>;
}

const LogoWrapper = styled("a", {
  width: "120px",
  height: "50px",
  marginRight: "66px"
});

function LogoContent(): JSX.Element {
  return (
    <LogoWrapper href="/">
      <Logo url={assetURL("/logo_explorer.png")} />
    </LogoWrapper>
  );
}

function DownIcon(): string {
  return "▾";
}

const overlayStyle = {
  backgroundColor: colors.nav01
};

const menuItem: StyleObject = {
  color: `${colors.topbarGray} !important`,
  marginLeft: "14px",
  textDecoration: "none",
  ":hover": {
    color: `${colors.primary} !important`
  },
  ":focus": {
    textDecoration: "none !important"
  },
  transition,
  [media.toLap]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    borderBottom: "1px #EDEDED solid"
  },
  cursor: "pointer",
  textTransform: "capitalize",
  fontSize: "16px"
};

const LanguageSwitcherWrapper = styled("span", {
  marginLeft: "10px",
  [media.toLap]: {
    lineHeight: "130px"
  }
});

const SignIn = styled("span", {
  ...menuItem,
  [media.toLap]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    marginLeft: "-20px"
  },
  cursor: "pointer"
});

const DropDownTitle = styled("div", menuItem);

const A = styled("a", {
  ...menuItem,
  padding: "5px 45px 5px 12px !important",
  ":hover": {
    color: `${colors.primary} !important`,
    backgroundColor: colors.menuHover
  }
});

const NoBgA = styled("a", menuItem);

const NoBgLink = styled(Link, menuItem);

const StyledLink = styled(Link, {
  ...menuItem,
  padding: "5px 45px 5px 12px !important",
  ":hover": {
    color: `${colors.primary} !important`,
    backgroundColor: colors.menuHover
  },
  cursor: "pointer"
});

const Flex = styled("div", (_: React.CSSProperties) => ({
  flexDirection: "row",
  display: "flex",
  boxSizing: "border-box"
}));

const Menu = styled("div", {
  display: "flex!important",
  [media.toLap]: {
    display: "none!important"
  }
});

const Dropdown = styled("div", {
  backgroundColor: colors.nav01,
  display: "flex",
  flexDirection: "column",
  ...contentPadding,
  position: "fixed",
  top: TOP_BAR_HEIGHT,
  "z-index": "10",
  width: "100vw",
  height: "100vh",
  alignItems: "flex-end!important",
  boxSizing: "border-box"
});
