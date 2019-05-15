// @ts-ignore
import Button from "antd/lib/button";
import AntdDropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
// import Input from "antd/lib/input";
import AntdMenu from "antd/lib/menu";
import isBrowser from "is-browser";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { Component } from "react";
import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

import { assetURL } from "./asset-url";
import { Logo } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { media, PALM_WIDTH } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";

export const TOP_BAR_HEIGHT = 100;

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

type State = {
  displayMobileMenu: boolean;
  blockChainMenu: "dashboard" | "actions" | "blocks";
};

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & WithApolloClient<{}> & {};

class TopBarComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMobileMenu: false,
      blockChainMenu: "dashboard"
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
        document.documentElement.clientWidth > PALM_WIDTH
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
        <AntdMenu.Item key={0}>
          <StyledLink
            to="/"
            onClick={() => this.setState({ blockChainMenu: "dashboard" })}
          >
            {t("topbar.dashboard")}
          </StyledLink>
        </AntdMenu.Item>
        <AntdMenu.Item key={1}>
          <StyledLink
            to="/action"
            onClick={() => this.setState({ blockChainMenu: "actions" })}
          >
            {t("topbar.actions")}
          </StyledLink>
        </AntdMenu.Item>
        <AntdMenu.Item key={2}>
          <StyledLink
            to="/block"
            onClick={() => this.setState({ blockChainMenu: "blocks" })}
          >
            {t("topbar.blocks")}
          </StyledLink>
        </AntdMenu.Item>
      </AntdMenu>
    );
  };

  public renderToolMenu = (): JSX.Element => {
    return (
      <AntdMenu style={overlayStyle}>
        <AntdMenu.Item key={0}>
          <A href="/api-gateway/" target="_blank">
            {t("topbar.graphql_playground")}
          </A>
        </AntdMenu.Item>
        <AntdMenu.Item key={1}>
          <A href="/doc/api-gateway/" target="_blank">
            {t("topbar.graphql_doc")}
          </A>
        </AntdMenu.Item>
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
    return [
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
      <>
        {this.state.displayMobileMenu && multiChain && (
          <AntdDropdown
            key={3}
            trigger={["click", "hover"]}
            overlay={this.renderMutichainMenu()}
          >
            <StyledLink
              className="ant-dropdown-link"
              style={{ textTransform: "uppercase" }}
              to="#"
            >
              {multiChain.current} {DownIcon()}
            </StyledLink>
          </AntdDropdown>
        )}
      </>
    ];
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

  public render(): JSX.Element {
    const displayMobileMenu = this.state.displayMobileMenu;

    return (
      <div>
        <Bar>
          <BackHome />
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
              justifyContent: "flex-end"
            }}
          >
            <Menu>{this.renderChainMenu()}</Menu>
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

export const TopBar = withRouter(withApollo(TopBarComponent));

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
  onClick: Function;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    display: "none!important",
    [media.palm]: {
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
    [media.palm]: {
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

function BackHome(): JSX.Element {
  const homePageUrl = "https://iotex.io/";
  return (
    <div
      style={{
        padding: "0 10px",
        borderLeft: `1px solid ${colors.backHome}`,
        borderRight: `1px solid ${colors.backHome}`,
        marginRight: "10px"
      }}
    >
      <a
        href={homePageUrl}
        style={{ color: colors.backHome, lineHeight: 1, fontSize: "14px" }}
      >
        <div>Go back</div>
        <div style={{ fontSize: "16px", letterSpacing: "2.5px" }}>home</div>
      </a>
    </div>
  );
}

function DownIcon(): JSX.Element {
  return <Icon type="caret-down" style={{ color: colors.topbarGray }} />;
}

const overlayStyle = {
  backgroundColor: colors.nav01
};

const menuItem = {
  color: `${colors.topbarGray} !important`,
  marginLeft: "14px",
  textDecoration: "none",
  ":hover": {
    color: `${colors.primary} !important`
  },
  transition,
  fontWeight: "bold",
  [media.palm]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    borderBottom: "1px #EDEDED solid"
  },
  cursor: "pointer"
};

const DropDownTitle = styled("div", menuItem);

const A = styled("a", {
  ...menuItem,
  ":hover": {
    color: `${colors.primary} !important`,
    backgroundColor: colors.topbarGray
  }
});

const NoBgA = styled("a", menuItem);

// @ts-ignore
const StyledLink = styled(Link, {
  ...menuItem,
  ":hover": {
    color: `${colors.primary} !important`,
    backgroundColor: colors.topbarGray
  }
});

const Flex = styled("div", (_: React.CSSProperties) => ({
  flexDirection: "row",
  display: "flex",
  boxSizing: "border-box"
}));

const Menu = styled("div", {
  display: "flex!important",
  [media.palm]: {
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
