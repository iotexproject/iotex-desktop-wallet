// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { Component } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { Link } from "react-router-dom";

import { Icon, Input} from "antd";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
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

export class TopBar extends Component<{}, State> {
  constructor(props: {}) {
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

  public renderMenu = () => {
    return [
      <div>
        <A key={0} href="/" onClick={this.hideMobileMenu}>
          {t("topbar.home")}
        </A>
        <A key={111} href="/blocks">Blocks</A>
      </div>
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
            {/*<BrandText href="/">{t("topbar.brand")}</BrandText>*/}
          </Flex>
          <Flex style={{flex:1,paddingLeft:12}}>
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
              placeholder="Search by Block # / Account / Public Key / TX"
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
  "z-index": "1",
  width: "100vw",
  height: "100vh",
  alignItems: "flex-end!important",
  boxSizing: "border-box"
});
