// @ts-ignore
import AntdDropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import AntdMenu from "antd/lib/menu";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Component } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Logo } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { media, PALM_WIDTH } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";

export const TOP_BAR_HEIGHT = 62;

type State = {
  displayMobileMenu: boolean;
};

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class TopBarComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMobileMenu: false
    };
  }

  public componentDidMount(): void {
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

  public searchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (value.startsWith("io")) {
      this.props.history.push(`/address/${value}`);
    } else if (value.length === 130) {
      this.props.history.push(`/address/${publicKeyToAddress(value)}`);
    }
  };

  public renderBlockchainMenu = () => {
    return (
      <AntdMenu>
        <AntdMenu.Item key={0}>
          <StyledLink to="/actions">{t("topbar.actions")}</StyledLink>
        </AntdMenu.Item>
        <AntdMenu.Item key={1}>
          <StyledLink to="/blocks">{t("topbar.blocks")}</StyledLink>
        </AntdMenu.Item>
        <AntdMenu.Divider />
        <AntdMenu.Item key={2}>
          <A href="/api-gateway/" target="_blank">
            {t("topbar.graphql_playground")}
          </A>
        </AntdMenu.Item>
        <AntdMenu.Item key={3}>
          <A href="/doc/api-gateway/" target="_blank">
            {t("topbar.graphql_doc")}
          </A>
        </AntdMenu.Item>
      </AntdMenu>
    );
  };

  public renderMenu = () => {
    return [
      <StyledLink key={0} to="/" onClick={this.hideMobileMenu}>
        {t("topbar.home")}
      </StyledLink>,
      <AntdDropdown
        key={1}
        overlay={this.renderBlockchainMenu()}
        getPopupContainer={trigger => trigger.parentElement || document.body}
      >
        <StyledLink className="ant-dropdown-link" to="#">
          {t("topbar.blockchain")} <Icon type="down" />
        </StyledLink>
      </AntdDropdown>
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

  public render(): JSX.Element {
    const displayMobileMenu = this.state.displayMobileMenu;

    return (
      <div>
        <Bar>
          <Flex>
            <LogoContent />
          </Flex>
          <Flex style={{ flex: 1, paddingLeft: 12 }}>
            <Menu>{this.renderMenu()}</Menu>
          </Flex>
          <Flex
            className={"certain-category-search-wrapper"}
            style={{
              width: 350,
              marginBottom: 0,
              float: "right"
            }}
          >
            <Input
              className={"certain-category-search"}
              placeholder="Search by Address / Public Key"
              onPressEnter={this.searchInput}
              suffix={
                <Icon type="search" className={"certain-category-icon"} />
              }
            />
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

export const TopBar = withRouter(TopBarComponent);

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
  height: "50px"
});

function LogoContent(): JSX.Element {
  return (
    <LogoWrapper href="/">
      <Logo url={assetURL("//iotex.io/logo.svg")} />
    </LogoWrapper>
  );
}

const menuItem = {
  color: colors.white,
  marginLeft: "14px",
  textDecoration: "none",
  ":hover": {
    color: colors.primary
  },
  transition,
  fontWeight: "bold",
  [media.palm]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    borderBottom: "1px #EDEDED solid"
  }
};
const A = styled("a", menuItem);
// const BrandText = styled("a", {
//   ...menuItem,
//   marginLeft: 0,
//   [media.palm]: {}
// });
// @ts-ignore
const StyledLink = styled(Link, menuItem);

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
